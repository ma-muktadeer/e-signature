package com.softcafe.esignature.service;

import java.io.InputStream;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.softcafe.esignature.entity.SignatureDownloadInfo;
import com.softcafe.esignature.entity.SignatureInfo;
import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.utils.ActivityType;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;

@Service
public class DownloadService {
	private static final Logger log = LoggerFactory.getLogger(DownloadService.class);

	@Autowired
	private ResourceLoader resourceLoader;

	@Autowired
	private SignatureInfoService signatureInfoService;

	@Autowired
	private ActivityLogService activityLogService;

	@Autowired
	private SignatureDownloadInfoService downloadInfoService;

	@Autowired
	private AppJdbcService appJdbcService;

	@Autowired
	private MailTempleteService mailTempleteService;

	public ResponseEntity<StreamingResponseBody> downloadSignature(Long signatureId, Long userId,
			SignatureDownloadInfo sgInfo, HttpServletRequest http) {

		try {
			sgInfo.setDownloadBy(userId);
			SignatureDownloadInfo sdInf = downloadInfoService.saveInformation(sgInfo);
			return downloadSignature(signatureId, userId, http, sgInfo.getDownloadType().toString(), sdInf);
		} catch (Exception e) {
			log.info("getting error. {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	private ResponseEntity<StreamingResponseBody> downloadSignature(Long signatureId, Long userId,
			HttpServletRequest http, String downloadType, SignatureDownloadInfo sdInf) {
		try {
			StreamingResponseBody responseBody = null;
			ByteArrayResource resource = null;
			SignatureInfo sInfo = null;
			String fileName = "";
			MailType mType = null;
			if (downloadType.equals("FULL")) {
				log.info("download full signature.");

				resource = (ByteArrayResource) generateFullBooklet();
				fileName = "full-booklet";
			} else {
				sInfo = signatureInfoService.findAllBySignatureId(signatureId);
				resource = (ByteArrayResource) generateReport(sInfo.getEmployeeId(), sInfo.getInstitutionId());
				fileName = sInfo.getEmployeeId();
			}

			if (!resource.exists()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}

			responseBody = buildStringResponse(resource);

			if (sInfo != null) {
				activityLogService.save(userId, sdInf.getSignatureDownId(), ActivityType.DOWNLOAD_SIGANTURE,
						http.getRemoteAddr(), http.getHeader("VIA"));
				mType = MailType.SINGLE_SIGNATURE;
			} else {
				activityLogService.save(userId, sdInf.getSignatureDownId(), ActivityType.DOWNLOAD_FULL_SIGANTURE,
						http.getRemoteAddr(), http.getHeader("VIA"));

				mType = MailType.FULL_SIGNATURE;
			}

			// send mail
//			MailType mType = downloadType.equals("FULL") ? MailType.FULL_SIGNATURE
//					: MailType.SINGLE_SIGNATURE;

			mailTempleteService.sendingDownloadNotification(userId, sdInf, sInfo, mType);
//            
			return ResponseEntity.ok()
					.header(HttpHeaders.CONTENT_DISPOSITION,
							"attachment; filename=\"e-signature(" + fileName + ").pdf\"")
					.contentType(MediaType.APPLICATION_OCTET_STREAM).contentLength(resource.contentLength())
					.body(responseBody);
		} catch (Exception e) {
			log.info("getting error for downloading singnature");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	private StreamingResponseBody buildStringResponse(ByteArrayResource resource) {

		return outputStream -> {
			try (InputStream inputStream = resource.getInputStream()) {
				byte[] buffer = new byte[1024];
				int bytesRead;
				while ((bytesRead = inputStream.read(buffer)) != -1) {
					outputStream.write(buffer, 0, bytesRead);
				}
			} catch (Exception e) {
				log.error("Error streaming the file: {}", e.getMessage());
			}
		};
	}

	public ResponseEntity<Resource> downloadTemplate(Long userId, HttpServletRequest http) {
		try {
			String path = "classpath:data/template.xlsx";
//			File file = new File(path);
			Resource resource = resourceLoader.getResource(path);

			if (!resource.exists()) {
				log.info("file not found");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}

//            Resource resource = new FileSystemResource(file);
			HttpHeaders headers = new HttpHeaders();
			headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + resource.getFilename());
			headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);

			return ResponseEntity.ok().headers(headers).contentLength(resource.contentLength()).body(resource);
		} catch (Exception e) {
			log.info("getting error for downloading template");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	public Resource generateReport(String empId, Long institutionId) throws JRException {
		try (Connection con = appJdbcService.getJdbcConnection()) {
			// Load JRXML file from the classpath
			Resource resource = resourceLoader.getResource("classpath:jasper/download_signature.jrxml");
			InputStream inputStream = resource.getInputStream();

			JasperReport jasperReport = JasperCompileManager.compileReport(inputStream);

			Map<String, Object> parameters = new HashMap<>();
			// Add parameters if needed
			parameters.put("TX_EMPLOYEE_ID", empId);
			parameters.put("ID_INSTITUTION_KEY", institutionId);

			JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, con);

			byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

			// Return ByteArrayResource instead of InputStreamResource
			return new ByteArrayResource(pdfBytes);

		} catch (Exception e) {
			log.info("getting error to generation pdf. {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}

	public Resource generateFullBooklet() throws JRException {
		try (Connection con = appJdbcService.getJdbcConnection()) {
			// Load JRXML file from the classpath
			Resource resource = resourceLoader.getResource("classpath:jasper/download_signature_full.jrxml");
			InputStream inputStream = resource.getInputStream();

			JasperReport jasperReport = JasperCompileManager.compileReport(inputStream);

			Map<String, Object> parameters = new HashMap<>();
			// Add parameters if needed
//            parameters.put("TX_EMPLOYEE_ID", null);

			JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, con);

			byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

			// Return ByteArrayResource instead of InputStreamResource
			return new ByteArrayResource(pdfBytes);
//            return pdfBytes;

		} catch (Exception e) {
			log.info("getting error to generation pdf. {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}

}
