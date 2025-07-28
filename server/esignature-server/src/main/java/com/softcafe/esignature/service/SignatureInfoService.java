package com.softcafe.esignature.service;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.jayway.jsonpath.PathNotFoundException;
import com.softcafe.constants.ActionType;
import com.softcafe.core.model.User;
import com.softcafe.core.service.DocumentFilesService;
import com.softcafe.core.service.UserService;
import com.softcafe.esignature.entity.Institution;
import com.softcafe.esignature.entity.Signatory;
import com.softcafe.esignature.entity.Signature;
import com.softcafe.esignature.entity.SignatureInfo;
import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.repo.SignatureInfoRepo;
import com.softcafe.esignature.utils.ActivityType;
import com.softcafe.esignature.utils.Str;
import com.softcafe.esignature.utils.Utils;

@Service
public class SignatureInfoService extends AbstractService<SignatureInfo> {
	private static final Logger log = LoggerFactory.getLogger(SignatureInfoService.class);

	@Value("${notification.when.institution}")
	private String institutionName;

	@Autowired
	private SignatureService signatureService;

	@Autowired
	private SignatoryService signatoryService;

	@Autowired
	private UserService userService;

	@Autowired
	private InstitutionService institutionService;

	@Autowired
	private SignatureInfoRepo signatureInfoRepo;

	@Autowired
	private DocumentFilesService documentFilesService;

	@Autowired
	private MailTempleteService mailTempleteService;

	@Autowired
	ActivityLogService activityLogService;

	@Autowired
	MailService mailService;

	@Value("${signature.file.base.path}")
	private String basePath;

	@Value("${status.for.mail.external.user}")
	private List<String> status4MailExternalUser;

	@Value("${status.for.notice}")
	private List<String> status4Notice;
	@Value("${list.number.for.notice:20}")
	private Integer number4Notice;

//	@Value("${userCancleMailBodyPath:mail/signatureCancleMail.html}")
//	String userCancleMailBodyPath;
//	String userCancleMailBody;

	@Value("${userInactiveMailBodyPath:mail/signatureInactiveMail.html}")
	String userInactiveMailBodyPath;
	String userInactiveMailBody;

	@PostConstruct
	private void init() {
		log.info("Initializing signatureInfo service");

		try {
//			userCancleMailBody = FileUtils.readFileToString(
//					ResourceUtils.getFile("classpath:" + userCancleMailBodyPath), Charset.defaultCharset());

			userInactiveMailBody = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + userInactiveMailBodyPath), Charset.defaultCharset());

//			log.info("userCancleMailBody : \n[{}]", userCancleMailBody);

			log.info("userInactiveMailBody : \n[{}]", userInactiveMailBody);

		} catch (Exception e) {
			log.error("Error initializing SingnatureInfo service {}", e);
		}

	}

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;
		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

			if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				SignatureInfo obj = selectAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			}
			if (actionType.equals(ActionType.SELECT_ALL_4CHECKER.toString())) {
				SignatureInfo obj = selectAll4Checker(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				SignatureInfo obj = updateInfo(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_PA.toString())) {
				List<SignatureInfo> obj = searchPa(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_EMP_ID.toString())) {
				List<SignatureInfo> obj = searchEmpId(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_PA_EMP.toString())) {
				List<SignatureInfo> obj = searchPaOrEmp(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_PA_NAME.toString())) {
				List<SignatureInfo> obj = searchPaOrName(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_NAME.toString())) {
				List<SignatureInfo> obj = searchName(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH.toString())) {
				SignatureInfo obj = search(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_FOR_DOWN.toString())) {
				SignatureInfo obj = search4Down(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_SIGNATURE.toString())) {
				SignatureInfo obj = searchSignature(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.LOAD_IMAGE.toString())) {
				Signature obj = loadImage(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.BUILD_IMAGE64.toString())) {
				Signature obj = buildImag64(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.LOAD_DETAILS.toString())) {
				List<SignatureInfo> obj = loadDetails(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_HISTORY.toString())) {
				List<SignatureInfo> obj = searchHistory(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH2.toString())) {
				SignatureInfo obj = searchForExternal(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH24DOWN.toString())) {
				SignatureInfo obj = search4ExternalDown(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_PA_NAME_HISTOTY.toString())) {
				List<SignatureInfo> obj = searchPaOrNameByHistory(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	private List<SignatureInfo> searchPaOrEmp(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);
//		 if (sg.getInstitutionId() == null) {
//		        log.warn("Institution ID is missing. Please select the institution first.");
//		        throw new IllegalArgumentException("Select institution first");
//		    }
		List<SignatureInfo> paList = signatureInfoRepo
				.findAllByPaContainingIgnoreCaseOrEmployeeIdContainingIgnoreCaseAndStatusAndInstitutionIdAndIsMainSignatureAndActive(
						sg.getPa(), sg.getEmployeeId(), Str.APPROVED, sg.getInstitutionId(), 1, 1);

		log.info("Getting employee. search By : size is:[{}, {}, {}]", sg.getPa(), paList.size(),
				sg.getInstitutionId());
		return paList;
	}

	private List<SignatureInfo> searchEmpId(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);

		Institution userInstitution = institutionService
				.findInstitutionInfoByUserId(requestMessage.getHeader().getUserId().longValue());

		List<SignatureInfo> empList = null;
		if (userInstitution != null && userInstitution.getOwnInstitution() == 1) {
			empList = signatureInfoRepo.findAllByEmployeeIdContainingIgnoreCaseAndStatusAndIsMainSignatureAndActive(
					sg.getEmployeeId(), Str.APPROVED, 1, 1);
		} else {
			empList = signatureInfoRepo
					.findAllByPaContainingIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(
							sg.getEmployeeId(), Str.APPROVED, 1, 1, 1);
		}

		log.info("Getting employe. search By : size is:[{}, {}]", sg.getEmployeeId(), empList.size());
		return empList;
	}

	private List<SignatureInfo> loadDetails(Message<List<SignatureInfo>> requestMessage, String actionType) {
		Pageable pageable = PageRequest.of(0, number4Notice, Sort.by("modDate").descending());

		activityLogService.save(requestMessage.getHeader().getUserId().longValue(), null, ActivityType.VIEW_NEWS_FEEDS,
				requestMessage.getHeader().getSenderSourceIPAddress(),
				requestMessage.getHeader().getSenderGatewayIPAddress());

		return signatureInfoRepo.findAllByActiveAndStatusAndSignatureStatusInAndIsMainSignature(1, Str.APPROVED,
				status4Notice, 1, pageable).getContent();
	}

	private Signature loadImage(Message<List<SignatureInfo>> requestMessage, String actionType) {
		// find 3 signature for one user
//		String path = requestMessage.getPayload().get(0).getSignaturePath();
		SignatureInfo sgInfo = requestMessage.getPayload().get(0);
		log.info("getting all signature path for signatoryId:signatureId", sgInfo.getSignatoryId(),
				sgInfo.getSignatureId());
		List<String> paths = signatureService.finAllBySignatoryId(sgInfo.getSignatoryId()).stream()
				.map(Signature::getSignaturePath).collect(Collectors.toList());
		Signature sg = new Signature();
		List<String> imgList = new ArrayList<String>();

		paths.forEach((path) -> {
			String image64 = null;
			if (!StringUtils.isBlank(path)) {
				try {
					image64 = Utils.file2Base64(path);
//					sg.setBase64Image(image64);
					imgList.add(image64);

				} catch (IOException e) {
					log.info("can not find signature for path:{}", path);
					throw new RuntimeException("Invalid image path");
				}
			} else {
				log.info("can not find signature");
				throw new RuntimeException("Signature not found");
			}
		});
		sg.setBase64Image(imgList);

		sg.setFileList(documentFilesService.loadDocumentByObjectId(sgInfo.getSignatoryId()));
		return sg;
	}

	private Signature buildImag64(Message<List<SignatureInfo>> requestMessage, String actionType) throws IOException {

		SignatureInfo sgInfo = requestMessage.getPayload().get(0);
		log.info("getting all signature path for signatoryId:signatureId", sgInfo.getSignatoryId(),
				sgInfo.getSignatureId());
		List<String> paths = null;
		Signature sg = new Signature();
		List<String> imgList = new ArrayList<String>();

		if (!StringUtils.isBlank(sgInfo.getSignaturePath())) {
			log.info("getting all signature path for signatureId: master image path=[{},{}]", sgInfo.getSignatureId(),
					sgInfo.getSignaturePath());
			paths = signatureService.findWithOutMasterSignatureInfo(sgInfo.getSignatoryId()).stream()
					.map(Signature::getSignaturePath).collect(Collectors.toList());
//			imgList.add(Utils.file2Base64(sgInfo.getSignaturePath()));
		} else {
			paths = signatureService.finAllBySignatoryId(sgInfo.getSignatoryId()).stream()
					.map(Signature::getSignaturePath).collect(Collectors.toList());
		}

		paths.forEach((path) -> {
			String image64 = null;
			if (!StringUtils.isBlank(path)) {
				try {
					image64 = Utils.file2Base64(path);
//					sg.setBase64Image(image64);
					imgList.add(image64);

				} catch (IOException e) {
					log.info("can not find signature for path:{}", path);
					throw new RuntimeException("Invalid image path");
				}
			} else {
				log.info("can not find signature");
				throw new RuntimeException("Signature not found");
			}
		});
		sg.setBase64Image(imgList);

		sg.setFileList(documentFilesService.loadDocumentByObjectId(sgInfo.getSignatoryId()));
		return sg;
	}

	private SignatureInfo selectAll(Message<List<SignatureInfo>> requestMessage, String actionType) {
		log.info("trying to getting all signature.");

		SignatureInfo sInfo = requestMessage.getPayload().get(0);
		return buildReturn(null, sInfo.getPageNumber(), sInfo.getPageSize(), sInfo.getInstitutionId());
	}

	private SignatureInfo selectAll4Checker(Message<List<SignatureInfo>> requestMessage, String actionType) {
		log.info("trying to getting all signature.");

		SignatureInfo sInfo = requestMessage.getPayload().get(0);
		return buildReturn4Checker(null, sInfo.getPageNumber(), sInfo.getPageSize(), sInfo.getInstitutionId());
	}

	private SignatureInfo buildReturn(List<SignatureInfo> updateSignature, int pageNumber, int pageSize,
			long institutionId) {
		SignatureInfo sg = new SignatureInfo();
		sg.setUpdateSignature(updateSignature);
		Page<SignatureInfo> ps = null;

		if (institutionId == 1 || institutionService.findOwnInstitution(institutionId)) {
			ps = findSingnature(pageNumber - 1, pageSize);
		} else {
//			ps = findOwnSignature(pageNumber - 1, pageSize);
			ps = findSingnature(pageNumber - 1, pageSize);
		}

		sg.setAllSignature(ps.getContent());
		sg.setPageNumber(ps.getNumber() + 1);
		sg.setPageSize(ps.getSize());
		sg.setTotal(ps.getTotalElements());
		return sg;
	}

	private SignatureInfo buildReturn4Checker(List<SignatureInfo> updateSignature, int pageNumber, int pageSize,
			long institutionId) {
		SignatureInfo sg = new SignatureInfo();
		sg.setUpdateSignature(updateSignature);
		Page<SignatureInfo> ps = null;

		if (institutionId == 1 || institutionService.findOwnInstitution(institutionId)) {
			ps = findSingnature4Checker(pageNumber - 1, pageSize);
		} else {
//			ps = findOwnSignature(pageNumber - 1, pageSize);
			ps = findSingnature(pageNumber - 1, pageSize);
		}

		sg.setAllSignature(ps.getContent());
		sg.setPageNumber(ps.getNumber() + 1);
		sg.setPageSize(ps.getSize());
		sg.setTotal(ps.getTotalElements());
		return sg;
	}

	private Page<SignatureInfo> findSingnature(int pageNumber, int pageSize) {
		// TODO Auto-generated method stub
		Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("signatureInfoId").ascending());
		return signatureInfoRepo.findAllByIsMainSignatureAndActive(1, 1, pageable);
	}

	private Page<SignatureInfo> findSingnature4Checker(int pageNumber, int pageSize) {
		// TODO Auto-generated method stub
		Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("signatureInfoId").ascending());
		return signatureInfoRepo.findAllByIsMainSignatureAndStatusNotAndActive(1, Str.NEW, 1, pageable);
	}

	private Page<SignatureInfo> findOwnSignature(int pageNumber, int pageSize) {
		// TODO Auto-generated method stub
		Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("signatureInfoId").ascending());
		return signatureInfoRepo.findAllByisMainSignatureAndOwnInstitutionAndActive(1, 1, 1, pageable);
	}

	private SignatureInfo updateInfo(Message<List<SignatureInfo>> requestMessage, String actionType) throws Exception {

		SignatureInfo s = requestMessage.getPayload().get(0);
		Long userId = Long.valueOf(requestMessage.getHeader().getUserId());

		return update(s, userId, null, requestMessage.getHeader().getSenderSourceIPAddress(),
				requestMessage.getHeader().getSenderGatewayIPAddress());

	}

	public SignatureInfo update(SignatureInfo signatureInfo, Long userId, MultipartFile[] othersDocs,
			String senderSourceIPAddress, String senderGatewayIPAddress) throws Exception {

//		SignatureInfo s = requestMessage.getPayload().get(0);
		List<SignatureInfo> sgInfoList = signatureInfo.getUpdateSignature();
//		Long userId = Long.valueOf(requestMessage.getHeader().getUserId());

		log.info("Update signature.......");
		boolean isSendMail = false;
		for (SignatureInfo sgInf : sgInfoList) {
//			boolean isSendMail = false;

			boolean isCancleDocSave = false;

			log.info("Update signature for signatory id: {}", sgInf.getSignatoryId());
			List<Signature> sgList = signatureService.finAllBySignatoryId(sgInf.getSignatoryId());

			if (sgList != null) {
				final String[] oldSigStatus = { null };

				for (Signature dbSg : sgList) {

					log.info("Update signature for signature id: {}", dbSg.getSignatureId());
//					if (sg.getSignatureId() != null) {
//						Signature dbSg = signatureRepo.findById(sg.getSignatureId()).get();

					if (dbSg.getIsMainSignature() == 1) {
						oldSigStatus[0] = dbSg.getSignatureOldStatus();
					}

//					dbSg.setSignatureStatus(sgInf.getSignatureStatus());
//					dbSg.setSignatureOldStatus(dbSg.getSignatureStatus());
//					dbSg.setSignatureStatus(sgInf.getSignatureStatus());
					dbSg.setModDate(new Date());
					dbSg.setUserModId(userId);
					dbSg.setRemarks(sgInf.getRemarks());
					dbSg.setRejectionCause(signatureInfo.getRejectionCause());
					dbSg.setEffictiveDate(sgInf.getEffictiveDate());

					dbSg.setStatus(signatureInfo.getStatus());
					if (dbSg.getStatus().equals(Str.NEW)) {
						dbSg.setSignatureOldStatus(dbSg.getSignatureStatus());
						dbSg.setSignatureStatus(sgInf.getSignatureStatus());
					} else if (dbSg.getStatus().equals(Str.PEND_APPROVE)) {
						dbSg.setApproveById(userId);
						dbSg.setApproveTime(new Date());
					} else if (dbSg.getStatus().equals(Str.APPROVED)) {
//						dbSg.setSignatureStatus(dbSg.getSignatureOldStatus());
						dbSg.setAuthorizeBy(userId);
						dbSg.setAuthorizeDate(new Date());
						dbSg.setSignatureOldStatus("");
					}

					if (!StringUtils.isBlank(sgInf.getSignatureStatus()) && signatureInfo.getStatus().equals("NEW")) {

						if (sgInf.getSignatureStatus().equals("CANCELED")) {
							dbSg.setCancleBy(userId);
							dbSg.setCancelTime(new Date());
							dbSg.setCalcelCause(sgInf.getCalcelCause());
							dbSg.setCancelEffectiveDate(sgInf.getCancelEffectiveDate());
							if (!isCancleDocSave) {
								try {
									saveCancleFiles(sgInf, userId, oldSigStatus[0], senderSourceIPAddress,
											senderGatewayIPAddress);
								} catch (Exception e) {
									// TODO Auto-generated catch block
									log.info("getting error to save cancelation files: {}", e.getMessage());
								} finally {
									isCancleDocSave = true;
								}
							}

						} else if (sgInf.getSignatureStatus().equals("IN_ACTIVE")) {
							dbSg.setInactiveTime(sgInf.getInactiveTime());
						}

					}
					if (!StringUtils.isBlank(sgInf.getSignatureStatus())
							&& signatureInfo.getStatus().equals("PEND_DELETE")) {
						dbSg.setDeleteBy(userId);
						dbSg.setDeleteDate(new Date());
					} else if (!StringUtils.isBlank(sgInf.getSignatureStatus())
							&& signatureInfo.getStatus().equals(Str.APPROVE_DELETE)) {
						dbSg.setActive(0);
					}

					dbSg.setModDate(new Date());
					dbSg.setUserModId(userId);
					log.info("signature update for signature id: {}", dbSg.getSignatureId());
					signatureService.saveSignature(dbSg);

					// save activity
					if (dbSg.getIsMainSignature() == 1) {
//						ActivityType act = findActivity(signatureInfo);

						saveActivity(userId, dbSg.getSignatureId(), senderSourceIPAddress, senderGatewayIPAddress,
								findActivity(signatureInfo));
					}

//					activityLogService.save(userId, sg.getSignatoryId(), ActivityType.SAVE_SIGNATURE,
//							senderSourceIPAddress, senderGatewayIPAddress);

					/// sending mail to all external user
//					if (status4MailExternalUser.contains(dbSg.getSignatureStatus())
//							&& dbSg.getStatus().equals(Str.APPROVED)) {
					if (dbSg.getStatus().equals(Str.APPROVED) || dbSg.getStatus().equals(Str.APPROVE_DELETE)
							|| StringUtils.equals(dbSg.getStatus(), "REJECTED_BY_APPROVER")) {
						isSendMail = true;
//						
						if (StringUtils.equals(dbSg.getStatus(), "REJECTED_BY_APPROVER")) {
							sgInf.setStatus(dbSg.getStatus());
							sgInf.setRejectionCause(dbSg.getRejectionCause());
						}
					} else {
						isSendMail = false;
					}

//					}
				}

				sgInf.setCancelation(null);
				sgInf.setCancelationApproval(null);
				Signatory sig = signatoryService.findBySignatoryId(sgInf.getSignatoryId());
				if (othersDocs != null && othersDocs.length > 0) {
					log.info("trying to save others documents for signatoryId:[{}]", sgInf.getSignatoryId());
					documentFilesService.saveSignatoryDocument(sgInf.getSignatoryId(), new Signatory(), othersDocs,
							userId, sig, oldSigStatus[0], senderSourceIPAddress, senderGatewayIPAddress);
				}

				if (isSendMail) {
					log.info("sending all user mail for PA cancel/inActive/rejection:{}", sgInf.getPa());

//					SignatureInfo newDbSignatureInfo = signatureInfoRepo
//							.findBySignatureInfoIdAndActive(sgInf.getSignatureInfoId(), 1);

					if (!StringUtils.isBlank(sgInf.getInstitutionName())
							&& !sgInf.getInstitutionName().toLowerCase().contains(institutionName)) {
						continue;
					}
					Thread sendMail = new Thread(() -> {
						sendingMail2ExternalUser(sgInf, oldSigStatus[0]);
					});
					sendMail.start();
//					lkk
				}

//				;

			} else {
				log.info("getting signature info is null for signatory id:[{}]", sgInf.getSignatoryId());
			}

		}
		sgInfoList.forEach(s -> {
			s.setCancelation(null);
			s.setCancelationApproval(null);
		});
		return isSendMail
				? buildReturn4Checker(sgInfoList,
						signatureInfo.getPageNumber() != 0 ? signatureInfo.getPageNumber() : 1,
						signatureInfo.getPageSize() != 0 ? signatureInfo.getPageSize() : 20, 0)
				: buildReturn(sgInfoList, signatureInfo.getPageNumber() != 0 ? signatureInfo.getPageNumber() : 1,
						signatureInfo.getPageSize() != 0 ? signatureInfo.getPageSize() : 20, 0);
	}

	private ActivityType findActivity(SignatureInfo signatureInfo) {
		ActivityType act = null;
		if (signatureInfo.getStatus().equals(Str.APPROVE_DELETE)) {
			act = ActivityType.APPROVE_DELETE_SIGNATURE;
		} else if (signatureInfo.getStatus().equals("PEND_DELETE")) {
			act = ActivityType.PEND_DELETE_SIGNATURE;
		} else {
			act = ActivityType.UPDATE_SIGNATURE;
		}
		return act;
	}

	private void saveActivity(Long userId, Long signatureId, String senderSourceIPAddress,
			String senderGatewayIPAddress, ActivityType activity) {

		activityLogService.save(userId, signatureId, activity, senderSourceIPAddress, senderGatewayIPAddress);

	}

	private void saveCancleFiles(SignatureInfo sgInf, Long userId, String oldSigStatus, String senderSourceIPAddress,
			String senderGatewayIPAddress) throws Exception {
		log.info("comming for saving cancle documents for signatoryId:{}", sgInf.getSignatoryId());

		Signatory sg = signatoryService.findBySignatoryId(sgInf.getSignatoryId());
		documentFilesService.saveCancleFiles(sgInf, userId, sg, oldSigStatus, senderSourceIPAddress,
				senderGatewayIPAddress);

	}

	private void sendingMail2ExternalUser(SignatureInfo dbSg, String oldSigStatus) {
//		List<User> externalUserList = userService.findAllExternalUser();
		List<User> externalUserList = null;
		String userMailList = null;
		if (!StringUtils.isBlank(dbSg.getStatus()) && dbSg.getStatus().equals(Str.PEND_DELETE)) {
			userMailList = null;
		} else if (!StringUtils.equals(dbSg.getStatus(), "REJECTED_BY_APPROVER")
				&& (dbSg.getSignatureStatus().equals(Str.CANCELED) || dbSg.getSignatureStatus().equals(Str.ACTIVE))) {
			externalUserList = userService.findAllUser();
		}
		if (externalUserList != null) {
			userMailList = externalUserList.stream().map(User::getEmail).collect(Collectors.joining(","));

		}
//
		sendingMail2User(userMailList, dbSg, oldSigStatus);

	}

	private void sendingMail2User(String userMailList, SignatureInfo dbSg, String oldSigStatus) {

		log.info("try to sending mail.");
		if (!StringUtils.isBlank(dbSg.getStatus()) && dbSg.getStatus().equals(Str.PEND_DELETE)) {
			sendSignatureDeleteMail(dbSg, oldSigStatus);
		} else if (StringUtils.equals(dbSg.getStatus(), "REJECTED_BY_APPROVER")) {
			sendSignatureRejectMail(dbSg, oldSigStatus);
		} else if (dbSg.getSignatureStatus().equals(Str.ACTIVE)) {
			sendSignatureActiveMail(userMailList, dbSg, oldSigStatus);
		} else if (dbSg.getSignatureStatus().equals(Str.CANCELED)) {
			sendCancleMail(userMailList, dbSg, oldSigStatus);
		} else if (dbSg.getSignatureStatus().equals(Str.IN_ACTIVE)) {
			sendInactiveMail(userMailList, dbSg, oldSigStatus);
		} else {
			log.info("getting wrong signature status: {}", dbSg.getSignatureStatus());
		}

	}

	private void sendCancleMail(String userEemails, SignatureInfo dbSg, String oldSigStatus) {
		try {
			String email = dbSg.getEmail();
//			String emails = userMailList.parallelStream().map(m -> m).collect(Collectors.joining(","));
			String adminMails = userService.findAllAdminUsersEmail();

			if (!StringUtils.isBlank(userEemails)) {

				adminMails = !StringUtils.isBlank(adminMails) ? adminMails + "," + userEemails : userEemails;
			}

//			if (!StringUtils.isBlank(adminMails)) {
//				emails = emails + "," + adminMails;
//			}

			MailType mType = buildCancelMailType(dbSg,
					!StringUtils.isBlank(oldSigStatus) && !oldSigStatus.equals(dbSg.getSignatureStatus()));

			mailTempleteService.sendSignatureNotification(dbSg, email, null, adminMails, mType, oldSigStatus);
//			mailTempleteService.sendSignatureNotification(dbSg, adminMails, mType, oldSigStatus);

		} catch (Exception e) {

			log.error("Error Sending cancel mail to [{}]\n{}", dbSg.getSignatoryId(), e);
		}

	}

	private void sendSignatureDeleteMail(SignatureInfo dbSg, String oldSigStatus) {
		try {
			String email = dbSg.getEmail();

			String adminMails = userService.findAllAdminUsersEmail();

//			if (!StringUtils.isBlank(adminMails)) {
//				emails = emails + "," + adminMails;
//			}

			mailTempleteService.sendSignatureNotification(dbSg, email, null, adminMails, MailType.DELETE_CHECK,
					oldSigStatus);
//			mailTempleteService.sendSignatureNotification(dbSg, adminMails, MailType.DELETE_CHECK, oldSigStatus);

		} catch (Exception e) {

			log.error("Error Sending cancel mail to [{}]\n{}", dbSg.getSignatoryId(), e);
		}

	}

	private void sendSignatureRejectMail(SignatureInfo dbSg, String oldSigStatus) {
		try {
			Signature sg = signatureService.findSignatureById(dbSg.getSignatureId());

			String email = userService.findUserById(sg.getCreatorId()).getEmail();

//			String adminMails = userService.findAllAdminUsersEmail();
//
//			if (!StringUtils.isBlank(adminMails)) {
//				emails = emails + "," + adminMails;
//			}
			mailTempleteService.sendSignatureNotification(dbSg, email, null, null, MailType.REJECT_MAIL, oldSigStatus);

		} catch (Exception e) {

			log.error("Error Sending cancel mail to [{}]\n{}", dbSg.getSignatoryId(), e);
		}

	}

	private void sendSignatureActiveMail(String userEemails, SignatureInfo dbSg, String oldSigStatus) {
		try {
			String email = dbSg.getEmail();
//			String emails = userMailList.parallelStream().map(m -> m).collect(Collectors.joining(","));

			String adminMails = userService.findAllAdminUsersEmail();

			if (!StringUtils.isBlank(userEemails)) {
				adminMails = StringUtils.isBlank(adminMails) ? userEemails : userEemails + "," + adminMails;
			}

//			if (!StringUtils.isBlank(adminMails)) {
//				emails = emails + "," + adminMails;
//			}

			MailType mType = buildMailType(dbSg,
					!StringUtils.isBlank(oldSigStatus) && !oldSigStatus.equals(dbSg.getSignatureStatus()));

			mailTempleteService.sendSignatureNotification(dbSg, email, null, adminMails, mType, oldSigStatus);
//			mailTempleteService.sendSignatureNotification(dbSg, adminMails, mType, oldSigStatus);

		} catch (Exception e) {

			log.error("Error Sending cancel mail to [{}]\n{}", dbSg.getSignatoryId(), e);
		}

	}

	private MailType buildMailType(SignatureInfo dbSg, boolean isUpdateStatus) {
		int count = signatureInfoRepo.countByEmployeeIdAndIsMainSignatureAndActive(dbSg.getEmployeeId(), 1, 0);
		if (isUpdateStatus) {
			return MailType.SIGNATURE_UPDATE_CHECK;
		}
		return count < 1 ? MailType.SIGNATURE_CHECK : MailType.SND_SIGNATURE_CHECK;
	}

	private MailType buildInactiveMailType(SignatureInfo dbSg, boolean isUpdateStatus) {
		int count = signatureInfoRepo.countByEmployeeIdAndIsMainSignatureAndActive(dbSg.getEmployeeId(), 1, 0);
		if (isUpdateStatus) {
			return MailType.INACTIVATION_UPDATE_CHECK;
		}
		return count < 1 ? MailType.INACTIVATION_CHECK : MailType.SND_INACTIVATION_CHECK;
	}

	private MailType buildCancelMailType(SignatureInfo dbSg, boolean isUpdateStatus) {
		int count = signatureInfoRepo.countByEmployeeIdAndIsMainSignatureAndActive(dbSg.getEmployeeId(), 1, 0);
		if (isUpdateStatus) {
			return MailType.CANCEL_UPDATE_CHECK;
		}
		return count < 1 ? MailType.CANCEL_CHECK : MailType.SND_CANCEL_CHECK;
	}

	private void sendInactiveMail(String userEemails, SignatureInfo dbSg, String oldSigStatus) {
		try {
//			String emails = userMailList.parallelStream().map(m -> m).collect(Collectors.joining(","));

			String email = dbSg.getEmail();
//			if (!StringUtils.isBlank(userEemails)) {
//				emails = emails + "," + userEemails;
//			}
			String adminMails = userService.findAllAdminUsersEmail();

//			if (!StringUtils.isBlank(adminMails)) {
//				emails = emails + "," + adminMails;
//			}

			MailType mType = buildInactiveMailType(dbSg,
					!StringUtils.isBlank(oldSigStatus) && !oldSigStatus.equals(dbSg.getSignatureStatus()));

			mailTempleteService.sendSignatureNotification(dbSg, email, null, adminMails, mType, oldSigStatus);
//			mailTempleteService.sendSignatureNotification(dbSg, adminMails, mType, oldSigStatus);

//					mailService.send(subject, inactiveMailBody, email);

		} catch (Exception e) {
			log.error("Error Sending cancel mail to [{}]\n{}", dbSg.getSignatoryId(), e);
		}
	}

//	private String buildInactiveMailBody(Signature dbSg) {
//
//		Signatory sg = signatoryRepo.findAllBySignatoryIdAndActive(dbSg.getSignatoryId(), 1);
//		return userInactiveMailBody
//				.replace("##name##", (sg != null && StringUtils.isBlank(sg.getName())) ? "" : sg.getName())
//				.replace("##pa##", (sg != null && StringUtils.isBlank(sg.getPa())) ? "" : sg.getPa())
//				.replace("##inactiveTime##", dbSg.getInactiveTime() == null ? "" : dbSg.getInactiveTime().toString());
//	}

//	private String buildCancelMailBody(Signature dbSg) {
//
//		Signatory sg = signatoryRepo.findAllBySignatoryIdAndActive(dbSg.getSignatoryId(), 1);
//
//		return userCancleMailBody
//				.replace("##name##", (sg != null && StringUtils.isBlank(sg.getName())) ? "" : sg.getName())
//				.replace("##pa##", (sg != null && StringUtils.isBlank(sg.getPa())) ? "" : sg.getPa())
//				.replace("##cancelTime##", dbSg.getCancelTime() == null ? "" : dbSg.getCancelTime().toString())
//				.replace("##cancelEffectiveDate##",
//						dbSg.getCancelEffectiveDate() == null ? "" : dbSg.getCancelTime().toString());
//
//	}

	private List<SignatureInfo> searchPa(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);

		Institution userInstitution = institutionService
				.findInstitutionInfoByUserId(requestMessage.getHeader().getUserId().longValue());

		List<SignatureInfo> paList = null;
		if (userInstitution != null && userInstitution.getOwnInstitution() == 1) {
//			paList = signatureInfoRepo.findAllByPaContainingIgnoreCaseAndStatusAndIsMainSignatureAndActive(sg.getPa(),
//					Str.APPROVED, 1, 1);
			paList = signatureInfoRepo
					.findAllByPaContainingIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(sg.getPa(),
							Str.APPROVED, 1, sg.getOwnInstitution(), 1);
		} else {
			paList = signatureInfoRepo
					.findAllByPaContainingIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(sg.getPa(),
							Str.APPROVED, 1, 1, 1);
		}

		log.info("Getting employe. OwnInstitution: search By : size is:[{}, {}, {}]",
				userInstitution.getOwnInstitution(), sg.getPa(), paList.size());
//		return paList.parallelStream().map(SignatureInfo::getPa).collect(Collectors.toList());
		return paList;
	}

	private List<SignatureInfo> searchPaOrName(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);

		List<SignatureInfo> paList = signatureInfoRepo
				.findAllByPaContainingIgnoreCaseOrNameContainingIgnoreCaseAndStatusAndIsMainSignatureAndActive(
						sg.getPa(), sg.getName(), Str.APPROVED, 1, 1);

		log.info("Getting employe. search By : size is:[{}, {}]", sg.getPa(), paList.size());
//		return paList.parallelStream().map(SignatureInfo::getPa).collect(Collectors.toList());
		return paList;
	}

	private List<SignatureInfo> searchPaOrNameByHistory(Message<List<SignatureInfo>> requestMessage,
			String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);

		List<SignatureInfo> paList = signatureInfoRepo
				.findDistinctEmployeeIdByPaContainingIgnoreCaseOrNameContainingIgnoreCaseAndStatusAndIsMainSignature(
						sg.getPa(), sg.getName(), Str.APPROVED, 1);

		log.info("Getting employe. search By : size is:[{}, {}]", sg.getPa(), paList.size());
//		return paList.parallelStream().map(SignatureInfo::getPa).collect(Collectors.toList());
		return paList;
	}

	private List<SignatureInfo> searchName(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);
		Institution userInstitution = institutionService
				.findInstitutionInfoByUserId(requestMessage.getHeader().getUserId().longValue());

		List<SignatureInfo> nameList = null;
		if (userInstitution != null && userInstitution.getOwnInstitution() == 1) {
			if (sg.getInstitutionId() != null) {
				nameList = signatureInfoRepo
						.findAllByNameContainingIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndInstitutionIdAndActive(
								sg.getName(), Str.APPROVED, 1, sg.getOwnInstitution(), sg.getInstitutionId(), 1);
			} else {
				nameList = signatureInfoRepo
						.findAllByNameContainingIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(
								sg.getName(), Str.APPROVED, 1, sg.getOwnInstitution(), 1);
			}

		} else {
			nameList = signatureInfoRepo
					.findAllByNameContainingIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(
							sg.getName(), Str.APPROVED, 1, 1, 1);
		}

		log.info("Getting employe. search By : size is:[{}, {}]", sg.getName(), nameList.size());
		return nameList;
	}

	private SignatureInfo search(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);

//		Institution userInstitution = institutionService
//				.findInstitutionInfoByUserId(requestMessage.getHeader().getUserId().longValue());

//		if (userInstitution != null) {
		SignatureInfo testInfo = null;
		if (sg.getPa() != null) {
			log.info("search signature by signatory id: [{}]", sg.getPa());

			testInfo = signatureInfoRepo.findByPaAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(sg.getPa(),
					Str.APPROVED, 1, 1, 1);

			if (testInfo == null) {
				log.info("Signature not found for PA:{}", sg.getPa());
				saveSignatureSearchStatus(requestMessage, null, sg.getPa(), sg.getName(), "Failed");

				throw new RuntimeException("No signature record found.");

			}
//				if (userInstitution.getOwnInstitution() == 1 || testInfo.getOwnInstitution() == 1) {
//						dbSgInfo = testInfo;

//				} else {
//					log.info("Un-authorized Action. userId:{}", requestMessage.getHeader().getUserId().longValue());
//					throw new RuntimeException("Signature Not Found.");
//				}
		} else {
			Optional<List<SignatureInfo>> oList = signatureInfoRepo
					.findByNameIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(sg.getName(),
							Str.APPROVED, 1, 1, 1);
			if (oList.isPresent()) {
				testInfo = oList.get().get(0);
			}
		}
		if (testInfo != null) {
			saveSignatureSearchStatus(requestMessage, testInfo.getSignatureId(), sg.getPa(), sg.getName(), "Successed");
			return buildSignatureInfo(testInfo);
		}
		log.info("Signature information not found.");
		saveSignatureSearchStatus(requestMessage, null, sg.getPa(), sg.getName(), "Failed");
		throw new RuntimeException("No signature record found.");

//		} else {
//			log.info("Login user institution information not found. userId:{}",
//					requestMessage.getHeader().getUserId().longValue());
//			throw new RuntimeException("Un-authorized Action");
//		}

	}

	private SignatureInfo search4Down(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);

		SignatureInfo testInfo = null;
		if (sg.getPa() != null) {
			log.info("search signature by signatory id: [{}]", sg.getPa());

			testInfo = signatureInfoRepo.findByPaAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(sg.getPa(),
					Str.APPROVED, 1, 1, 1);

			if (testInfo == null) {
				log.info("Signature not found for PA:{}", sg.getPa());

				throw new RuntimeException("No signature record found.");

			}
		} else {
			Optional<List<SignatureInfo>> oList = signatureInfoRepo
					.findByNameIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(sg.getName(),
							Str.APPROVED, 1, 1, 1);
			if (oList.isPresent()) {
				testInfo = oList.get().get(0);
			}
		}
		if (testInfo != null) {
			return buildSignatureInfo(testInfo);
		}
		log.info("Signature information not found.");
		throw new RuntimeException("No signature record found.");

	}

	private SignatureInfo searchForExternal(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);
		log.info("Received ownInstitution value: {}", sg.getOwnInstitution());
		Institution userInstitution = institutionService
				.findInstitutionInfoByUserId(requestMessage.getHeader().getUserId().longValue());

		if (userInstitution != null) {
			SignatureInfo signatureInfo = null;

			if (!StringUtils.isEmpty(sg.getEmployeeId()) && userInstitution.getOwnInstitution() == 1) {
				log.info("search signature by signatory id: [{}]", sg.getEmployeeId());

				signatureInfo = signatureInfoRepo
						.findByEmployeeIdAndStatusAndIsMainSignatureAndOwnInstitutionAndInstitutionIdAndActive(
								sg.getEmployeeId(), Str.APPROVED, 1, 0, sg.getInstitutionId(), 1);

//				if (userInstitution.getOwnInstitution() == 1) {
//					saveSignatureSearchStatus(requestMessage, sg.getEmployeeId(), sg.getName(), "Successed");
//					return buildSignatureInfo(signatureInfo);
//				} else {
//					log.info("Un-authorized Action. userId:{}", requestMessage.getHeader().getUserId().longValue());
//					throw new RuntimeException("No signature record found.");
//				}
			} else if (StringUtils.isEmpty(sg.getEmployeeId()) && !StringUtils.isEmpty(sg.getName())
					&& userInstitution.getOwnInstitution() == 1) {

//				signatureInfo = signatureInfoRepo
//						.findByPaAndStatusAndIsMainSignatureAndOwnInstitutionAndInstitutionIdAndActive(
//								sg.getEmployeeId(), Str.APPROVED, 1, sg.getOwnInstitution(), sg.getInstitutionId(), 1);
				Optional<List<SignatureInfo>> oList = signatureInfoRepo
						.findByNameIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndInstitutionIdAndActive(
								sg.getName(), Str.APPROVED, 1, 0, sg.getInstitutionId(), 1);
				if (oList.isPresent()) {
					signatureInfo = oList.get().get(0);
				}

			} else {
				log.info("PA not found for search signature information");
				saveSignatureSearchStatus(requestMessage, null, sg.getEmployeeId(), sg.getName(), "Failed");
				throw new RuntimeException("No signature record found.");
			}

			if (signatureInfo != null && userInstitution.getOwnInstitution() == 1) {
				saveSignatureSearchStatus(requestMessage, signatureInfo.getSignatureId(), sg.getEmployeeId(),
						sg.getName(), "Successed");
				return buildSignatureInfo(signatureInfo);
			} else {
				saveSignatureSearchStatus(requestMessage, null, sg.getEmployeeId(), sg.getName(), "Failed");
				log.info("signature information not found.");
				throw new RuntimeException("No signature record found.");
			}

		} else {
			log.info("Login user institution information not found. userId:{}",
					requestMessage.getHeader().getUserId().longValue());
			throw new RuntimeException("Un-authorized Action");
		}
	}

	private SignatureInfo search4ExternalDown(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);
		log.info("Received ownInstitution value: {}", sg.getOwnInstitution());
		Institution userInstitution = institutionService
				.findInstitutionInfoByUserId(requestMessage.getHeader().getUserId().longValue());

		if (userInstitution != null) {
			SignatureInfo signatureInfo = null;

			if (!StringUtils.isEmpty(sg.getEmployeeId()) && userInstitution.getOwnInstitution() == 1) {
				log.info("search signature by signatory id: [{}]", sg.getEmployeeId());

				signatureInfo = signatureInfoRepo
						.findByEmployeeIdAndStatusAndIsMainSignatureAndOwnInstitutionAndInstitutionIdAndActive(
								sg.getEmployeeId(), Str.APPROVED, 1, 0, sg.getInstitutionId(), 1);

			} else if (StringUtils.isEmpty(sg.getEmployeeId()) && !StringUtils.isEmpty(sg.getName())
					&& userInstitution.getOwnInstitution() == 1) {

				Optional<List<SignatureInfo>> oList = signatureInfoRepo
						.findByNameIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndInstitutionIdAndActive(
								sg.getName(), Str.APPROVED, 1, 0, sg.getInstitutionId(), 1);
				if (oList.isPresent()) {
					signatureInfo = oList.get().get(0);
				}

			} else {
				log.info("PA not found for search signature information");
				throw new RuntimeException("No signature record found.");
			}

			if (signatureInfo != null && userInstitution.getOwnInstitution() == 1) {
				return buildSignatureInfo(signatureInfo);
			} else {
				log.info("signature information not found.");
				throw new RuntimeException("No signature record found.");
			}

		} else {
			log.info("Login user institution information not found. userId:{}",
					requestMessage.getHeader().getUserId().longValue());
			throw new RuntimeException("Un-authorized Action");
		}
	}

	private void saveSignatureSearchStatus(Message<List<SignatureInfo>> requestMessage, Long onId, String pa,
			String name, String status) {
		activityLogService.saveSignatuerSearch(requestMessage.getHeader().getUserId().longValue(), onId,
				ActivityType.SEARCH_SIGNATURE, requestMessage.getHeader().getSenderSourceIPAddress(),
				requestMessage.getHeader().getSenderGatewayIPAddress(), pa, name, status);

	}

	private SignatureInfo searchSignature(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(sg.getPageNumber() - 1, sg.getPageSize(),
				Sort.by("signatureInfoId").ascending());

		log.info("Searching signature information for:\nPA:EmployeeId:Email:institutionName=[{},{},{},{}]", sg.getPa(),
				sg.getEmployeeId(), sg.getEmail(), sg.getInstitutionName());

		Page<SignatureInfo> infos = signatureInfoRepo.findAllByEmployeeIdAndPaAndEmailAndInstitutionNameAndNameAndActive(
				sg.getEmployeeId(), sg.getPa(), sg.getEmail(), sg.getInstitutionName(), sg.getName(), 1, pageable);
		if (infos.getContent().size() > 0) {
			sg.setAllSignature(infos.getContent());
			sg.setTotal(infos.getTotalElements());
			return sg;
		}

		return new SignatureInfo();

	}

//	private List<SignatureInfo> searchHistory(Message<List<SignatureInfo>> requestMessage, String actionType) {
//		SignatureInfo sg = requestMessage.getPayload().get(0);
//
//		if (sg.getPa() != null) {
//			log.info("search signature by PA: [{}]", sg.getPa());
//
//			List<SignatureInfo> testInfo = signatureInfoRepo
//					.findByPaAndOwnInstitutionOrderBySignatureCreateDateDesc(sg.getPa(), 1);
//			testInfo.forEach(f -> buildSignatureInfo(f));
//			return testInfo;
//		} else {
//			log.info("PA not found for search signature information");
//			throw new RuntimeException("PA not found.");
//		}
//
//	}

	private List<SignatureInfo> searchHistory(Message<List<SignatureInfo>> requestMessage, String actionType) {
		SignatureInfo sg = requestMessage.getPayload().get(0);

		if (!StringUtils.isEmpty(sg.getEmployeeId())) {
			log.info("search signature by Employee ID: [{}]", sg.getEmployeeId());

			List<SignatureInfo> testInfo = signatureInfoRepo
					.findByEmployeeIdOrderBySignatureCreateDateDesc(sg.getEmployeeId());
			testInfo.forEach(f -> buildSignatureInfo(f));
			return testInfo;
		}

		else if (sg.getPa() != null) {
			log.info("search signature by PA: [{}]", sg.getPa());

//			List<SignatureInfo> testInfo = signatureInfoRepo
//					.findByPaAndOwnInstitutionOrderBySignatureCreateDateDesc(sg.getPa(), 1);
			List<SignatureInfo> testInfo = signatureInfoRepo
					.findByPaAndInstitutionNameStartingWithOrderBySignatureCreateDateDesc(sg.getPa(), institutionName);
			testInfo.forEach(f -> buildSignatureInfo(f));
			return testInfo;
		} else {
			log.info("PA not found for search signature information");
			throw new RuntimeException("PA not found.");
		}

	}

	public SignatureInfo buildSignatureInfo(SignatureInfo dbSgInfo) {
		try {

			if (dbSgInfo != null) {
				dbSgInfo.setBase64Image(Utils.file2Base64(basePath + File.separator + dbSgInfo.getSignaturePath()));
			} else {
				log.info("getting null value");
				throw new PathNotFoundException("Signature Not found.");
			}
		} catch (Exception e) {
			log.info("getting error: ", e);
			throw new RuntimeException(e.getMessage());
		}
		return dbSgInfo;
	}

	public boolean isHaveActiveSignatureBypa(String pa) {
		return signatureInfoRepo.existsByPaAndActive(pa, 1);
	}

	public boolean isHaveActiveSignatureByEmployeeId(String employeeId) {
		return signatureInfoRepo.existsByEmployeeIdAndActive(employeeId, 1);
	}

	public SignatureInfo findAllByPa(String pa) {
		log.info("searching signature information for pa:{}", pa);
		return signatureInfoRepo.findByPaAndStatusAndIsMainSignatureAndActive(pa, Str.APPROVED, 1, 1);
	}

	public SignatureInfo findAllBySignatureId(Long signatureId) {
		return signatureInfoRepo.findAllBySignatureIdAndActive(signatureId, 1);
	}

	public SignatureInfo findBySygnatoryId(Long signatoryId) {
		return signatureInfoRepo.findAllBySignatoryIdAndActive(signatoryId, 1);
	}

	public SignatureInfo findBySygnatoryIdAndIsMainSignature(Long signatoryId, int isMainSignature) {
		return signatureInfoRepo.findAllBySignatoryIdAndIsMainSignatureAndActive(signatoryId, isMainSignature, 1);
	}

	public boolean isExitsSignature(SignatureInfo sg) {
		return signatureInfoRepo.countByEmployeeIdAndIsMainSignatureAndActive(sg.getEmployeeId(), 1, 0) > 0;
	}

	public boolean isExitsEmployeeIdAndIsMainSignature(String employeeId, int isMainSignature) {
		return signatureInfoRepo.countByEmployeeIdAndIsMainSignatureAndActive(employeeId, isMainSignature, 0) > 0;
	}

}
