package com.softcafe.esignature.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.naming.directory.InvalidAttributeIdentifierException;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.core.model.User;
import com.softcafe.core.security.SecurityService;
import com.softcafe.core.service.DocumentFilesService;
import com.softcafe.core.service.UserService;
import com.softcafe.core.util.AppPermissionEnum;
import com.softcafe.esignature.entity.Institution;
import com.softcafe.esignature.entity.PublicLink;
import com.softcafe.esignature.entity.Request;
import com.softcafe.esignature.entity.SignatureInfo;
import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.model.ViewRequest;
import com.softcafe.esignature.repo.RequestRepo;
import com.softcafe.esignature.utils.Str;

@Service
public class RequestService extends AbstractService<Request> {

	private static final Logger log = LoggerFactory.getLogger(RequestService.class);

	@Autowired
	RequestRepo requestrRepo;
	@Autowired
	private MailTempleteService mailTempleteService;

	@Autowired
	private DocumentFilesService documentFilesService;

	@Autowired
	private MailService mailService;

	@Autowired
	private PublicLinkService publicLinkService;
	@Autowired
	private SecurityService securityService;

	@Autowired
	private ViewRequestService viewRequestService;
	@Autowired
	private InstitutionService institutionService;

	@Autowired
	private UserService userService;

	@Value("${request.complete.mail.body.path:mail/requestCompleteMailBody.html}")
	String requestCompleteMailBodyPath;
	String requestCompleteMailBody;

	@PostConstruct
	private void init() {

		log.info("Initializing signatureInfo service");

		try {
			requestCompleteMailBody = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + requestCompleteMailBodyPath), Charset.defaultCharset());

			log.info("requestCompleteMailBody : \n[{}]", requestCompleteMailBody);

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

			if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				Page<ViewRequest> obj = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				Page<ViewRequest> obj = selectAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.SELECT_BY_USER.toString())) {
				Page<ViewRequest> obj = selectByUser(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				Page<ViewRequest> obj = update(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				Page<ViewRequest> obj = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_REJECT.toString())) {
				Page<ViewRequest> obj = reject(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.VIEW_REQUEST.toString())) {
				SignatureInfo obj = viewRequest(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.CHECK_USER.toString())) {
				User obj = checkUser(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.SEARCH.toString())) {
				SignatureInfo obj = search(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	private SignatureInfo viewRequest(Message<List<Request>> requestMessage, String actionType) throws Exception {

		String publicLink = requestMessage.getPayload().get(0).getPublicLink();
		checkLink(publicLink);

		SignatureInfo dbinfo = publicLinkService.findPublicLickByLink(publicLink);

		return dbinfo;
	}

	private SignatureInfo search(Message<List<Request>> requestMessage, String actionType) throws Exception {

		String publicLink = requestMessage.getPayload().get(0).getPublicLink();
		checkLink(publicLink);

		SignatureInfo dbinfo = publicLinkService.findPublicLickByLink(publicLink);

		return dbinfo;
	}

	private User checkUser(Message<List<Request>> requestMessage, String actionType)
			throws IOException, InvalidAttributeIdentifierException {

		String publicLink = requestMessage.getPayload().get(0).getPublicLink();
		checkLink(publicLink);

		PublicLink pbLink = publicLinkService.findPublicLink(publicLink);
//		
//		SignatureInfo dbInfo = publicLinkService.findPublicLickByLink(publicLink); 
		if (pbLink != null && pbLink.getLinkType().equals("FOR_USER")) {
			return userService.findUserByEmail(pbLink.getLnkSendingEmail());
		}
		return null;
	}

	private void checkLink(String publicLink) throws InvalidAttributeIdentifierException {
		if (StringUtils.isEmpty(publicLink)) {
			log.info("can not find link");
			throw new InvalidAttributeIdentifierException("Link value is empty");
		}
	}

	private Page<ViewRequest> update(Message<List<Request>> requestMessage, String actionType) throws Exception {
		Request req = requestMessage.getPayload().get(0);

		return saveRequest(req, requestMessage.getHeader().getUserId().longValue());
	}

	private Page<ViewRequest> delete(Message<List<Request>> requestMessage, String actionType) throws Exception {
		securityService.hasPermission(requestMessage.getHeader().getUserId().longValue(), AppPermissionEnum.REQUEST_APPROVER);
		Request req = requestMessage.getPayload().get(0);

		return deleteRequest(req, requestMessage.getHeader().getUserId().longValue());
	}

	private Page<ViewRequest> reject(Message<List<Request>> requestMessage, String actionType) throws Exception {
		securityService.hasPermission(requestMessage.getHeader().getUserId().longValue(), AppPermissionEnum.REQUEST_CHECKER);Request req = requestMessage.getPayload().get(0);

		return rejectRequest(req, requestMessage.getHeader().getUserId().longValue());
	}

	private Page<ViewRequest> selectByUser(Message<List<Request>> requestMessage, String actionType) {
		Request req = requestMessage.getPayload().get(0);
		Pageable pageable = PageRequest.of(req.getPageNumber() - 1, req.getPageSize(),
				Sort.by("modTime").descending());

		return loadRequest(requestMessage.getHeader().getUserId().longValue(), pageable);
//		return viewRequestService.findAllRequestByCreatorId(req.getInstitutionId(), pageable);
	}

	private Page<ViewRequest> save(Message<List<Request>> msg, String actionType) throws Exception {
		Request req = msg.getPayload().get(0);

		return saveRequest(req, msg.getHeader().getUserId().longValue());

	}

	private Page<ViewRequest> selectAll(Message<List<Request>> requstMessage, String actionType) {
//		return requestrRepo.findAllByActive(1);
		Request er = requstMessage.getPayload().get(0);
		Pageable pageable = PageRequest.of(er.getPageNumber() - 1, er.getPageSize(),
				Sort.by("modTime").descending());

		Long userId = requstMessage.getHeader().getUserId().longValue();

		return loadRequest(userId, pageable);

	}

	public Page<ViewRequest> loadRequest(Long userId, Pageable pageable) {

		Institution ins = institutionService.findInstitutionInfoByUserId(userId);

//		return viewRequestService.findAllRequest();
		if (ins != null && ins.getOwnInstitution() == 1) {
			return viewRequestService.findAllRequest(pageable);
		} else if (ins != null && ins.getOwnInstitution() == 0) {
			return viewRequestService.findAllRequestByCreatorId(ins.getInstitutionId(), pageable);
		} else {
			log.info("can not find institution information for the userId: [{}]", userId);
			return null;
		}
	}

	public Page<ViewRequest> saveRequest(Request req, Long userId) throws Exception {
	
		Request sr = null;
		Pageable pageable = PageRequest.of(req.getPageNumber() - 1, req.getPageSize(),
				Sort.by("externalUserRequestId").descending());
		
		 HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		try {
			if (req.getRequestId() == null) {
				securityService.hasPermission(userId, AppPermissionEnum.REQUEST_MAKER);
				if (req.getType().equals(Str.GENERATE_LINK) && req.getLinkType().equals("FOR_USER")) {
					if (userService.findUserByEmail(req.getLnkSendingEmail()) == null) {
						log.info("User not found by the email {}", req.getLnkSendingEmail());
						throw new UsernameNotFoundException("User Not Found For The Email " + req.getLnkSendingEmail());
					}
				}
				sr = new Request();
				sr.setInstitutionId(req.getInstitutionId());
				sr.setType(req.getType());
				sr.setCreateDate(new Date());
				sr.setCreatorId(userId);
				sr.setSignatoryId(req.getSignatoryId());
				sr.setStatus(Str.NEW);
				sr.setDescription(req.getDescription());
				sr.setUserRequestType(req.getUserRequestType());
				sr.setUserRequestForm(req.getUserRequestForm());
				sr.setIpAddr(request.getRemoteAddr());
				sr.setIpGateway(request.getHeader("X-Forwarded-For"));
				requestrRepo.save(sr);
				if (req.getDocument() != null) {
					documentFilesService.saveFile(sr.getRequestId(), req.getDocument(), Str.REQUEST_DOC, userId, null,
							null);
				} else if (req.getType().equals(Str.GENERATE_LINK)) {
					PublicLink pl = publicLinkService.saveNew(sr.getRequestId(), req);

				}
				return viewRequestService.findAllRequestByCreatorId(req.getInstitutionId(), pageable);
			} else {
//				securityService.hasPermissionIn(userId, Arrays.asList(AppPermissionEnum.REQUEST_CHECKER, AppPermissionEnum.REQUEST_APPROVER));

				sr = requestrRepo.findAllByRequestIdAndActive(req.getRequestId(), 1);

				if (req.getStatus().equals(Str.COMPLETED)) {
					securityService.hasPermission(userId, AppPermissionEnum.REQUEST_CHECKER);
					sr.setCompleteDate(req.getCompleteDate());
					sr.setCompleteBy(userId);
					sr.setCompleteRequestDate(new Date());
					
					log.info("user create success.");
				} else if (req.getStatus().equals(Str.PEND_APPROVED)) {
					securityService.hasPermission(userId, AppPermissionEnum.REQUEST_APPROVER);
					sr.setCheckerBy(userId);
					sr.setCheckerDate(new Date());
				}
				sr.setModDate(new Date());
				sr.setUserModId(userId);
				sr.setStatus(req.getStatus());

				requestrRepo.save(sr);
				
				if(req.getStatus().equals(Str.COMPLETED) && sr.getType().equals(Str.REQUEST_CREATION)) {
					if (Str.USER_CREATION.equals(sr.getUserRequestType())) {
						log.info("try to handeling USER_CREATION request");
						/* Here USER_CREATION request work */
						userService.createUserByRequest(sr.getUserRequestForm(), userId);
					}
					else if(Str.USER_ACTIVATION.equals(sr.getUserRequestType())) {
						// need activation user
						userService.userByRequest(sr.getUserRequestForm(), userId, Str.PEND_ACTIVE);
					}
					else if(Str.USER_DEACTIVATION.equals(sr.getUserRequestType())) {
						//need deactivation user
						userService.userByRequest(sr.getUserRequestForm(), userId, Str.PEND_INACTIVE);
					}
				}
				


//				if (req.getStatus().equals(Str.COMPLETED)) {
//					ViewRequest vr = viewRequestService.findRequest(sr.getRequestId());
//					sendingRequestNotificationMail(vr);
//				}

			}

		} catch (Exception e) {
			log.info("getting error to save request");
			throw new Exception(e.getMessage());
		}

		try {
			if (sr.getStatus().equals(Str.COMPLETED)) {

				log.info("sending mail to:{}", req.getRequesterEmail());
//				sendMail4Request(req.getRequesterEmail(), sr);

				sendRequestMail(sr, false);
//				ViewRequest vr = viewRequestService.findRequest(sr.getRequestId());
//				sendingRequestNotificationMail(vr);

			}
		} catch (Exception e) {
			log.info("getting error to sending mail. email:error:\n[{}:{}]", req.getRequesterEmail(), e.getMessage());
			return viewRequestService.findAllRequestByCreatorId(req.getInstitutionId(), pageable);
		}

		return viewRequestService.findAllRequestByCreatorId(req.getInstitutionId(), pageable);
//		return requestrRepo.findAllByCreatorIdAndActiveOrderByCreateDateDesc(userId, 1);
	}

//	private void sendingRequestNotificationMail(ViewRequest vr) {
//
//		log.info("try to sending email for request");
////		Thread th = new Thread(() -> {
//		try {
//			if (vr.getRequestType().equals(Str.REQUEST_FOR_BOOKLET)) {
//				mailTempleteService.findRequestByType(vr, MailType.BOOKLET_CHECK);
//			} else if (vr.getRequestType().equals(Str.REQUEST_FOR_BOOKLET)) {
//				mailTempleteService.findRequestByType(vr, MailType.BOOKLET_CHECK);
//
//			}
//		} catch (Exception e) {
//			// TODO: handle exception
//			log.info("getting error for sending the mail for request.");
//		}
////		});
////		th.start();
////		lkdlf
//
//	}

	private Page<ViewRequest> deleteRequest(Request req, long userId) throws Exception {
		Request sr = null;
		Pageable pageable = PageRequest.of(req.getPageNumber() - 1, req.getPageSize(),
				Sort.by("externalUserRequestId").descending());

		try {
			sr = requestrRepo.findAllByRequestIdAndActive(req.getRequestId(), 1);
			sr.setActive(0);
			sr.setModDate(new Date());
			sr.setUserModId(userId);
			requestrRepo.save(sr);
		} catch (Exception e) {
			log.info("getting exeption to delete request. requestId:exeption=>[{}:{}]", req.getRequestId(),
					e.getMessage());
			throw new Exception(e.getMessage());
		}
		return viewRequestService.findAllRequestByCreatorId(req.getInstitutionId(), pageable);
	}

	private Page<ViewRequest> rejectRequest(Request req, long userId) throws Exception {

		Pageable pageable = PageRequest.of(req.getPageNumber() - 1, req.getPageSize(),
				Sort.by("externalUserRequestId").descending());

		try {
			Request sr = requestrRepo.findAllByRequestIdAndActive(req.getRequestId(), 1);
			sr.setModDate(new Date());
			sr.setUserModId(userId);
			sr.setRejectCause(req.getRejectCause());
			sr.setRejectBy(userId);
			sr.setStatus(Str.REJECTED);
			requestrRepo.save(sr);

			sendRequestMail(sr, true);

		} catch (Exception e) {
			log.info("getting exeption to delete request. requestId:exeption=>[{}:{}]", req.getRequestId(),
					e.getMessage());
			throw new Exception(e.getMessage());
		}
		return viewRequestService.findAllRequestByCreatorId(req.getInstitutionId(), pageable);
	}

	private void sendRequestMail(Request sr, boolean isReject) throws FileNotFoundException {

		try {
			ViewRequest vr = viewRequestService.findRequest(sr.getRequestId());
//			if(isReject) {
			if (vr.getRequestType().equals(Str.REQUEST_FOR_BOOKLET)) {
				mailTempleteService.findRequestByType(vr, isReject ? MailType.BOOKLET_REJECT : MailType.BOOKLET_CHECK);
			} else if (vr.getRequestType().equals(Str.VERIFY_SIGNATURE)) {
				mailTempleteService.findRequestByType(vr,
						isReject ? MailType.VERIFY_SIGNATURE_REJECT : MailType.VERIFY_SIGNATURE_CHECK);
			} else if (vr.getRequestType().equals(Str.REQUEST_CREATION)) {

				if (vr.getUserRequestType().equals(Str.USER_CREATION)) {
					mailTempleteService.findRequestByType(vr,
							isReject ? MailType.USER_CREATION_REJECT : MailType.USER_CREATION_CHECK);
				} else if (vr.getUserRequestType().equals(Str.USER_ACTIVATION)) {
					mailTempleteService.findRequestByType(vr,
							isReject ? MailType.USER_ACTIVATION_REJECT : MailType.USER_ACTIVATION_CHECK);
				} else if (vr.getUserRequestType().equals(Str.USER_DEACTIVATION)) {
					mailTempleteService.findRequestByType(vr,
							isReject ? MailType.USER_DEACTIVATION_REJECT : MailType.USER_DEACTIVATION_CHECK);
				} else if (vr.getUserRequestType().equals(Str.SERVICE_REQUEST)) {
					mailTempleteService.findRequestByType(vr,
							isReject ? MailType.SERVICE_REQUEST_REJECT : MailType.SERVICE_REQUEST_CHECK);
				}
			} else if (vr.getRequestType().equals(Str.GENERATE_LINK)) {

				PublicLink pl = publicLinkService.findPublicLickByRequestId(sr.getRequestId()).get();
				publicLinkService.updateLink(pl);

				if (isReject) {
					mailTempleteService.findRequestByType(vr, MailType.GENERATE_LINK_REJECT);
				} else {
					mailTempleteService.sendLinkRequest(vr, MailType.GENERATE_LINK_CHECK);
				}

			} else if (vr.getRequestType().equals(Str.OTHERS)) {
				mailTempleteService.findRequestByType(vr, isReject ? MailType.OTHERS_REJECT : MailType.OTHERS_CHECK);
			}
//			}
		} catch (Exception e) {
			log.info("getting error to sending request mail");
		}

	}

	private void sendMail4Request(String requesterEmail, Request sr) {
		try {
			String subject = null;

			String completeMailBody = null;

			ViewRequest ver = viewRequestService.findRequest(sr.getRequestId());

			if (sr.getType().equals(Str.GENERATE_LINK)) {
				mailTempleteService.sendAccessMail2User(ver);
			} else {

//				userService.sendingMail2User(User user, UserLink ul)
				subject = "Complete Request";

				completeMailBody = buildCompleteMailBody(sr);
			}

			log.info("final Complete mail=> TO: template is: [{}=>{}]", requesterEmail, completeMailBody);

			// sending mail
			mailService.send(subject, completeMailBody, requesterEmail);

//			Runnable task = () -> {
//				try {
//				} catch (Exception e) {
//					log.error("Error Sending Activation toggle mail to [{}]\n{}", requesterEmail, e);
//				}
//			};
//			Thread thread = new Thread(task);
//			thread.start();

		} catch (Exception e) {
			log.error("Error Sending cancel mail to [{}]\n{}", requesterEmail, e);
		}

	}

	private String buildCompleteMailBody(Request sr) {
		ViewRequest ver = viewRequestService.findRequest(sr.getRequestId());
		return requestCompleteMailBody
				.replace(Str.name, StringUtils.isBlank(ver.getName()) ? "" : ("Name: " + ver.getName()))
				.replace(Str.pa, StringUtils.isBlank(ver.getPa()) ? "" : ("PA: " + ver.getPa()))
				.replace(Str.requestFor, StringUtils.isBlank(ver.getRequestType()) ? "" : (ver.getRequestType()))
				.replace(Str.description,
						StringUtils.isBlank(ver.getDescription()) ? "" : ("Description: " + ver.getDescription()));
	}

}
