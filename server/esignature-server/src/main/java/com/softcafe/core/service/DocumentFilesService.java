package com.softcafe.core.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.google.gson.Gson;
import com.jayway.jsonpath.PathNotFoundException;
import com.softcafe.constants.ActionType;
import com.softcafe.core.model.DocumentFiles;
import com.softcafe.core.repo.DocumentFilesRepo;
import com.softcafe.esignature.entity.AgreementFileInfo;
import com.softcafe.esignature.entity.Institution;
import com.softcafe.esignature.entity.Signatory;
import com.softcafe.esignature.entity.SignatureInfo;
import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.service.ActivityLogService;
import com.softcafe.esignature.service.AgreementFileInfoService;
import com.softcafe.esignature.service.InstitutionService;
import com.softcafe.esignature.service.MailTempleteService;
import com.softcafe.esignature.service.SignatoryService;
import com.softcafe.esignature.service.SignatureInfoService;
import com.softcafe.esignature.utils.ActivityType;
import com.softcafe.esignature.utils.DocumentFielsUtils;
import com.softcafe.esignature.utils.Str;
import com.softcafe.esignature.utils.Utils;

@Service
public class DocumentFilesService extends AbstractService<List<DocumentFiles>> {
	private static final Logger log = LoggerFactory.getLogger(DocumentFilesService.class);

	Gson json;
	{
		json = new Gson();
	}
	@Value("${document.file.base.path}")
	private String documentBasePath;

	@Value("${notification.when.institution}")
	private String institutionName;

	@Autowired
	private DocumentFilesRepo documentFilesRepo;

	@Autowired
	private MailTempleteService mailTempleteService;

	@Autowired
	private AgreementFileInfoService agreementFileInfoService;

	@Autowired
	private InstitutionService institutionService;

	@Autowired
	private SConfigurationService sConfigurationService;
	@Autowired
	private ActivityLogService activityLogService;
	@Autowired
	private SignatureInfoService signatureInfoService;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {

			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.LOAD_IMAGE.toString())) {
				List<String> userLIst = loadImage(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.BUILD_IMAGE64.toString())) {
				String userLIst = buildImage(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.SELECT_ALL_AGREEMENT.toString())) {
				List<AgreementFileInfo> userLIst = selectAllAgreement(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_DELETE_AGREEMENT.toString())) {
				List<AgreementFileInfo> userLIst = deleteAgreement(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.SELECT_ALL_LEGAL.toString())) {
				List<AgreementFileInfo> userLIst = selectAllLegal(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.SELECT_SAMPLE_DOC.toString())) {
				List<DocumentFiles> userLIst = selectSampleDoc(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.DELETE_SAMPLE_DOC.toString())) {
				List<DocumentFiles> userLIst = deleteSampleDoc(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.APPROVE_SAMPLE_DOC.toString())) {
				List<DocumentFiles> userLIst = approveSampleDoc(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_PEND_DELETE.toString())) {
				List<DocumentFiles> userLIst = pendDeleteSampleDoc(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
		}

		return msgResponse;
	}

	private List<DocumentFiles> deleteSampleDoc(Message<List<DocumentFiles>> requestMessage, String actionType) {
		DocumentFiles df = requestMessage.getPayload().get(0);
		if (df.getDocumetnFilesId() == null) {
			log.info("can not find document file id for deletting sample document.");
			throw new RuntimeException("Invalid request.");
		}
		log.info("Deletting sample Document. document file id is:{}", df.getDocumetnFilesId());
		df = documentFilesRepo.findAllByDocumetnFilesIdAndActive(df.getDocumetnFilesId(), 1);
		if (df == null) {
			log.info("can not find smple document for documentFileId:{}.", df.getDocumetnFilesId());
			throw new RuntimeException("Invalid request.");
		}
		deleteSampleDocument(df, requestMessage.getHeader().getUserId().longValue());
		return selectSampleDoc(requestMessage, actionType);
	}

	private List<DocumentFiles> pendDeleteSampleDoc(Message<List<DocumentFiles>> requestMessage, String actionType) {
		DocumentFiles df = requestMessage.getPayload().get(0);
		if (df.getDocumetnFilesId() == null) {
			log.info("can not find document file id for deletting sample document.");
			throw new RuntimeException("Invalid request.");
		}
		log.info("Deletting sample Document. document file id is:{}", df.getDocumetnFilesId());
		df = documentFilesRepo.findAllByDocumetnFilesIdAndActive(df.getDocumetnFilesId(), 1);
		if (df == null) {
			log.info("can not find smple document for documentFileId:{}.", df.getDocumetnFilesId());
			throw new RuntimeException("Invalid request.");
		}
		pendDeleteSampleDocument(df, requestMessage.getHeader().getUserId().longValue());
		return selectSampleDoc(requestMessage, actionType);
	}

	private List<DocumentFiles> approveSampleDoc(Message<List<DocumentFiles>> requestMessage, String actionType) {
		DocumentFiles df = requestMessage.getPayload().get(0);
		if (df.getDocumetnFilesId() == null) {
			log.info("can not find document file id for approving sample document.");
			throw new RuntimeException("Invalid request.");
		}
		log.info("Approving sample Document. document file id is:{}", df.getDocumetnFilesId());
		df = documentFilesRepo.findAllByDocumetnFilesIdAndActive(df.getDocumetnFilesId(), 1);
		if (df == null) {
			log.info("can not find smple document for documentFileId:{}.", df.getDocumetnFilesId());
			throw new RuntimeException("Invalid request.");
		}
		aprvSampleDocument(df, requestMessage.getHeader().getUserId().longValue());
		return selectSampleDoc(requestMessage, actionType);
	}

	private void aprvSampleDocument(DocumentFiles dbDoc, long userId) {
		dbDoc.setStatus(Str.APPROVED);
		dbDoc.setApproveById(userId);
		update(dbDoc, userId);
	}

	private DocumentFiles update(DocumentFiles dbDoc, long userId) {
		dbDoc.setUserModId(userId);
		return documentFilesRepo.save(dbDoc);
	}

	private void deleteSampleDocument(DocumentFiles dbDoc, long userId) {
		dbDoc.setActive(0);
		update(dbDoc, userId);
	}

	private void pendDeleteSampleDocument(DocumentFiles dbDoc, long userId) {
		dbDoc.setStatus(Str.PEND_DELETE);
		update(dbDoc, userId);
	}

	private List<AgreementFileInfo> selectAllAgreement(Message<List<DocumentFiles>> requestMessage, String actionType) {

		List<String> objList = Arrays.asList(Str.GENERAL_NOTIC_FILE, Str.INSTRUCTION_FILE);
		return findAllAgreement(objList, Str.AGREEMENT_FILE);
	}

	private List<AgreementFileInfo> selectAllLegal(Message<List<DocumentFiles>> requestMessage, String actionType) {

		List<String> objList = Arrays.asList(Str.LEGAL_DISCLAIMER);

		activityLogService.save(requestMessage.getHeader().getUserId().longValue(), null,
				ActivityType.VIEW_LEGAL_DISCLAMER, requestMessage.getHeader().getSenderSourceIPAddress(),
				requestMessage.getHeader().getSenderGatewayIPAddress());
		return findAllAgreement(objList, Str.DISCLAIMER);
	}

	private List<AgreementFileInfo> deleteAgreement(Message<List<DocumentFiles>> requestMessage, String actionType)
			throws Exception {
		List<String> subGroup = null;
		String group = null;
		try {
			// need to delete file
			DocumentFiles df = requestMessage.getPayload().get(0);
			subGroup = df.getConfigSubGroupList();
			group = df.getConfigGroup();
			if (df.getObjectId() == null) {
				log.info("object id not found");
				throw new Exception("Can not delete.");
			}

			deleteAgreementFile(df, requestMessage.getHeader().getUserId().longValue());

//			List<String> objList = Arrays.asList(Str.GENERAL_NOTIC_FILE, Str.INSTRUCTION_FILE);
			return findAllAgreement(subGroup, group);
		} catch (Exception e) {
			throw new Exception(e.getLocalizedMessage());
		}

	}

	private void deleteAgreementFile(DocumentFiles df, long userId) throws Exception {

		// delete from document table
		deleteDocumen(df, userId);

		// delete from config table
		sConfigurationService.deleteConfig(df.getObjectId(), userId);

	}

	private void deleteDocumen(DocumentFiles df, long userId) throws Exception {
		List<DocumentFiles> dbDf = documentFilesRepo.findAllByObjectIdAndActiveOrderByCreateDateDesc(df.getObjectId(),
				1);

		if (dbDf.size() == 0) {
			log.info("General Notice File not found");
			throw new Exception("Can not delete.");
		}

		for (DocumentFiles documentFiles : dbDf) {
			documentFiles.setActive(0);
			documentFiles.setUserModId(userId);
			documentFiles.setModDate(new Date());

			documentFilesRepo.save(documentFiles);

		}
	}

	private List<AgreementFileInfo> findAllAgreement(List<String> objList, String configGroup) {
//		List<String> objList = Arrays.asList(Str.GENERAL_NOTIC_FILE, Str.INSTRUCTION_FILE);

//		List<AgreementFileInfo> dfs =null;
		List<AgreementFileInfo> agList = null;

		try {
//			dfs =  documentFilesRepo.findAllByObjectTypeInAndAndActive(objList, 1);
			agList = agreementFileInfoService.findAllAgreement(configGroup, objList);

			if (agList == null) {
				throw new FileNotFoundException("File not found");
			}

			agList.forEach(d -> {
//				AgreementFileInfo ag = new AgreementFileInfo();
				try {
					log.info("getting document to build base64Image to file path for \n[AgreementFileId:path]:[{}:{}]",
							d.getAgreementFileId(), d.getFilePath());
					d.setBase64File(Utils.file2Base64(documentBasePath + File.separator + d.getFilePath()));
				} catch (IOException e) {
					log.info("getting error to build base64Image to file path for \n[documentId:path:error]:[{}:{}:{}]",
							d.getAgreementFileId(), d.getFilePath(), e.getMessage());

				}
//				agList.add(ag);
			});

		} catch (Exception e) {
			log.info("getting error \n{}", e.getMessage());
		}

		return agList;
	}

	private List<String> loadImage(Message<List<DocumentFiles>> requestMessage, String actionType) throws Exception {
		DocumentFiles df = requestMessage.getPayload().get(0);
		List<DocumentFiles> dbDoc = null;
		List<String> base64Image = new ArrayList<String>();

		dbDoc = findDocumentFile(df);

		if (dbDoc == null) {
			throw new FileNotFoundException("File not found");
		}

		try {
			dbDoc.forEach(f -> {
				try {
					base64Image.add(buildImage(f));
				} catch (IOException e) {
					log.info("getting error to build base64Image to file path for \n[documentId:path:error]:[{}:{}:{}]",
							f.getDocumetnFilesId(), f.getFilePath(), e.getMessage());

				}
			});
		} catch (Exception e) {
			log.info("etting error to build base64Image:{}", e.getMessage());
			throw new Exception(e.getMessage());
		}

		return base64Image;
	}

	private String buildImage(Message<List<DocumentFiles>> requestMessage, String actionType) throws Exception {
		DocumentFiles df = requestMessage.getPayload().get(0);

		if (StringUtils.isBlank(df.getFilePath())) {

			throw new FileNotFoundException("File path not found.");
		}

		return buildImage(df);
	}

	private List<DocumentFiles> findDocumentFile(DocumentFiles df) {
		if (df.getObjectId() != null && !StringUtils.isBlank(df.getObjectType())) {
			return documentFilesRepo.findAllByObjectTypeAndObjectIdAndActive(df.getObjectType(), df.getObjectId(), 1);
		} else {
			return null;
		}

	}

	private String buildImage(DocumentFiles f) throws IOException {
		log.info("getting document to build base64Image to file path for \n[documentId:path]:[{}:{}]",
				f.getDocumetnFilesId(), f.getFilePath());
		return Utils.file2Base64(documentBasePath + File.separator + f.getFilePath());
	}

	public void saveSignatoryDocument(Long signatoryId, Signatory entity, MultipartFile[] othersDocs, Long userId,
			Signatory dbSg, String oldSigStatus, String senderSourceIPAddress, String senderGatewayIPAddress) {
		if (signatoryId != null) {
			log.info("getting id: [{}]", signatoryId);
			try {

				if (entity.getApprovalFile() != null) {
					log.info("try to save approval file");
					saveFile(signatoryId, entity.getApprovalFile(), Str.APPROVAL_FILE, userId, dbSg, oldSigStatus);
					activityLogService.save(userId, signatoryId, ActivityType.SAVE_APPROVAL_FILE, senderSourceIPAddress,
							senderGatewayIPAddress);
				}
			} catch (Exception e) {
				log.info("Can not save approval file. getting error: {}", e.getMessage());
			}
			try {
				if (entity.getAgreementFile() != null) {
					log.info("try to save AGREEMENT_FILE file");
					saveFile(signatoryId, entity.getAgreementFile(), Str.AGREEMENT_FILE, userId, dbSg, oldSigStatus);
					activityLogService.save(userId, signatoryId, ActivityType.SAVE_AGREEMENT_FILE,
							senderSourceIPAddress, senderGatewayIPAddress);
				}
			} catch (Exception e) {
				log.info("Can not save AGREEMENT_FILE file. getting error: {}", e.getMessage());
			}

			try {
				if (othersDocs != null) {

					for (int i = 0; i < othersDocs.length; i++) {
						log.info("try to save other file. file name: {}", othersDocs[i].getOriginalFilename());
						saveFile(signatoryId, othersDocs[i], othersDocs[i].getOriginalFilename(), userId, null,
								oldSigStatus);
					}

					activityLogService.save(userId, signatoryId, ActivityType.SAVE_OTHER_FILE, senderSourceIPAddress,
							senderGatewayIPAddress);

				}
			} catch (Exception e) {
				log.info("Can not save others document file. getting error: {}", e.getMessage());
			}

		}

	}

	public List<DocumentFiles> saveSampleDoc(Signatory entity, MultipartFile[] othersDocs, Long userId)
			throws Exception {

		if (othersDocs != null) {

			for (int i = 0; i < othersDocs.length; i++) {
				log.info("try to save sample doc file. file name: {}", othersDocs[i].getOriginalFilename());
				savSampleDoc(othersDocs[i], othersDocs[i].getOriginalFilename(), userId);
			}

		}

//		List<DocumentFiles> list = documentFilesRepo.findAllByGroupAndActive(Str.SAMPLE_DOC, 1);

		return findAllSampleDoc();

	}

	private List<DocumentFiles> selectSampleDoc(Message<List<DocumentFiles>> requestMessage, String actionType) {
		DocumentFiles df = requestMessage.getPayload().get(0);
		return findAllSampleDoc();

	}

	private List<DocumentFiles> findAllSampleDoc() {
		List<DocumentFiles> list = documentFilesRepo.findAllByGroupAndActive(Str.SAMPLE_DOC, 1,
				Sort.by("documetnFilesId").descending());
		if (list.size() > 0) {
			list.forEach(d -> {
				d.setFilePath("");
				d.setIpAddr("");
				d.setIpGateway("");
			});
		}
		return list;
	}

	public void saveCancleFiles(SignatureInfo sgInf, Long userId, Signatory sg, String oldSigStatus,
			String senderSourceIPAddress, String senderGatewayIPAddress) throws Exception {

		if (sgInf.getCancelationApproval() != null) {
			log.info("try to save cancelation approval file");
			saveFile(sgInf.getSignatoryId(), sgInf.getCancelationApproval(), Str.CANCELATION_APPROVAL, userId, sg,
					oldSigStatus);
			sgInf.setCancelationApproval(null);
			activityLogService.save(userId, sgInf.getSignatoryId(), ActivityType.SAVE_CANCELATION_APPROVAL_FILE,
					senderSourceIPAddress, senderGatewayIPAddress);
		}
		if (sgInf.getCancelation() != null) {
			log.info("try to save cancelation file");
			saveFile(sgInf.getSignatoryId(), sgInf.getCancelation(), Str.CANCELATION, userId, sg, oldSigStatus);
			sgInf.setCancelation(null);
			activityLogService.save(userId, sgInf.getSignatoryId(), ActivityType.SAVE_CANCELATION_FILE,
					senderSourceIPAddress, senderGatewayIPAddress);

		}

	}

	public void saveFile(Long objectId, MultipartFile multipartFile, String objectType, Long userId, Signatory dbSg,
			String oldSigStatus) throws Exception {
		String copyFilePath = "";
		DocumentFiles df = new DocumentFiles();
		df.setCreatorId(userId);
		df.setCreateDate(new Date());
		df.setObjectId(objectId);
		copyFilePath = Utils.saveFile2Dir(multipartFile, documentBasePath);
		df.setObjectType(objectType);
		df.setFilePath(copyFilePath);
		df.setFileName(multipartFile.getOriginalFilename());

		documentFilesRepo.save(df);
		log.info("save document success. \n objectType:filePath:fileName:creatorId:\n[{},{},{},{}]", objectType,
				copyFilePath, multipartFile.getOriginalFilename(), userId);

		// try to sending mail
		if (dbSg != null) {
			SignatureInfo sgInfo = signatureInfoService.findBySygnatoryIdAndIsMainSignature(dbSg.getSignatoryId(), 1);
			String insName = institutionService.getInstitutionName(dbSg.getInstitutionId());
			if (!insName.toLowerCase().contains(institutionName)) {
				return;
			}

//			boolean isUpdateStatus = kjsdf;

//			boolean isExits = signatureInfoService.isExitsSignature(sgInfo);
			boolean isExits = false;
			if (sgInfo != null) {
				isExits = signatureInfoService.isExitsSignature(sgInfo);
			}

//			boolean isExits = signatureInfoService.isExitsEmployeeIdAndIsMainSignature(dbSg.getEmployeeId(), 1);

			MailType mt = buildMailType(objectType, isExits, sgInfo != null && !StringUtils.isBlank(oldSigStatus)
					&& !oldSigStatus.equals(sgInfo.getSignatureStatus()));

			if (mt != null) {
				mailTempleteService.sendPaCreationMail(Str.PA, dbSg, mt);
			}
		}
//		klk
	}

	private MailType buildMailType(String objectType, boolean isExits, boolean isUpdateStatus) {
//		Str.APPROVAL_FILE,Str.AGREEMENT_FILE,Str.CANCELATION,Str.CANCELATION_APPROVAL
		if (objectType.equals(Str.APPROVAL_FILE)) {
			if (isUpdateStatus) {
				return MailType.UPLOAD_UPDATE_SIGNATURE_APPROVAL;
			}
			return isExits ? MailType.UPLOAD_UPDATE_APPROVAL : MailType.UPLOAD_APPROVAL;
		} else if (objectType.equals(Str.AGREEMENT_FILE)) {
			if (isUpdateStatus) {
				return MailType.UPLOAD_UPDATE_SIGNATURE_AGREEMENT;
			}
			return isExits ? MailType.UPLOAD_UPDATE_AGREEMENT : MailType.UPLOAD_AGREEMENT;
		} else if (objectType.equals(Str.CANCELATION)) {
			if (isUpdateStatus) {
				return MailType.UPLOAD_UPDATE_SIGNATURE_CANCELATION;
			}
			return isExits ? MailType.UPLOAD_UPDATE_CANCELATION : MailType.UPLOAD_CANCELATION;
		} else if (objectType.equals(Str.CANCELATION_APPROVAL)) {
			return isExits ? MailType.UPLOAD_UPDATE_CANCELATION_APPROVAL : MailType.UPLOAD_CANCELATION_APPROVAL;
		}
		return null;
	}

	public void savSampleDoc(MultipartFile multipartFile, String objectType, Long userId) throws Exception {
		String copyFilePath = "";
		DocumentFiles df = new DocumentFiles();
		df.setCreatorId(userId);
		df.setCreateDate(new Date());
		df.setObjectId(0l);
		copyFilePath = Utils.saveFile2Dir(multipartFile, documentBasePath);
		df.setObjectType(objectType);
		df.setGroup(Str.SAMPLE_DOC);
		df.setCreateDate(new Date());
		df.setModDate(new Date());
		df.setFilePath(copyFilePath);
		df.setFileName(multipartFile.getOriginalFilename());
		df.setStatus(Str.PEND_APPROVE);

		log.info("try to saving value is: [{}]", df.toString());
		documentFilesRepo.saveAndFlush(df);
		log.info("save document success. \n objectType:filePath:fileName:creatorId:\n[{},{},{},{}]", objectType,
				copyFilePath, multipartFile.getOriginalFilename(), userId);

	}

	public List<DocumentFiles> loadDocumentByObjectId(Long objectId) {
		log.info("getting all documents for objectId:{}", objectId);
		try {
			List<DocumentFiles> ds = documentFilesRepo.findAllByObjectIdAndActiveOrderByCreateDateDesc(objectId, 1);
			if (ds.size() > 0) {
				ds.forEach(f -> f.setFilePath(""));
			}
			return ds;
		} catch (Exception e) {
			log.info("can not find any documaent");
		}
		return null;
	}

	public ResponseEntity<?> downloadFile(DocumentFiles df) throws Exception {

		log.info("requesting to download file. \ndocumentFileId:documentName:documentFilePath:[{},{},{}]",
				df.getDocumetnFilesId(), df.getFileName(), df.getFilePath());
		Resource resource = null;
		df = documentFilesRepo.findAllByDocumetnFilesIdAndActive(df.getDocumetnFilesId(), 1);
		if (StringUtils.isBlank(df.getFilePath())) {
			log.info("File Path is Empty");
			throw new PathNotFoundException("File Path is Empty");
		}
		try {
			resource = DocumentFielsUtils.getFileAsResource(df.getFilePath());
			if (resource != null) {
				return buldResponse(resource, df.getFileName());
			}
			return new ResponseEntity<>("File not found", HttpStatus.NOT_FOUND);
		} catch (Exception e) {
			log.info("Getting error:{}", e);
			throw new Exception(e.getMessage());
		}
	}

	private ResponseEntity<Resource> buldResponse(Resource resource, String fileName) throws IOException {

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
		headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
		headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(resource.contentLength()));

		return ResponseEntity.ok().headers(headers).body(resource);
	}

}
