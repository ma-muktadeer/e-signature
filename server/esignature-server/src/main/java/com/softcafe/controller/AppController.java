package com.softcafe.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.processor.service.ProcessorService;
import com.delfian.core.message.service.ServiceCoordinator;
import com.softcafe.core.model.DocumentFiles;
import com.softcafe.core.service.DocumentFilesService;
import com.softcafe.core.service.UserService;
import com.softcafe.esignature.entity.AgreementFileInfo;
import com.softcafe.esignature.entity.Request;
import com.softcafe.esignature.entity.Signatory;
import com.softcafe.esignature.entity.Signature;
import com.softcafe.esignature.entity.SignatureDownloadInfo;
import com.softcafe.esignature.entity.SignatureInfo;
import com.softcafe.esignature.report.ReportSearch;
import com.softcafe.esignature.report.SignatureSearchResponse;
import com.softcafe.esignature.service.AgreementFileInfoService;
import com.softcafe.esignature.service.DownloadService;
import com.softcafe.esignature.service.ReportSearchService;
import com.softcafe.esignature.service.RequestService;
import com.softcafe.esignature.service.SignatoryService;
import com.softcafe.esignature.service.SignatureInfoService;
import com.softcafe.esignature.service.SignatureService;
import com.softcafe.esignature.view.LoggedReportView;
import com.softcafe.esignature.view.UserReportView;

@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" }, allowCredentials = "true")
@RestController
@RequestMapping(value = "/secure")
public class AppController {
	private static final String VIA = "VIA";

	private static final String USERID = "UserId";

	private static final Logger log = LoggerFactory.getLogger(AppController.class);

	@Value("${report.name:MsgDetails}")
	private String reportName;

	@Value("${dateformat:yyyy-MM-dd HH:mm:ss}")
	private String dateformat;

	@Value("${use.time:true}")
	private boolean useTime;

	@Autowired
	ProcessorService processorService;
	@Autowired
	ServiceCoordinator serviceCoordinator;
	@Autowired
	private DocumentFilesService documentFilesService;

	@Autowired
	UserService userService;
	@Autowired
	private DownloadService downloadService;
	@Autowired
	private AgreementFileInfoService agreementFileService;

	@Autowired
	private SignatureService signatureService;

	@Autowired
	private SignatureInfoService signatureInfoService;

	@Autowired
	private SignatoryService signatoryService;

	@Autowired
	private RequestService requestService;

	@Autowired
	ReportSearchService reportSearchService;
	
//	@CrossOrigin(origins = "http://localhost:4200")
//	@RequestMapping(value = "/save/request", method = RequestMethod.POST)
//	public Page<?> saveRequestDoc(@ModelAttribute(name = "entity") Request entity, Principal principal,
//			HttpServletRequest req) throws Exception {

	@RequestMapping(value = "/jsonRequest", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> handleJsonRequest(@RequestBody String json, HttpServletRequest req,
			Principal pricipal) {

		log.trace("UI request \n{}", json);

		Message requestMessage = null;
		Message processedMessage = null;
		String serverResponse = null;
		try {
			requestMessage = processorService.fromJson(json);

			boolean isAuth = checkAuthRequest(req, requestMessage);
			
			if(!isAuth) {
				return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Unauthorized request.");
			}
			
			requestMessage.getHeader().setSenderSourceIPAddress(req.getRemoteAddr());
			requestMessage.getHeader().setSenderGatewayIPAddress(req.getHeader(VIA));
			processedMessage = serviceCoordinator.service(requestMessage);

			processedMessage.getHeader().setSenderSourceIPAddress("");

			serverResponse = processorService.toJson(processedMessage);
//			log.info("Full Response: [{}]:[{}]\n[{}]", requestMessage.getHeader().getActionType(), requestMessage.getHeader().getContentType(), serverResponse);
		} catch (Exception e) {
			log.error("Exception processing message [{}]", e);
		}

		return ResponseEntity.ok(serverResponse);
	}

	private boolean checkAuthRequest(HttpServletRequest req, Message requestMessage) throws Exception{

		Long userId = Long.valueOf(req.getHeader("UserId"));

		if (userId == null) {
			log.info("can not found login id for accepting first agreement.");
			return false;
		}

		if (requestMessage.getHeader().getUserId() != null
				&& userId != requestMessage.getHeader().getUserId().longValue()) {
			log.info("user id is not match. login id from token:payload is= {}:{}", userId,
					requestMessage.getHeader().getUserId());
			return false;
		}
		String ref = requestMessage.getHeader().getReferance();
		return StringUtils.isBlank(ref) || (StringUtils.isNotBlank(ref) && ref.matches("^[a-zA-Z0-9_-]+$"));
	}

	@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" })
	@RequestMapping(value = "/signature/upload", method = RequestMethod.POST)
	public List<Signature> signatureUploadHandel(@RequestParam(required = false, name = "files") MultipartFile[] files,
			@ModelAttribute(name = "entity") Signature entity, Principal principal, HttpServletRequest req)
			throws Exception {

		Long userId = Long.valueOf(req.getHeader(USERID));

		String senderGatewayIPAddress = req.getHeader("X-Forwarded-For");
		String senderSourceIPAddress = req.getRemoteAddr();

		try {
			return signatureService.signatureUploadHandel(files, entity, userId, senderSourceIPAddress,
					senderGatewayIPAddress);
		} catch (Exception e) {

			log.info("error found as {}", e.getMessage());
			throw new Exception(e.getMessage());
		}
//		return signatureInfoService.signatureUploadHandel(files, entity);
	}

//	@CrossOrigin(origins = "http://localhost:4200")
//	@RequestMapping(value = "/file/upload", method = RequestMethod.POST)
//	public Signature fileUploadHandel(HttpServletRequest req,
//			@RequestParam(required = false, name = "files") MultipartFile[] files, Principal principal)
//			throws Exception {
//
//		Long userId = Long.valueOf(req.getHeader(USERID));
////		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//		return signatureService.fileUploadHandel(files, userId);
//	}

	@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" })
	@RequestMapping(value = "/file/upload", method = RequestMethod.POST)
	public ResponseEntity<?> fileUploadHandel(HttpServletRequest req,
			@RequestParam(required = false, name = "files") MultipartFile[] files,
			@RequestParam(required = false, name = "institutionId") Long institutionId, Principal principal)
			throws Exception {

		if (files[0].isEmpty()) {
			return ResponseEntity.badRequest().body("Please select a file to upload");
		}

		try {
			Long userId = Long.valueOf(req.getHeader(USERID));
			return ResponseEntity.status(HttpStatus.OK)
					.body(signatureService.fileUploadHandel(files, userId, institutionId));
		} catch (IOException e) {
			log.info("getting error, {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
		}
	}

	@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" })
	@RequestMapping(value = "/upload/profile/image", method = RequestMethod.POST)
	public ResponseEntity<String> prifileImageUpload(HttpServletRequest req,
			@RequestParam(required = false, name = "profileImage") MultipartFile[] files, Principal principal)
			throws Exception {

		if (files[0].isEmpty()) {
			return ResponseEntity.badRequest().body("Please select a file to upload");
		}

		try {
			Long userId = Long.valueOf(req.getHeader(USERID));

//			return ResponseEntity.status(HttpStatus.OK)
//					.body(signatureService.fileUploadHandel(files, userId, institutionId));
			return ResponseEntity.status(HttpStatus.OK).body(userService.saveUserProfileImg(files, userId));

//			return null;
		} catch (IOException e) {
			log.info("getting error, {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
		}
	}

	@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" })
	@RequestMapping(value = "/save/signatory", method = RequestMethod.POST)
	public ResponseEntity<?> saveSignatory(@ModelAttribute(name = "entity") Signatory entity,
			@RequestParam(name = "files", required = false) MultipartFile[] othersDocs, HttpServletRequest req)
			throws Exception {

		Long userId = Long.valueOf(req.getHeader(USERID));

		String senderGatewayIPAddress = req.getHeader("X-Forwarded-For");
		String senderSourceIPAddress = req.getRemoteAddr();

		try {
//			return null;
//			signatoryService.signatoryUploadHandel(entity, userId, othersDocs);
			return ResponseEntity.ok(signatoryService.signatoryUploadHandel(entity, userId, othersDocs,
					senderSourceIPAddress, senderGatewayIPAddress));
		} catch (Exception e) {

			log.info("error found as {}", e.getMessage());
//			throw new Exception(e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" })
	@RequestMapping(value = "/save/sample/doc", method = RequestMethod.POST)
	public ResponseEntity<?> saveSampleDoc(@ModelAttribute(name = "entity") Signatory entity,
			@RequestParam(name = "files", required = false) MultipartFile[] othersDocs, HttpServletRequest req)
			throws Exception {

		Long userId = Long.valueOf(req.getHeader(USERID));

		try {

			return ResponseEntity.status(HttpStatus.OK)
					.body(documentFilesService.saveSampleDoc(entity, othersDocs, userId));

//			return documentFilesService.saveSampleDoc(entity, othersDocs,userId);
		} catch (Exception e) {

			log.info("error found as {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save Sample Document.");
		}
	}

	@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" })
	@PostMapping("/upload/agreement")
	public ResponseEntity<List<AgreementFileInfo>> saveAgreement(
			@ModelAttribute(name = "entity") AgreementFileInfo entity, Principal principal, HttpServletRequest req)
			throws Exception {

		Long userId = Long.valueOf(req.getHeader(USERID));
		try {
			return ResponseEntity.ok(agreementFileService.saveAgreement(entity, userId));
		} catch (Exception e) {

//			throw new RuntimeException("Test.....");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		}

//		return null;
	}

	@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" })
	@PostMapping("/upload/diclaimer")
	public ResponseEntity<List<AgreementFileInfo>> saveLegalDiclaimer(
			@ModelAttribute(name = "entity") AgreementFileInfo entity, Principal principal, HttpServletRequest req)
			throws Exception {

		Long userId = Long.valueOf(req.getHeader(USERID));
		try {
			return ResponseEntity.ok(agreementFileService.saveDiclaimer(entity, userId));
		} catch (Exception e) {

//			throw new RuntimeException("Test.....");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		}

//		return null;
	}

	@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" })
	@PostMapping("/update/signature")
	public ResponseEntity<?> updateSignature(@ModelAttribute(name = "entity") SignatureInfo entity,
			@RequestParam(name = "files", required = false) MultipartFile[] othersDocs, HttpServletRequest req)
			throws Exception {

		Long userId = Long.valueOf(req.getHeader(USERID));

		String senderGatewayIPAddress = req.getHeader("X-Forwarded-For");
		String senderSourceIPAddress = req.getRemoteAddr();

		SignatureInfo sg = null;
		try {

//			return null;
			SignatureInfo nSg = new SignatureInfo();
			nSg.setStatus(entity.getStatus());
			nSg.setPageNumber(entity.getPageNumber());
			nSg.setPageSize(entity.getPageSize());
			nSg.setUpdateSignature(new ArrayList<SignatureInfo>(Arrays.asList(entity)));
			sg = signatureInfoService.update(nSg, userId, othersDocs, senderSourceIPAddress, senderGatewayIPAddress);

//			Signatory sig = signatoryService.findBySignatoryId(sg.getSignatoryId());
//			if (othersDocs != null && othersDocs.length > 0) {
//				log.info("trying to save others documents for signatoryId:[{}]", entity.getSignatoryId());
//				documentFilesService.saveSignatoryDocument(entity.getSignatoryId(), new Signatory(), othersDocs,
//						userId, sig);
//			}

			return ResponseEntity.ok(sg);
		} catch (Exception e) {

			log.info("error found as {}", e.getMessage());
//			throw new Exception(e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
//		return signatureInfoService.signatureUploadHandel(files, entity);
	}

	@RequestMapping(value = "/admin/jsonRequest", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> adminReq(@RequestBody String json, HttpServletRequest req, Principal pricipal) {
		return handleJsonRequest(json, req, pricipal);
	}

	@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" })
	@RequestMapping(value = "/file/download", method = RequestMethod.POST)
	public ResponseEntity<?> downloadDocumentFiles(@RequestBody DocumentFiles entity, Principal principal,
			HttpServletRequest req) throws Exception {
		Long userId = Long.valueOf(req.getHeader(USERID));

		return documentFilesService.downloadFile(entity);

//		return signatureInfoService.signatureUploadHandel(files, entity);
	}

	@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" })
	@RequestMapping(value = "/save/request", method = RequestMethod.POST)
	public Page<?> saveRequestDoc(@ModelAttribute(name = "entity") Request entity, Principal principal,
			HttpServletRequest req) throws Exception {
		Long userId = Long.valueOf(req.getHeader(USERID));

		try {

			requestService.saveRequest(entity, userId);
			Pageable pageable = PageRequest.of(entity.getPageNumber() != 0 ? entity.getPageNumber() - 1 : 0,
					entity.getPageSize() != 0 ? entity.getPageSize() : 20);

			return requestService.loadRequest(userId, pageable);

		} catch (Exception e) {
			log.info("getting error for save request. \n{}", e.getMessage());
			throw new Exception(e.getMessage());
		}

	}

	@CrossOrigin(origins = { "http://localhost:4200",
			"http://10.100.100.166:8080" }, exposedHeaders = "Content-Disposition")
	@PostMapping(value = "/download/signature", produces = "multipart/form-data")
	public ResponseEntity<StreamingResponseBody> downloadSignature(
			@RequestParam(name = "signatureId", required = false) Long signatureId,
			@RequestParam(name = "userId") Long userId, @ModelAttribute(name = "entity") SignatureDownloadInfo sgInfo,
			HttpServletRequest http) {

		return downloadService.downloadSignature(signatureId, userId, sgInfo, http);
	}

	@CrossOrigin(origins = { "http://localhost:4200/",
			"http://10.100.100.166:8080" }, exposedHeaders = "Content-Disposition")
	@PostMapping("/download/template")
	public ResponseEntity<Resource> downloadTemplate(@RequestParam(name = "userId") Long userId,
			HttpServletRequest http) {

		return downloadService.downloadTemplate(userId, http);
	}

	@GetMapping(value = "/init")
	public void initApp() {

	}

	@GetMapping(value = "/ping")
	public String ping(Principal pricipal) {
		return "pong";
	}

	@PostMapping(value = "/user/report/download")
	public ResponseEntity<SignatureSearchResponse> incidentMonitoring2(@RequestBody ReportSearch reportSearch,
			HttpServletRequest req) throws Exception {

		List<UserReportView> list = reportSearchService.selectUserDownloadReport(reportSearch);
		// generate excel file

		SignatureSearchResponse incidentFile = reportSearchService.writeXlsx(list);

		return ResponseEntity.ok().body(incidentFile);
	}
	
	@PostMapping(value = "/logged/report/download")
	public ResponseEntity<?> incidentMonitoring3(@RequestBody ReportSearch reportSearch,
			HttpServletRequest req) throws Exception {

		List<LoggedReportView> list = reportSearchService.selectLoggedDownloadReport(reportSearch);
		// generate excel file

		SignatureSearchResponse incidentFile = reportSearchService.writeXlsxu(list);
//		reportSearchService.exportToExcel(list, "limon.excel");


		return ResponseEntity.ok().body(incidentFile);
	}

	@RequestMapping(path = "/download/common/excel", method = RequestMethod.GET)
	public ResponseEntity<byte[]> downloadCommonExcelFile(@RequestParam("filePath") String filePath)
			throws IOException {

		log.info(filePath);
		File file = new File(filePath);

		HttpHeaders header = new HttpHeaders();
		header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; " + file.getName());
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("Pragma", "no-cache");
		header.add("Expires", "0");

		Path path = Paths.get(file.getAbsolutePath());

		return ResponseEntity.ok().headers(header).contentLength(file.length())
				.contentType(MediaType.parseMediaType("application/octet-stream")).body(Files.readAllBytes(path));
	}

}
