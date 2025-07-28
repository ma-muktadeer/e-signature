package com.softcafe.esignature.service;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.core.model.DocumentFiles;
import com.softcafe.core.security.SecurityService;
import com.softcafe.core.service.DocumentFilesService;
import com.softcafe.esignature.entity.Institution;
import com.softcafe.esignature.entity.Signatory;
import com.softcafe.esignature.entity.Signature;
import com.softcafe.esignature.exceptions.PermissionNotAllowedException;
import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.repo.SignatoryInfoViewRepo;
import com.softcafe.esignature.repo.SignatoryRepo;
import com.softcafe.esignature.utils.ActivityType;
import com.softcafe.esignature.utils.Str;
import com.softcafe.esignature.view.SignatoryInfoView;

@Service
public class SignatoryService extends AbstractService<Signatory> {
	private static final Logger log = LoggerFactory.getLogger(SignatoryService.class);

	@Autowired
	private SignatoryRepo signatoryRepo;
	@Autowired
	private ActivityLogService activityLogService;
	@Autowired
	private SignatureService signatureService;

	@Autowired
	private DocumentFilesService documentFilesService;

	@Autowired
	private InstitutionService institutionService;

	@Autowired
	private MailTempleteService mailTempleteService;
	@Autowired
	private SecurityService securityService;

	@Autowired
	SignatoryInfoViewRepo signatoryInfoViewRepo;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;
		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

			if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				SignatoryInfoView obj = searchSignatory(requestMessage, actionType);
//				SignatoryInfoView obj = selectAll(requestMessage, actionType);

				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_SIGNATORY.toString())) {
				SignatoryInfoView obj = searchSignatory(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.ACTION_SELECT_ALL_UPLOAD.toString())) {
				SignatoryInfoView obj = selectAll4Upload(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				SignatoryInfoView obj = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				SignatoryInfoView obj = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				SignatoryInfoView obj = update(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.BUILD_IMAGE64.toString())) {
				List<DocumentFiles> obj = buildImage64(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.SEARCH_PA_NAME.toString())) {
				List<SignatoryInfoView> obj = searchPaOrName(requestMessage, actionType);
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

	private List<SignatoryInfoView> searchPaOrName(Message<List<Signatory>> requestMessage, String actionType) {
		Signatory sg = requestMessage.getPayload().get(0);

//		List<SignatureInfo> paList = signatureInfoRepo
//				.findAllByPaContainingIgnoreCaseOrNameContainingIgnoreCaseAndStatusAndIsMainSignatureAndActive(
//						sg.getPa(), sg.getName(), Str.APPROVED, 1, 1);

		List<SignatoryInfoView> paList = signatoryInfoViewRepo
				.findAllByPaContainingIgnoreCaseOrNameContainingIgnoreCaseAndStatusAndActive(sg.getPa(), sg.getName(),
						Str.APPROVED, 1);

		log.info("Getting employe. search By : size is:[{}, {}]", sg.getPa(), paList.size());
//		return paList.parallelStream().map(SignatureInfo::getPa).collect(Collectors.toList());
		return paList;
	}

	private List<DocumentFiles> buildImage64(Message<List<Signatory>> requestMessage, String actionType) {
		Signatory sg = requestMessage.getPayload().get(0);
		log.info("Finding all document for signatory id:[{}]", sg.getSignatoryId());
		return documentFilesService.loadDocumentByObjectId(sg.getSignatoryId());
	}

	private SignatoryInfoView delete(Message<List<Signatory>> requestMessage, String actionType) throws Exception {
		log.info("trying to delete signatory");
		Signatory sg = requestMessage.getPayload().get(0);
		Long userId = Long.valueOf(requestMessage.getHeader().getUserId());
		log.info("User id is: [{}]", userId);
		List<Signatory> requestSignatory = sg.getRequestSignatory();
		requestSignatory = deleteingSignatory(requestSignatory, userId);
		return sendResponse(requestSignatory, sg.getPageNumber(), sg.getPageSize());
//		return sg;
	}

	private List<Signatory> deleteingSignatory(List<Signatory> requestSignatory, Long userId) throws Exception {
		try {
			List<Signatory> updateSignatory = new ArrayList<Signatory>();
			requestSignatory.forEach(r -> {
				log.info("Deleting signatory id is : [{}]", r.getSignatoryId());
				r.setUserModId(userId);
				r.setModDate(new Date());
				r.setActive(0);
				updateSignatory.add(r);
			});
			requestSignatory = signatoryRepo.saveAll(requestSignatory);

		} catch (Exception e) {
			log.info("getting error for deleting signatory.  error is\n[{}]", e);
			throw new Exception(e);
		}

		return requestSignatory;
	}

	private SignatoryInfoView save(Message<List<Signatory>> requestMessage, String actionType) throws Exception {
		Signatory sg = requestMessage.getPayload().get(0);
		Long userId = Long.valueOf(requestMessage.getHeader().getUserId());

		// 1st check the duplicate pa number

		try {
			saveOrUpdateSignatory(sg, userId, requestMessage.getHeader().getSenderSourceIPAddress(),
					requestMessage.getHeader().getSenderGatewayIPAddress());
			List<Signatory> signatoryList = Arrays.asList(sg);
			return sendResponse(signatoryList, sg.getPageNumber(), sg.getPageSize());
		} catch (Exception e) {
			log.info("getting exception; [{}]", e.getMessage());
		}

		return new SignatoryInfoView();
	}

	private SignatoryInfoView update(Message<List<Signatory>> requestMessage, String actionType) throws Exception {
//		securityService.hasPermission(requestMessage.getHeader().getUserId().longValue(), AppPermissionEnum.SIGNATORY_MAKER);
		List<Signatory> sgLs = requestMessage.getPayload().get(0).getRequestSignatory();
		Integer pageNumber = requestMessage.getPayload().get(0).getPageNumber();
		Integer pageSize = requestMessage.getPayload().get(0).getPageSize();
		SignatoryInfoView sg = new SignatoryInfoView();
		Long userId = Long.valueOf(requestMessage.getHeader().getUserId());

		// 1st check the duplicate pa number

		try {
			for (Signatory nSg : sgLs) {
				log.info("trying to update signatory for fignatoryId:{}", nSg.getSignatoryId());
				saveOrUpdateSignatory(nSg, userId, requestMessage.getHeader().getSenderSourceIPAddress(),
						requestMessage.getHeader().getSenderGatewayIPAddress());
			}
			sg = sendResponse(sgLs, pageNumber, pageSize);
		} catch (Exception e) {
			log.info("getting error for updating signatory. \nexception:{}", e.getLocalizedMessage());
			throw new Exception(e.getLocalizedMessage());
		}

		return sg;
	}

	private SignatoryInfoView saveOrUpdateSignatory(Signatory sg, Long userId, String senderSourceIPAddress,
			String senderGatewayIPAddress) throws Exception {

		Signatory dbSg = null;
		SignatoryInfoView sgg = new SignatoryInfoView();

		boolean isOwnInstitution = institutionService.findOwnInstitution(sg.getInstitutionId());
//		
		log.info("getting for Pa:EmployeeId:institurionId:{}", sg.getPa(), sg.getEmployeeId(), sg.getInstitutionId());

		dbSg = signatoryRepo.findAllByEmployeeIdAndInstitutionIdAndActive(sg.getEmployeeId(), sg.getInstitutionId(), 1);
		Signatory dbSgs = signatoryRepo.findAllByPaAndInstitutionIdAndActive(sg.getPa(), sg.getInstitutionId(), 1);
		Signatory dbSgse = signatoryRepo.findAllByEmailAndInstitutionIdAndActive(sg.getEmail(), sg.getInstitutionId(),
				1);

//		if (!StringUtils.isBlank(sg.getPa())) {
//			dbSg = signatoryRepo.findAllByEmployeeIdAndPaAndInstitutionIdAndActive(sg.getEmployeeId(), sg.getPa(),
//					sg.getInstitutionId(), 1);
//		} else {
//			dbSg = signatoryRepo.findAllByEmployeeIdAndInstitutionIdAndActive(sg.getEmployeeId(), sg.getInstitutionId(),
//					1);
//
////			if (!StringUtils.isEmpty(sg.getPa())) {
////
////				dbSg = signatoryRepo.findAllByEmployeeIdAndPaAndInstitutionIdAndActive(sg.getEmployeeId(), sg.getPa(),
////						sg.getInstitutionId(), 1);
////			} else {
////				dbSg = signatoryRepo.findAllByEmployeeIdAndInstitutionIdAndActive(sg.getEmployeeId(),
////						sg.getInstitutionId(), 1);
////			}
//		}

		if (dbSg != null && sg.getSignatoryId() == null) {
			if (dbSg.getPa().equals(sg.getPa())) {
				throw new Exception("Duplicate PA number.");
			}
			if (dbSg.getEmployeeId().equals(sg.getEmployeeId())) {
				throw new Exception("Duplicate Employee ID.");
			}
			if (dbSg.getContactNumber().equals(sg.getContactNumber())) {
				throw new Exception("Duplicate Contact Number.");
			}

		}
		if (dbSgs != null && sg.getSignatoryId() == null) {
			throw new Exception("Duplicate PA number for the institution.");
		}
		if (dbSgse != null && sg.getSignatoryId() == null) {
			throw new Exception("Duplicate Email for the institution.");
		}

		else if (dbSg == null && sg.getSignatoryId() != null) {
			throw new Exception("Duplicate Signatory ID.");
		}
//		sg.setSignatoryId(null);
		else if (dbSg == null && sg.getSignatoryId() == null) {
			sgg = saveNewSignature(sg, userId, isOwnInstitution);

			activityLogService.save(userId, sg.getSignatoryId(), ActivityType.SAVE_SIGNATORY, senderSourceIPAddress,
					senderGatewayIPAddress);

		} else if (dbSg != null && sg.getSignatoryId() != null) {
			sgg = updateSignatory(dbSg, sg, userId);

			activityLogService.save(userId, sg.getSignatoryId(), ActivityType.UPDATE_SIGNATORY, senderSourceIPAddress,
					senderGatewayIPAddress);
		} else {
			throw new Exception("Getting unsolve error.");
		}
		return sgg;
	}

	private SignatoryInfoView saveNewSignature(Signatory sg, Long userId, boolean isOwnInstitution)
			throws PermissionNotAllowedException {
//		securityService.hasPermission(userId, AppPermissionEnum.SIGNATORY_MAKER);
		String insName = institutionService.getInstitutionName(sg.getInstitutionId());

		Signatory newSg = new Signatory();
		if (!StringUtils.isBlank(insName) && insName.toLowerCase().contains("prime bank")) {
			newSg.setIdentify(Str.INTERNAL);
		}
		newSg.setName(sg.getName());
		newSg.setDesignation(sg.getDesignation());
		newSg.setApproval(sg.getApproval());
		newSg.setAddress(sg.getAddress());
		newSg.setEmail(sg.getEmail());
		newSg.setDepartment(sg.getDepartment());
		newSg.setInstitutionId(sg.getInstitutionId());
		newSg.setType(sg.getType());
		newSg.setEmployeeId(sg.getEmployeeId());
		newSg.setNid(sg.getNid());

		newSg.setCreateDate(new Date());
		newSg.setClientId(userId);
		newSg.setCreatorId(userId);
		newSg.setGroup(sg.getGroup());
		newSg.setDeligation(sg.getDeligation());
		newSg.setBirthday(sg.getBirthday());
		newSg.setContactNumber(sg.getContactNumber());
		// getting the pa
		if (isOwnInstitution) {
			newSg.setStatus(sg.getStatus());
			newSg.setPa(String.valueOf(signatoryRepo.getPAFromSequence()));
		} else {
			newSg.setPa(sg.getPa());
			newSg.setStatus(Str.APPROVED);
		}

		if (sg.getStatus().equals(Str.PEND_APPROVE)) {
			newSg.setApproveBy(userId);
			newSg.setApproveDate(new Date());
		}

//		lklk

		newSg = saveSignatory(newSg);

		List<Signatory> signatoryList = Arrays.asList(newSg);
		return sendResponse(signatoryList, sg.getPageNumber(), sg.getPageSize());
	}

	private SignatoryInfoView updateSignatory(Signatory dbSg, Signatory sg, Long userId) throws PermissionNotAllowedException {
//		securityService.hasPermission(userId, AppPermissionEnum.SIGNATORY_MAKER);
		dbSg.setName(sg.getName());
		dbSg.setDesignation(sg.getDesignation());
		dbSg.setApproval(sg.getApproval());
		dbSg.setAddress(sg.getAddress());
		dbSg.setDepartment(sg.getDepartment());
		dbSg.setGroup(sg.getGroup());
		dbSg.setDeligation(sg.getDeligation());
		dbSg.setBirthday(sg.getBirthday());
		dbSg.setNid(sg.getNid());

		dbSg.setEmail(sg.getEmail());
		dbSg.setStatus(sg.getStatus());
		dbSg.setContactNumber(sg.getContactNumber());
		dbSg.setRejectCause("");
		if (sg.getStatus().equals(Str.PEND_APPROVE)) {
			dbSg.setApproveBy(userId);
			dbSg.setApproveDate(new Date());
		} else if (sg.getStatus().equals(Str.APPROVED)) {
//			securityService.hasPermission(userId, AppPermissionEnum.SIGNATORY_CHECKER);
			dbSg.setAutorizeBy(userId);
			dbSg.setAutorizeDate(new Date());
		} else if (sg.getStatus().equals(Str.REJECTED)) {
			dbSg.setRejectCause(sg.getRejectCause());
		}
		dbSg.setModDate(new Date());
		dbSg.setUserModId(userId);
//		saveSignatory(dbSg);
		dbSg = signatoryRepo.save(dbSg);
		if (dbSg.getStatus().equals(Str.APPROVED)) {
			log.info("sending mail to PA holder email: {}", dbSg.getEmail());
			sendingMail2PaHolder(dbSg);

		} else if (sg.getStatus().equals(Str.REJECTED)) {
//			sending mail to setApproveBy user 
			log.info("sending mail to PA holder email: {}", dbSg.getEmail());
			sendingMail2SignatoryMaker(dbSg);
		}

		List<Signatory> signatoryList = Arrays.asList(dbSg);
		return sendResponse(signatoryList, sg.getPageNumber(), sg.getPageSize());
//		List<Signatory> signatoryList = Arrays.asList(dbSg);
//		return sendResponse(signatoryList);
	}

	private void sendingMail2PaHolder(Signatory dbSg) {
		Thread th = new Thread(() -> {
			try {
				mailTempleteService.sendPaCreationMail(Str.PA, dbSg, MailType.PA_CHECK);
			} catch (FileNotFoundException e) {
				log.info("getting error to sending mail to email:{}", dbSg.getEmail());
			}
		});
		th.start();
	}

	private void sendingMail2SignatoryMaker(Signatory dbSg) {
		Thread th = new Thread(() -> {
			try {
				mailTempleteService.sendPaRejectMail(Str.PA, dbSg, MailType.PA_REJECT);
			} catch (FileNotFoundException e) {
				log.info("getting error to sending mail to email:error:[{}:{}]", dbSg.getEmail(), e.getMessage());
			}
		});
		th.start();
	}

	private Signatory saveSignatory(Signatory sg) {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		sg.setIpAddr(request.getRemoteAddr());
		sg.setIpGateway(request.getHeader("X-Forwarded-For"));
		return signatoryRepo.save(sg);
//		List<Signatory> signatoryList = Arrays.asList(sg);
//		return sendResponse(signatoryList);
	}

	private SignatoryInfoView selectAll(Message<List<Signatory>> requestMessage, String actionType)
			throws PermissionNotAllowedException {
//		securityService.hasPermission(requestMessage.getHeader().getUserId().longValue(), AppPermissionEnum.SIGNATORY_VIEWER);
		Signatory sg = requestMessage.getPayload().get(0);
		log.info("finding all signatory list");
//        List<Signatory> signatoryList = signatoryRepo.findAll();

		Sort sort = Sort.by("signatoryId").descending();
		Pageable pageable = PageRequest.of(sg.getPageNumber() - 1, sg.getPageSize(), sort);

		Page<SignatoryInfoView> pageSg = null;

		if (!StringUtils.isBlank(requestMessage.getPayload().get(0).getType())) {
			pageSg = signatoryInfoViewRepo.findAllByTypeAndActive(requestMessage.getPayload().get(0).getType(), 1,
					pageable);
		} else {
			pageSg = signatoryInfoViewRepo.findAllByActive(1, pageable);
		}

		log.info("finding all signatory size= [{}]", pageSg.getSize());

		SignatoryInfoView sgv = new SignatoryInfoView();

		sgv.setAllSignatory(pageSg.getContent());
		sgv.setTotal(pageSg.getTotalElements());
		return sgv;
	}

	private SignatoryInfoView searchSignatory(Message<List<Signatory>> requestMessage, String actionType) {
		Signatory sg = requestMessage.getPayload().get(0);
		log.info("Searching signature information for:\nPA:EmployeeId:Email:institutionId=[{},{},{},{}]", sg.getPa(),
				sg.getEmployeeId(), sg.getEmail(), sg.getInstitutionId());

		Pageable pageable = PageRequest.of(sg.getPageNumber() - 1, sg.getPageSize(),
				Sort.by("signatoryId").descending());

		Page<SignatoryInfoView> pageSg = signatoryInfoViewRepo
				.findAllByEmployeeIdAndPaAndEmailAndInstitutionIdAndNameAndActive(sg.getEmployeeId(), sg.getPa(),
						sg.getEmail(), sg.getInstitutionId(),sg.getName(), 1, pageable);

		log.info("finding all signatory size= [{}]", pageSg.getSize());

		SignatoryInfoView sgv = new SignatoryInfoView();

		sgv.setAllSignatory(pageSg.getContent());
		sgv.setTotal(pageSg.getTotalElements());

		return sgv;
	}

	private SignatoryInfoView selectAll4Upload(Message<List<Signatory>> requestMessage, String actionType) throws Exception {

		Signatory reqSg = requestMessage.getPayload().get(0);
//		List<Long> ids = Arrays.asList(reqSg.getInstitutionId());

		SignatoryInfoView sg = new SignatoryInfoView();
		log.info("finding all signatory list");
		// now find all institution list by institution type
		List<Long> institutionIds = null;
		if (!StringUtils.isBlank(reqSg.getUserType()) && reqSg.getUserType().equals(Str.INTERNAL_USER)) {
			log.info("getting institution list for internal user");
			institutionIds = Arrays.asList(reqSg.getInstitutionId());
		} else if (!StringUtils.isBlank(reqSg.getUserType()) && reqSg.getUserType().equals(Str.EXTERNAL_USER)) {
			log.info("getting institution list for external user");
			institutionIds = institutionService.getAllInstitutionByType(reqSg.getInsType()).stream()
					.map(Institution::getInstitutionId).collect(Collectors.toList());

		} else {
			log.info("can not find any match");
			throw new Exception("Sorry. We can not find any institution.");
		}

		List<SignatoryInfoView> signatoryList = new ArrayList<SignatoryInfoView>();
//		List<Signatory> signatoryList = new ArrayList<Signatory>();
//		if(!StringUtils.isBlank(reqSg.getUserType()) && reqSg.getUserType().equals(Str.INTERNAL_USER)) {
//			signatoryList = signatoryRepo.findAllByInstitutionIdInAndActive(ids, 1, Sort.by("signatoryId").descending());
//		}else if(!StringUtils.isBlank(reqSg.getUserType()) && reqSg.getUserType().equals(Str.EXTERNAL_USER)) {
//			signatoryList = signatoryRepo.findAllByInstitutionIdNotInAndActive(ids, 1, Sort.by("signatoryId").descending());
//		}
//		else {
//			log.info("Signatory type not found");
//			throw new Exception("Signatory type not found");
//		}
//		
//		List<Signatory> signatoryList = signatoryRepo.findAllByActive(1, Sort.by("signatoryId").descending());

//		signatoryList = signatoryRepo.findAllByInstitutionIdInAndTypeAndStatusAndActive(institutionIds,
//				reqSg.getUserType(), Str.APPROVED, 1, Sort.by("signatoryId").descending());
		
		signatoryList = signatoryInfoViewRepo.findAllByInstitutionIdInAndTypeAndStatusAndActive(institutionIds,
				reqSg.getUserType(), Str.APPROVED, 1, Sort.by("signatoryId").descending());

		List<Signature> signatureList = signatureService.getAllActiveSignature();
		List<Long> signatoryIds = signatureList.stream().map(Signature::getSignatoryId).collect(Collectors.toList());

		log.info("finding all signatory list:size= \n[{},{}]", Arrays.toString(signatoryList.toArray()),
				signatoryList.size());

		signatoryList = signatoryList.stream().filter(e -> !signatoryIds.contains(e.getSignatoryId()))
				.collect(Collectors.toList());
		log.info("filtaring signatory list:size =\n[{},{}]", signatoryList, signatoryList.size());

		sg.setAllSignatory(signatoryList);
//		sg.setTotal(signatoryList.get);
		return sg;
	}

	public SignatoryInfoView sendResponse(List<Signatory> saveSignatory, Integer pageNumber, Integer pageSize) {
//		Signatory sg = new Signatory();
		SignatoryInfoView sg = new SignatoryInfoView();
		Pageable pageable = PageRequest.of(pageNumber != null ? pageNumber - 1 : 0, pageSize != null ? pageSize : 20,
				Sort.by("signatoryId").descending());
		sg.setRequestSignatory(saveSignatory);
//        List<Signatory> signatoryList = signatoryRepo.findAll();
		Page<SignatoryInfoView> signatoryList = signatoryInfoViewRepo.findAllByActive(1, pageable);
		log.info("finding [{}] signatory list", signatoryList.getSize());
		sg.setAllSignatory(signatoryList.getContent());
		sg.setTotal(signatoryList.getTotalElements());
		return sg;
	}

	public Signature updateOrSaveSignature(Signature entity, Long userId) {
		boolean isOwnInstitution = institutionService.findOwnInstitution(entity.getInstitutionId());
		Signatory dbSg = null;
		if (!StringUtils.isBlank(entity.getPa()) && isOwnInstitution) {
			dbSg = signatoryRepo.findAllByPaAndInstitutionIdAndActive(entity.getPa(), entity.getInstitutionId(), 1);
		} else if (!isOwnInstitution) {
			dbSg = signatoryRepo.findAllByEmployeeIdAndInstitutionIdAndActive(entity.getEmployeeId(),
					entity.getInstitutionId(), 1);
		}

		if (dbSg != null) {
			dbSg.setName(entity.getName());
			dbSg.setInstitutionId(entity.getInstitutionId());
			dbSg.setDesignation(entity.getDesignation());
			dbSg.setModDate(new Date());
			dbSg.setUserModId(entity.getCreatorId());
//			updateSignatory(dbSg);
			dbSg.setEmail(entity.getEmail());
//			saveSignatory(dbSg);
			dbSg.setModDate(new Date());
			dbSg.setUserModId(userId);
			dbSg.setEmployeeId(entity.getEmployeeId());
			dbSg.setBaranchName(entity.getBaranchName());
			dbSg.setDepartment(entity.getDepartmentName());
			dbSg.setBirthday(entity.getBirthday());
			dbSg.setIssueDate(entity.getIssueDate());
			dbSg.setContactNumber(entity.getContactNumber());
			dbSg.setPaStatus(entity.getPaStatus());
//			dbSg.setStatus(Str.APPROVED);
			dbSg = signatoryRepo.save(dbSg);
		} else {
//			Signatory sg = new Signatory();
			dbSg = new Signatory();
			dbSg.setInstitutionId(entity.getInstitutionId());
			dbSg.setPa(entity.getPa());
			dbSg.setName(entity.getName());
			dbSg.setDesignation(entity.getDesignation());
			dbSg.setCreatorId(userId);
			dbSg.setCreateDate(new Date());
			dbSg.setEmail(entity.getEmail());
//			saveSignatory(dbSg);
			dbSg.setCreateDate(new Date());
			dbSg.setCreatorId(userId);
			dbSg.setEmployeeId(entity.getEmployeeId());
			dbSg.setBaranchName(entity.getBaranchName());
			dbSg.setDepartment(entity.getDepartmentName());
			dbSg.setBirthday(entity.getBirthday());
			dbSg.setIssueDate(entity.getIssueDate());
			dbSg.setContactNumber(entity.getContactNumber());
			dbSg.setPaStatus(entity.getPaStatus());
			dbSg.setStatus(Str.APPROVED);
			dbSg = signatoryRepo.save(dbSg);
		}
		entity.setSignatoryId(dbSg.getSignatoryId());
		return entity;

	}

	public SignatoryInfoView signatoryUploadHandel(Signatory entity, Long userId, MultipartFile[] othersDocs,
			String senderSourceIPAddress, String senderGatewayIPAddress) throws Exception {
		SignatoryInfoView sg = null;
//		securityService.hasPermission(userId, AppPermissionEnum.SIGNATORY_MAKER);

		try {
			sg = saveOrUpdateSignatory(entity, userId, senderSourceIPAddress, senderGatewayIPAddress);
			if (sg != null) {
//				Long signatoryId = sg.getRequestSignatory().get(0).getSignatoryId();
				Long id = null;
				if (sg.getRequestSignatory() != null && sg.getRequestSignatory().get(0) != null) {
					id = sg.getRequestSignatory().get(0).getSignatoryId();
				}
				if (id != null) {
					log.info("trying to save signatory document for signatoryId:[{}]", id);
					documentFilesService.saveSignatoryDocument(id, entity, othersDocs, userId,
							sg.getRequestSignatory().get(0), null, senderSourceIPAddress, senderGatewayIPAddress);
				} else {
					log.info("can not save document for employeeId:[{}] because of signatoryId is null.",
							entity.getEmployeeId());
				}
//				sg = sendResponse(sgLs, pageNumber, pageSize);

				return sendResponse(Arrays.asList(new Signatory()), entity.getPageNumber(), entity.getPageSize());
			} else {
				log.info("Can not save sigatory");
				throw new Exception("Error comes to save signatory.");
			}
		} catch (Exception e) {
			log.info("getting error:{}", e);
			throw new Exception(e.getMessage());
		}

	}

	public Signatory findBySignatoryId(Long signatoryId) {
		// TODO Auto-generated method stub
		return signatoryRepo.findAllBySignatoryIdAndActive(signatoryId, 1);
	}
}
