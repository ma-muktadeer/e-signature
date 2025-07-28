package com.softcafe.esignature.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.core.model.User;
import com.softcafe.core.service.UserService;
import com.softcafe.esignature.entity.MailTemplete;
import com.softcafe.esignature.entity.Otp;
import com.softcafe.esignature.entity.PublicLink;
import com.softcafe.esignature.entity.Signatory;
import com.softcafe.esignature.entity.SignatureDownloadInfo;
import com.softcafe.esignature.entity.SignatureInfo;
import com.softcafe.esignature.entity.UserLink;
import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.model.ViewRequest;
import com.softcafe.esignature.repo.MailTempleteRepo;
import com.softcafe.esignature.utils.Str;
import com.softcafe.esignature.utils.TokenConstant;
import com.softcafe.esignature.utils.Utils;
import com.softcafe.esignature.view.UserListView;

import javassist.NotFoundException;

@Service
public class MailTempleteService extends AbstractService<MailTemplete> {
	private static final Logger log = LoggerFactory.getLogger(MailTempleteService.class);

	private static final SimpleDateFormat sdf = new SimpleDateFormat("dd MMM, yyyy");
	private static final SimpleDateFormat sdft = new SimpleDateFormat("dd-MM-yyyy HH:ss a");

//	@Value("${ex.user.active.mail.group}")
//	String exUserActiveMailGroup;
//	@Value("${ex.user.active.mail.type}")
//	String exUserActiveMailType;

	@Value("${user.set.pass.url.time}")
	private int expireHour;

	@Value("${publick.base.link}")
	String publicBaseLink;

	@Value("${user.profile.complete.baseLink:http://localhost:4200/complete-regi}")
	String cmpltUsrProfile;

	@Value("${esignature.base.link:First login to e-signature}")
	String esignatureBaseLink;

	@Value("${external.user.first.login.mail.subject:First login to e-signature}")
	String extUserFirstLoginMailSubject;

	@Value("${extUserFirstLoginMailBodyPath:mail/extUserFirstLoginMailToBody.html}")
	String extUserFirstLoginMailBodyPath;
	String extUserFirstLoginMailBody;

	@Value("${activationMailBodyPath:mail/forgotPassMailBody.html}")
	String forgotPassMailToAdminBodyPath;
	String forgotPassMailToAdminBody;

//	@Value("${activationMailBodyPath:mail/forgotPassMailBody4Otp.html}")
//	String forgotPassMailBody4OtpPath;
//	String forgotPassMailBody4Otp;

//	@Value("${userCancleMailBodyPath:mail/signatureCancleMail.html}")
//	String userCancleMailBodyPath;
//	String userCancleMailBody;

	@Value("${external.user.first.login.pass.mail.body.path:mail/extUserFirstLoginPassMailBody.html}")
	String passMailBodyPath;
	String passMailBody;

//	@Value("${activationMailBodyPath:mail/extUserFirstLoginMailToBody.html}")
//	String activationMailBodyPath;
//	String activationMailBody;

	@Autowired
	private MailTempleteRepo mailTempleteRepo;
	@Autowired
	private MailService mailService;
	@Autowired
	private PublicLinkService publicLinkService;

	@Autowired
	private MailNotificationService mailNotificationService;

	@Autowired
	private UserService userService;

	@PostConstruct
	public void init() {
		try {
			passMailBody = FileUtils.readFileToString(ResourceUtils.getFile("classpath:" + passMailBodyPath),
					Charset.defaultCharset());

			extUserFirstLoginMailBody = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + extUserFirstLoginMailBodyPath), Charset.defaultCharset());

			forgotPassMailToAdminBody = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + forgotPassMailToAdminBodyPath), Charset.defaultCharset());
//			forgotPassMailBody4Otp = FileUtils.readFileToString(
//					ResourceUtils.getFile("classpath:" + forgotPassMailBody4OtpPath), Charset.defaultCharset());

			log.info("extUserFirstLoginMailBody: {}", extUserFirstLoginMailBody);
			log.info("forgotPassMailToAdminBody: {}", forgotPassMailToAdminBody);
			log.info("passMailBody: {}", passMailBody);
//			log.info("forgotPassMailBody4Otp: {}", forgotPassMailBody4Otp);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
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
				List<MailTemplete> obj = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<MailTemplete> obj = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_1.toString())) {
				MailTemplete obj = select1(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_PEND_DELETE.toString())) {
				List<MailTemplete> obj = pendDelete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				List<MailTemplete> obj = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	private List<MailTemplete> pendDelete(Message<List<MailTemplete>> requestMessage, String actionType)
			throws NotFoundException {
		MailTemplete mt = requestMessage.getPayload().get(0);
		if (mt.getMailTempId() != null) {
			log.info("getting delete rrequest for mail teplateid: {}", mt.getMailTempId());
			mt = mailTempleteRepo.findAllByMailTempIdAndActive(mt.getMailTempId(), 1);
			if (mt != null) {
				mt.setUserModId(requestMessage.getHeader().getUserId().longValue());
				mt.setModDate(new Date());
				mt.setUpdateStatus(Str.PEND_DELETE);
				mailTempleteRepo.save(mt);

				return findAllTemplete();
			} else {
				log.info("Can not find active mail template for={}", mt.getMailTempId());
				throw new NotFoundException("Can not find active mail template");
			}

		} else {
			log.info("Invalid request");
			throw new NotFoundException("Invalid request");
		}
	}

	private List<MailTemplete> delete(Message<List<MailTemplete>> requestMessage, String actionType)
			throws NotFoundException {
		MailTemplete mt = requestMessage.getPayload().get(0);
		if (mt.getMailTempId() != null) {
			log.info("getting delete rrequest for mail teplateid: {}", mt.getMailTempId());
			MailTemplete mtt = mailTempleteRepo.findAllByMailTempIdAndActive(mt.getMailTempId(), 1);
			if (mtt != null) {
				mtt.setActive(0);
				mtt.setStatus(mt.getStatus());
				mtt.setUserModId(requestMessage.getHeader().getUserId().longValue());
				mtt.setModDate(new Date());
				mailTempleteRepo.save(mtt);

				return findAllTemplete();
			} else {
				log.info("Can not find active mail template for={}", mt.getMailTempId());
				throw new NotFoundException("Can not find active mail template");
			}

		} else {
			log.info("Invalid request");
			throw new NotFoundException("Invalid request");
		}
	}

	private MailTemplete select1(Message<List<MailTemplete>> requestMessage, String actionType) {
		MailTemplete mt = requestMessage.getPayload().get(0);
		if (!StringUtils.isBlank(mt.getGroup()) && !StringUtils.isBlank(mt.getType())) {
			log.info("finding mail template for group: type = [{}:{}]", mt.getGroup(), mt.getType());
			return findMailTempalteByGroupAndType(mt.getGroup(), mt.getType());
		}
		log.info("invalid request for finding mail template");
		return null;
	}

	private List<MailTemplete> select(Message requestMessage, String actionType) {

		return findAllTemplete();
	}

	private List<MailTemplete> findAllTemplete() {
		return mailTempleteRepo.findAllByActive(1, Sort.by("mailTempId").descending());
	}

	private List<MailTemplete> save(Message<List<MailTemplete>> requestMessage, String actionType) throws Exception {

		MailTemplete mt = requestMessage.getPayload().get(0);
		Long userId = requestMessage.getHeader().getUserId().longValue();
		if (mt.getMailTempId() == null) {
			log.info("request to Save MailTemplete. Requested by:{}", userId);
			if (!StringUtils.isBlank(mt.getGroup()) && !StringUtils.isBlank(mt.getType())) {
				return saveMailTmp(mt, userId);
			} else {
				throw new NotFoundException("Template group and type is mandatory");
			}

		} else {
			log.info("request to Updaet MailTemplete. Requested by: MailTempletId:[{},{}]", userId, mt.getMailTempId());
			return updateMailTemp(mt, userId);
		}
	}

	private List<MailTemplete> updateMailTemp(MailTemplete mt, Long userId) {
		MailTemplete dbMt = mailTempleteRepo.findAllByMailTempIdAndActive(mt.getMailTempId(), 1);

		if (dbMt != null) {
//			dbMt = setMtInfo(dbMt, mt);
			if (mt.getStatus().equals(Str.PEND_APPROVE)) {
				dbMt.setApproveById(userId);
				dbMt.setApproveTime(new Date());
				if (!StringUtils.isBlank(dbMt.getUpdateStatus()) && dbMt.getUpdateStatus().equals(Str.PEND_MODIFIED)) {
					dbMt.setUpdateStatus(Str.PEND_APPROVE);
				} else {
					dbMt.setStatus(mt.getStatus());
				}
			} else if (mt.getStatus().equals(Str.APPROVED)) {
				if (!StringUtils.isBlank(dbMt.getUpdateStatus()) && dbMt.getUpdateStatus().equals(Str.PEND_APPROVE)) {
					dbMt.setBody(dbMt.getReqBody());
					dbMt.setReqBody("");
					dbMt.setSubject(dbMt.getReqSubject());
					dbMt.setReqSubject("");
					dbMt.setUpdateStatus(Str.MODIFIED);
					dbMt.setStatus(Str.APPROVED);
				} else {
					dbMt.setStatus(mt.getStatus());
				}
				dbMt.setAuthorizeBy(userId);
				dbMt.setAuthorizeDate(new Date());
			} else if (mt.getStatus().equals(Str.PEND_MODIFIED)) {
				dbMt.setModDate(new Date());
				dbMt.setUserModId(userId);
				dbMt.setUpdateStatus(mt.getStatus());
				dbMt.setReqBody(mt.getBody());
				dbMt.setReqSubject(mt.getSubject());
			}

			mailTempleteRepo.save(dbMt);
			return findAllTemplete();
		} else {
			log.info("can not find MailTemplet Id. Requested by:{}", userId);
			throw new IllegalArgumentException("Invalid Request.");
		}
	}

	private List<MailTemplete> saveMailTmp(MailTemplete mt, Long userId) throws Exception {
		Boolean isExist = mailTempleteRepo.existsByGroupAndTypeAndActive(mt.getGroup(), mt.getType(), 1);
		if (isExist) {
			log.info("getting exist mail template for mail group:type:active=[{}:{}:{}]", mt.getGroup(), mt.getType(),
					1);
			throw new Exception("Mail template is allready exists.");
		}

		MailTemplete newMt = new MailTemplete();
		newMt.setActive(1);
		newMt.setCreateDate(new Date());
		newMt.setCreatorId(userId);
		newMt.setStatus(Str.NEW);
		newMt = setMtInfo(newMt, mt);

		mailTempleteRepo.save(newMt);
		return findAllTemplete();
	}

	private MailTemplete setMtInfo(MailTemplete newMt, MailTemplete oldMt) {
		newMt.setBody(oldMt.getBody());
		newMt.setSubject(oldMt.getSubject());
		newMt.setGroup(oldMt.getGroup());
		newMt.setType(oldMt.getType());
		return newMt;
	}

	public MailTemplete findMailTemp4ExUser() throws FileNotFoundException {
//		MailTemplete mt = mailTempleteRepo.findAllByGroupAndTypeAndStatusAndActive(Str.USER,
//				Str.EXTERNAL_USER_CREATION, Str.APPROVED, 1);
//
//		if (mt == null) {
//			log.info("External user creation mail template are not available.\ntemplateGroup:Type=[{},{}]",
//					Str.USER, Str.EXTERNAL_USER_CREATION);
//			throw new FileNotFoundException("Mail template not found");
//		}

		return findMailTempByGroupAndType(Str.USER, Str.EXTERNAL_USER_CREATION, Str.APPROVED, 1);
	}

	private MailTemplete findMailTemp4PublicLink() throws FileNotFoundException {

		return findMailTempByGroupAndType(Str.SIGNATURE, Str.PUBLIC_LINK_CREATION, Str.APPROVED, 1);
	}

	private MailTemplete findMailTempByGroupAndType(String group, String type, String approved, int i)
			throws FileNotFoundException {
		log.info("Finding mail template for\ntemplateGroup:Type=[{},{}]", group, type);
		MailTemplete mt = mailTempleteRepo.findAllByGroupAndTypeAndStatusAndActive(group, type, approved, 1);

		if (mt == null) {
			log.info("mail template are not available.\ntemplateGroup:Type=[{},{}]", group, type);
			throw new FileNotFoundException("Mail template not found");
		}

		return mt;
	}

	private String extPassMailReplace(String loginName, String mailTemp, String pass) {

		return mailTemp.replace("#username#", checkNull(loginName)).replace("#pass#", pass).replace("#extime#",
				String.valueOf(expireHour));

//		return null;
	}

	private void sendMail(String subject, String body, String email) {
		log.info("Sending user profile complete mail to [{}]", email);
		log.info("sending mail body: [{}]", body);
		Runnable task = () -> {
			try {
				mailService.send(subject, body, email, null, null);
			} catch (Exception e) {
				log.error("Error Sending Activation toggle mail to [{}]\n{}", email, e);
			}
		};
		Thread thread = new Thread(task);
		thread.start();
	}

	private String extMailReplace(String link, String loginName, String template) {
//		String lnk = "<a href=\"" + cmpltUsrProfile + "?link=" + link + "\"> click </a> for compleate your profile";
//		log.info("sending link is:[{}]", lnk);
		return template.replace("#username#", StringUtils.isBlank(loginName) ? "" : loginName)
				.replace("#link#", StringUtils.isBlank(link) ? "" : link)
				.replace("#extime#", String.valueOf(expireHour));

	}

	public void sendAccessMail2User(ViewRequest ver) throws FileNotFoundException {

		PublicLink pl = publicLinkService.findPublicLickByRequestId(ver.getExternalUserRequestId())
				.orElseThrow(() -> new RuntimeException("Public link Info is not find."));

		publicLinkService.updateLink(pl);

//		sdf

		MailTemplete mt = findMailTemp4PublicLink();
		String email = pl.getLnkSendingEmail();

		sendMail(mt.getSubject(), buildPublicMailTemp(pl, mt.getBody()), email);

	}

	private String buildPublicMailTemp(PublicLink publicLink, String body) {
		log.info("public link send mail body: \n[{}]", body);
		String bldBody = null;

		if (!StringUtils.isBlank(publicLink.getPublicLink())) {
			Date expireDate = publicLink.getExpireDate();
			String formattedDate = expireDate != null ? new SimpleDateFormat("yyyy-MM-dd HH:mm").format(expireDate)
					: "";
			String lnk = "<a href=\"" + publicBaseLink + "login?link=" + publicLink.getPublicLink()
					+ "\"> click </a> for compleate your profile";

			bldBody = body.replace("#link#", lnk).replace("#pa#", checkNull(publicLink.getPa())).replace("#extime#",
					formattedDate);
		}
		log.info("final mail body for public Link is:[{}]", bldBody);
		return bldBody;
	}

//	private String checkNull(String value) {
//		return StringUtils.isEmpty(value)? "" : value;
//	}

	public void sendForgotPassMail(UserLink ul, User testUser) {
		try {
			String mBody = replaceForgotPassMailBody(ul, testUser);
			log.info("sending forgot password mail body: [{}]", mBody);
			sendMail("Forgot e-Signature password", mBody, testUser.getEmail());
		} catch (Exception e) {
			log.error("Error Sending forgot password mail to [{}]\n{}", testUser.getEmail(), e);
		}
	}

	private String replaceForgotPassMailBody(UserLink ul, User testUser) {
		return forgotPassMailToAdminBody.replace("#Username#", testUser.getLoginName()).replace("#link#",
				"<a href=\"" + publicBaseLink + "forgot-password?link=" + ul.getLink() + "\"> click </a>");
	}

	public void sendForgotPassMail(Otp otp, User testUser) {
		try {
//			String mBody = replaceForgotPassMailBody4Otp(otp, testUser);
//			log.info("sending forgot password mail body: [{}]", mBody);
//			sendMail("Forgot e-Signature password", mBody, testUser.getEmail());
			MailTemplete mt = mailTempleteRepo.findAllByGroupAndTypeAndStatusAndActive(Str.USER,
					MailType.FORGOT_PASSWORD.toString(), Str.APPROVED, 1);
			mt = buildUserSubjectAndBody(mt, otp, testUser, null);

			mailNotificationService.sendUserNotification(mt, testUser.getEmail(), null, null, MailType.FORGOT_PASSWORD);

		} catch (Exception e) {
			log.error("Error Sending forgot password mail to [{}]\n{}", testUser.getEmail(), e);
		}

	}

	public void sendLoginOtpMail(Otp otp, User testUser) {
		try {
			MailTemplete mt = mailTempleteRepo.findAllByGroupAndTypeAndStatusAndActive(Str.USER,
					MailType.LOGIN_OTP.toString(), Str.APPROVED, 1);
			mt = buildUserSubjectAndBody(mt, otp, testUser, null);

			mailNotificationService.sendUserNotification(mt, testUser.getEmail(), null, null, MailType.LOGIN_OTP);

		} catch (Exception e) {
			log.error("Error Sending forgot password mail to [{}]\n{}", testUser.getEmail(), e);
		}

	}

	private MailTemplete buildUserMail(MailTemplete mt, User user, String pass, UserLink ul) {

		mt = replaceTempPassTime(mt, ul);

		return buildUserSubjectAndBody(mt, null, user, pass);
	}

	private MailTemplete replaceTempPassTime(MailTemplete mt, UserLink ul) {
		mt.setSubject(replaseTempPassTime(mt.getSubject(), ul));
		mt.setBody(replaseTempPassTime(mt.getBody(), ul));

		return mt;
	}

	private String replaseTempPassTime(String st, UserLink ul) {
		return st.replace(TokenConstant.tempPasswordExpireTime, ul == null ? " " : checkNull(ul.getExpireDate()));
	}

	public MailTemplete buildUserSubjectAndBody(MailTemplete mt, Otp otp, User user, String tempPass) {
//		log.info("getting temp group:type:body=[{}:{}:\n{}]", mt.getGroup(), mt.getType(), mt.getBody());
		try {
			UserListView ul = userService.findUser(user.getUserId());
			MailTemplete m = new MailTemplete();
			m.setBody(replaceUserTemplate(mt.getBody(), ul, otp, tempPass));
			m.setSubject(replaceUserTemplate(mt.getSubject(), ul, otp, tempPass));
			m.setType(mt.getType());

			return m;
		} catch (Exception e) {
			log.info("getting user is null for bulding mail temp group:type=[{}:{}]", mt.getGroup(), mt.getType());
		}
		return mt;

	}

	private MailTemplete buildUserNotifyTime(MailTemplete mt, int notifyTime) {
		MailTemplete m = new MailTemplete();
		m.setBody(replaceUserNotifyTimeTemplate(mt.getBody(), notifyTime));
		m.setSubject(replaceUserNotifyTimeTemplate(mt.getSubject(), notifyTime));
		m.setType(mt.getType());

		return m;
	}

	private String replaceUserNotifyTimeTemplate(String st, int notifyTime) {
		return st.replace(TokenConstant.loginNotifyTime, checkNull(notifyTime)).replace(TokenConstant.passNotifyTime,
				checkNull(notifyTime));
	}

	private String replaceUserTemplate(String temp, UserListView user, Otp otp, String tempPass) {
		if (temp == null) {
			return temp;
		}
		String st = temp.replace(TokenConstant.username, checkNull(user.getFullName()))
				.replace(TokenConstant.userId, checkNull(user.getLoginName()))
				.replace(TokenConstant.userEmail, checkNull(user.getEmail()))
				.replace(TokenConstant.loginId, checkNull(user.getLoginName()))
				.replace(TokenConstant.otp, otp == null ? " " : checkNull(otp.getOtp()))
				.replace(TokenConstant.otpExpireTime, otp == null ? " " : dateFormate(otp.getExpireDate(), true))
//				.replace(TokenConstant.otpExpireTime, otp == null ? " " : checkNull(otp.getExpireDate()))
				.replace(TokenConstant.tempPass, tempPass == null ? " " : checkNull(tempPass))
				.replace(TokenConstant.userType, user.getIsMasterUser() == 1 ? "Master User" : "Sub User")
//				.replace(TokenConstant.tempPasswordExpireTime, checkNull(user.getPassExpired()))
				.replace(TokenConstant.loginNotifyTime, dateFormate(new Date(), true))
				.replace(TokenConstant.passNotifyTime, dateFormate(new Date(), true))
				.replace(TokenConstant.institutionName, checkNull(user.getInstitutionName()))
				.replace(TokenConstant.rejectionCause, checkNull(user.getRejectCause()))
				.replace(TokenConstant.loginTry, " ");
		log.info("replacing template value is: {}", st);
		return st;
	}

	public void sendSignatureNotification(SignatureInfo dbSg, String emails, String cc, String bcc, MailType mailType,
			String oldSigStatus) {

		try {
			MailTemplete mt = mailTempleteRepo.findAllByGroupAndTypeAndStatusAndActive(Str.SIGNATURE,
					mailType.toString(), Str.APPROVED, 1);
			if (mt == null) {
				log.info("{} mail template not found.", mailType.toString());
				return;
			}

			mt = buildSignatureSubjectAndBody(mt, dbSg, oldSigStatus);
			mailNotificationService.sendUserNotification(mt, emails, cc, bcc, mailType);

		} catch (Exception e) {
			log.error("Error Sending {} mail to [{}]\n{}", mailType.toString(), emails, e);
		}
	}

	public void sendResendPassMail(User user, String pass, List<MailType> mailTypeList) {
		try {
			log.error("Sending mail to: {}", user.getEmail());
			List<String> mtTypeList = mailTypeList.stream().map(MailType::toString).collect(Collectors.toList());
			List<MailTemplete> mtList = mailTempleteRepo.findAllByGroupAndTypeInAndStatusAndActive(Str.USER, mtTypeList,
					Str.APPROVED, 1);
			if (mtList.size() > 0) {
				for (MailTemplete mt : mtList) {
					mt = buildUserSubjectAndBody(mt, null, user, pass);
					mailNotificationService.sendUserNotification(mt, user.getEmail(), null, null,
							MailType.valueOf(mt.getType()));

				}
			} else {
				log.info("Resend password mail template not found");
			}

		} catch (Exception e) {
			log.error("Error sending deactivation mail {}", e);
		}

	}

	public void sentMail4FirstLogin(User user, String pass, UserLink ul, List<MailType> mailTypeList) {
		try {
			log.error("Sending mail to: {}", user.getEmail());
			List<String> mtTypeList = mailTypeList.stream().map(MailType::toString).collect(Collectors.toList());
			List<MailTemplete> mtList = mailTempleteRepo.findAllByGroupAndTypeInAndStatusAndActive(Str.USER, mtTypeList,
					Str.APPROVED, 1);
			if (mtList.size() > 0) {
				for (MailTemplete mt : mtList) {
					String emails = "";
					String email = user.getEmail();
					if (mt.getType().equals(MailType.FIRST_LOGING_FIRST_MAIL.toString())) {
						emails = userService.findAllAdminUsersEmail();
//						if (!StringUtils.isBlank(emails)) {
//							email = email + "," + userService.findAllAdminUsersEmail();
//						}
					}

					MailTemplete m = buildUserMail(mt, user, pass, ul);

//					MailTemplete m = buildUserSubjectAndBody(mt, null, user, pass);

					mailNotificationService.sendUserNotification(m, email, null, emails, MailType.valueOf(m.getType()));
//					mailNotificationService.sendUserNotification(m, emails, MailType.valueOf(m.getType()));

				}
			} else {
				log.info("First login mail template not found");
			}

		} catch (Exception e) {
			log.error("Error sending deactivation mail {}", e);
		}
	}

	public void sentMailExUser(User usr, String link, String pass) {
		try {
			log.error("Sending mail to: {}", usr.getEmail());
//		MailTemplete mt = findMailTemp4ExUser();
//		sendMail(mt.getSubject(), extMailReplace(link, loginName, mt.getBody()), email);

			Runnable rn = () -> {
//				sendMail(extUserFirstLoginMailSubject,
//						extMailReplace(esignatureBaseLink, loginName, extUserFirstLoginMailBody), email);
//
//				sendMail(extUserFirstLoginMailSubject, extPassMailReplace(loginName, passMailBody, pass), email);

				MailTemplete mt = findMailTempalteByGroupAndType(Str.USER, MailType.RESEND_PASSWORD.toString());
				if (mt != null) {
					mt = buildUserSubjectAndBody(mt, null, usr, pass);
				}

			};

			Thread th = new Thread(rn);
			th.start();

//		if (sendActivationToggleMailToAdmin) {
//			log.info("Sending deactivation mail to admin");
//			sendActivationToggleMail(deActivationMailSubject,
//					mailReplace(dbUser, deActivationMailToAdminBody), userRegistrationAdminMail);
//		}
		} catch (Exception e) {
			log.error("Error sending deactivation mail {}", e);
		}
	}

	private MailTemplete buildSignatureSubjectAndBody(MailTemplete mt, SignatureInfo dbSg, String oldSigStatus) {
		mt.setSubject(replaceSignatureTemplate(mt.getSubject(), dbSg, oldSigStatus));
		mt.setBody(replaceSignatureTemplate(mt.getBody(), dbSg, oldSigStatus));
		return mt;
	}

	private String replaceSignatureTemplate(String temp, SignatureInfo dbSg, String oldSigStatus) {

		Signatory sg = new Signatory(dbSg);
		String st = replacePaTemplate(temp, sg);

		st = st.replace(TokenConstant.name, checkNull(dbSg.getName()))
				.replace(TokenConstant.employeeId, checkNull(dbSg.getEmployeeId()))
//				.replace(TokenConstant.cancelTime, checkNull(dbSg.getCancelTime()) )
				.replace(TokenConstant.cancelTime, dateFormate(dbSg.getCancelTime()))
//				.replace(TokenConstant.updateTime, checkNull(dbSg.getModDate()))
				.replace(TokenConstant.updateTime, dateFormate(dbSg.getModDate()))
				.replace(TokenConstant.oldStatus, checkNull(oldSigStatus))
//				.replace(TokenConstant.effectiveDate, checkNull(dbSg.getModDate()))
				.replace(TokenConstant.effectiveDate, dateFormate(dbSg.getEffictiveDate()))
//				.replace(TokenConstant.cancelEffectiveDate, checkNull(dbSg.getCancelEffectiveDate()))
				.replace(TokenConstant.cancelEffectiveDate, dateFormate(dbSg.getCancelEffectiveDate()))
				.replace(TokenConstant.cancelCause, checkNull(dbSg.getCalcelCause()))
//				.replace(TokenConstant.inactiveTime, checkNull(dbSg.getInactiveTime()))
				.replace(TokenConstant.inactiveTime, dateFormate(dbSg.getInactiveTime()))
				.replace(TokenConstant.rejectionCause, checkNull(dbSg.getRejectionCause()))
				.replace(TokenConstant.signatureStatus, checkNull(dbSg.getSignatureStatus()));

		log.info("replacing template value is: {}", st);
		return st;
	}

	private <T> String checkNull(T value) {
		return value == null || StringUtils.isEmpty(value.toString()) ? " " : value.toString();
	}

	private String dateFormate(Date date) {
		String value = checkNull(date);
		return !StringUtils.isBlank(value) ? sdf.format(date) : value;
	}

	private String dateFormate(Date date, boolean isAddTime) {
		String value = checkNull(date);
		return !StringUtils.isBlank(value) ? sdft.format(date) : value;
	}

	public MailTemplete findActiveInactiveMailTemp(MailType type) throws FileNotFoundException {
		log.info("finding mailType: [{}] ", type);
//		return mailTempleteRepo.findAllByGroupAndTypeAndStatusAndActive(Str.USER, type.toString(), Str.APPROVED, 1);
		return findMailTempByGroupAndType(Str.USER, type.toString(), Str.APPROVED, 1);
	}

	public void sendPaCreationMail(String group, Signatory dbSg, MailType type) throws FileNotFoundException {

		if (StringUtils.isBlank(type.toString())) {
			log.info("Mail type is not found");
			return;
		}

		String email = dbSg.getEmail();
		String emails = userService.findAllAdminUsersEmail();
//		if (!StringUtils.isBlank(emails)) {
//			email = email + "," + emails;
//		}

		MailTemplete mt = findMailTempByGroupAndType(group, type.toString(), Str.APPROVED, 1);
		if (mt == null) {
			log.info("can not find mail template for MailType:[{}]", type);
		} else {
			MailTemplete m = buildPaMailTemplate(mt, dbSg);
			mailNotificationService.sendUserNotification(m, email, null, emails, type);
//			mailNotificationService.sendUserNotification(m, emails, type);

		}

	}

	public void sendPaRejectMail(String group, Signatory dbSg, MailType type) throws FileNotFoundException {

		if (StringUtils.isBlank(type.toString())) {
			log.info("Mail type is not found");
			return;
		}

		String email = userService.getUserMail(dbSg.getApproveBy());
//		String email = dbSg.getEmail();

//		String emails = userService.findAllAdminUsersEmail();
//		if (!StringUtils.isBlank(emails)) {
//			email = email + "," + emails;
//		}

		if (email == null) {
			log.info("Signatory maker email not found. userId={}", dbSg.getApproveBy());
			return;
		}

		MailTemplete mt = findMailTempByGroupAndType(group, type.toString(), Str.APPROVED, 1);
		if (mt == null) {
			log.info("can not find mail template for MailType:[{}]", type);
		} else {
			MailTemplete m = buildPaMailTemplate(mt, dbSg);
			mailNotificationService.sendUserNotification(m, email, null, null, type);

		}

	}

	private void sendMail2ApplicationAdmin(String group, Signatory dbSg, MailType type, String mail2)
			throws FileNotFoundException {
		MailTemplete mt = findMailTempByGroupAndType(group, type.toString(), Str.APPROVED, 1);
		if (mt == null) {
			log.info("can not find mail template for MailType:[{}]", type);
		} else {
			MailTemplete m = buildPaMailTemplate(mt, dbSg);
			mailNotificationService.sendUserNotification(m, mail2, null, null, type);

		}

	}

	private MailTemplete buildPaMailTemplate(MailTemplete mt, Signatory dbSg) {

		MailTemplete m = new MailTemplete();
		m.setSubject(replacePaTemplate(mt.getSubject(), dbSg));
		m.setBody(replacePaTemplate(mt.getBody(), dbSg));
		m.setType(mt.getType());

		return m;
	}

	private String replacePaTemplate(String temp, Signatory dbSg) {
		String st = temp.replace(TokenConstant.pa, checkNull(dbSg.getPa()))
				.replace(TokenConstant.paStatus, checkNull(dbSg.getPaStatus()))
				.replace(TokenConstant.paHolderName, checkNull(dbSg.getName()))
				.replace(TokenConstant.employeeId, checkNull(dbSg.getEmployeeId()))
				.replace(TokenConstant.designation, checkNull(dbSg.getDesignation()))
				.replace(TokenConstant.divisionOrBranch,
						StringUtils.isBlank(checkNull(dbSg.getBaranchName())) ? checkNull(dbSg.getDeligation()) : "")
				.replace(TokenConstant.cellNo, checkNull(dbSg.getContactNumber()))
				.replace(TokenConstant.rejectionCause, checkNull(dbSg.getRejectCause()))
				.replace(TokenConstant.emailAddress, checkNull(dbSg.getEmail()));
		log.info("replacing template value is: {}", st);

		return st;
	}

	public void findRequestByType(ViewRequest vr, MailType type) throws FileNotFoundException {

		MailTemplete mt = findMailTempByGroupAndType(Str.REQUEST, type.toString(), Str.APPROVED, 1);

		MailTemplete m = buildRequestMailTemplate(mt, vr);

		mailNotificationService.sendUserNotification(m, vr.getRequesterEmail(), null, null, type);

	}

	public void sendLinkRequest(ViewRequest vr, MailType type) throws FileNotFoundException {

		String emails = vr.getPublicLinkSend();

//		String adEmails = userService.findAllAdminUsersEmail();
//		if (!StringUtils.isBlank(adEmails)) {
//			emails = emails +"," + adEmails;
//		}

		MailTemplete mt = findMailTempByGroupAndType(Str.REQUEST, type.toString(), Str.APPROVED, 1);

		MailTemplete m = buildRequestMailTemplate(mt, vr);

		mailNotificationService.sendUserNotification(m, emails, null, null, type);

	}

	private MailTemplete buildRequestMailTemplate(MailTemplete mt, ViewRequest vr) {

		MailTemplete m = new MailTemplete();
		m.setSubject(replaceRequestMailTemplate(mt.getSubject(), vr));
		m.setBody(replaceRequestMailTemplate(mt.getBody(), vr));
		m.setType(mt.getType());

		return m;

	}

	private String replaceRequestMailTemplate(String temp, ViewRequest vr) {

		String ln = "<a href=\"" + publicBaseLink + "login?link=" + checkNull(vr.getLink()) + " \"> click </a>";

		String st = temp.replace(TokenConstant.pa, checkNull(vr.getPa()))
				.replace(TokenConstant.requestUserName, checkNull(vr.getRequesterName()))
				.replace(TokenConstant.requestUserEmail, checkNull(vr.getRequesterEmail()))
				.replace(TokenConstant.requestFor, Utils.convertToCamelCase(checkNull(vr.getRequestType())))
				.replace(TokenConstant.description, checkNull(vr.getDescription()))
				.replace(TokenConstant.paHolderName, checkNull(vr.getName()))
				.replace(TokenConstant.linkStartTime, dateFormate(vr.getFromDate()))
				.replace(TokenConstant.linkEndTime, dateFormate(vr.getToDate()))
				.replace(TokenConstant.rejectedBy, checkNull(vr.getRejectedBy()))
				.replace(TokenConstant.rejectionCause, checkNull(vr.getRejectedBy()))
				.replace(TokenConstant.institutionName, checkNull(vr.getInstitutionName()))
				.replace(TokenConstant.link, ln);
		log.info("replacing template value is: {}", st);

		return st;
	}

	public void sendForgotPassChangeSuccess(User dbUser) {

		try {

			Thread th = new Thread(() -> {
				MailTemplete mt = findMailTempalteByGroupAndType(Str.USER, MailType.PASSWORD_CHANGE_SUCCESS.toString());
				if (mt != null) {
					mt = buildUserSubjectAndBody(mt, null, dbUser, null);

					mailNotificationService.sendUserNotification(mt, dbUser.getEmail(), null, null,
							MailType.PASSWORD_CHANGE_SUCCESS);
				}

			});
			th.start();

		} catch (Exception e) {
			log.error("Error Sending forgot password mail to [{}]\n{}", dbUser.getEmail(), e);
		}

	}

	public void sendLock4WorngPass(User dbUser, int threshhold, String insName) {

		try {

			Thread th = new Thread(() -> {
				MailTemplete mt = findMailTempalteByGroupAndType(Str.USER, MailType.BLOCK_BY_WRONG_PASS.toString());

				if (mt != null) {

					String email = dbUser.getEmail();
					String emails = userService.findAllAdminUsersEmail();
//					if(!StringUtils.isBlank(emails)) {
//						email = email + "," + emails;
//					}

					mt = replaceNameAndThreshold(mt, threshhold, insName);

					mt = buildUserSubjectAndBody(mt, null, dbUser, null);

					mailNotificationService.sendUserNotification(mt, email, null, emails, MailType.PASSWORD_CHANGE_SUCCESS);
//					mailNotificationService.sendUserNotification(mt, emails, MailType.PASSWORD_CHANGE_SUCCESS);

				}

			});
			th.start();

		} catch (Exception e) {
			log.error("Error Sending forgot password mail to [{}]\n{}", dbUser.getEmail(), e);
		}

	}

	private MailTemplete replaceNameAndThreshold(MailTemplete mt, int threshhold, String insName) {
		MailTemplete m = new MailTemplete();
		m.setBody(replaceTemp(mt.getBody(), threshhold, insName));
		m.setSubject(replaceTemp(mt.getSubject(), threshhold, insName));
		m.setType(mt.getType());

		return m;
	}

	private String replaceTemp(String srt, int threshhold, String insName) {
//		.replace(TokenConstant.userId, checkNull(user.getUserId()))
		return srt.replace(TokenConstant.institutionName, checkNull(insName)).replace(TokenConstant.loginTry,
				threshhold == 0 ? " " : String.valueOf(threshhold));
	}

	public MailTemplete findMailTempalteByGroupAndType(String group, String type) {
		MailTemplete mt = mailTempleteRepo.findAllByGroupAndTypeAndActive(group, type, 1);
		if (mt == null) {
			log.info("can not find mailTemplate by group:type=[{},{}]", group, type);
			return null;
		}
		return mt;
	}

	public void sendLoginSuccessMail(User dbUser) {

		try {

			Thread th = new Thread(() -> {
				sendUserMail(Str.USER, MailType.USER_LOGIN.toString(), dbUser);
			});
			th.start();

		} catch (Exception e) {
			log.error("Error Sending forgot password mail to [{}]\n{}", dbUser.getEmail(), e);
		}
	}

	public void sendUserMailWithPblAdmin(String group, String type, User dbUser, boolean isSend2PblAdmin) {
		log.info("finding mail temp for=>group:type=[{},{}]", group, type);

		MailTemplete mt = findMailTempalteByGroupAndType(group, type);
		if (mt != null) {
			String emails = "";
			String email = dbUser.getEmail();
			log.info("sending mail to:{}", email);

			if (isSend2PblAdmin) {
				emails = userService.findAllAdminUsersEmail();
//				if (!StringUtils.isBlank(emails)) {
//					email = email + "," + emails;
//				}
			}

			mt = buildUserSubjectAndBody(mt, null, dbUser, null);

			mailNotificationService.sendUserNotification(mt, email, null, emails, MailType.valueOf(type));
//			mailNotificationService.sendUserNotification(mt, emails, MailType.valueOf(type));

		} else {
			log.info("mail template not found for=>group:type=[{},{}]", group, type);
		}

	}

	public void sendRejectMail(User dbUser, String makerEmail) {
//		Str.USER, MailType.PASSWORD_CHANGE_SUCCESS.toString()
		MailTemplete mt = findMailTempalteByGroupAndType(Str.USER, MailType.USER_REJECT.toString());
		if (mt != null) {
			log.info("sending mail to:{}", makerEmail);
//
//			if (isSend2PblAdmin) {
//				String emails = userService.findAllAdminUsersEmail();
//				if (!StringUtils.isBlank(emails)) {
//					email = email + "," + emails;
//				}
//			}

			mt = buildUserSubjectAndBody(mt, null, dbUser, null);

			mailNotificationService.sendUserNotification(mt, makerEmail, null, null, MailType.USER_REJECT);
		} else {
			log.info("mail template not found for=>group:type=[USER, USER_REJECT]");
		}
	}

	private void sendUserMail(String group, String type, User dbUser) {
		sendUserMailWithPblAdmin(group, type, dbUser, false);
	}

	protected void sendUserLoninMail(int notifyTime, String group, String type, User dbUser) {
		MailTemplete mt = findMailTempalteByGroupAndType(group, type);
		if (mt != null) {
			log.info("sending mail to:{}", dbUser.getEmail());
			mt = buildUserNotifyTime(mt, notifyTime);

			mt = buildUserSubjectAndBody(mt, null, dbUser, null);

			mailNotificationService.sendUserNotification(mt, dbUser.getEmail(), null, null, MailType.USER_LOGIN);
		} else {
			log.info("mail template not found for=>group:type=[{},{}]", group, type);
		}

	}

	public void sendingDownloadNotification(Long userId, SignatureDownloadInfo sdInf, SignatureInfo sInfo,
			MailType mType) {
		MailTemplete mt = findMailTempalteByGroupAndType(Str.DOWNLOAD_SIGNATURE, mType.toString());
		User usr = userService.findUserById(userId);
		String email = usr.getEmail();

		String adminEmails = userService.findAllAdminUsersEmail();
//		if (StringUtils.isBlank(adminEmails)) {
//			emails = emails + "," + adminEmails;
//		}
		if (mt != null) {
			mt = buildDownloadTamplate(mt, sdInf, sInfo, usr);

			mailNotificationService.sendUserNotification(mt, email, null, adminEmails, mType);
//			mailNotificationService.sendUserNotification(mt, adminEmails, mType);

		}

	}

	private MailTemplete buildDownloadTamplate(MailTemplete mt, SignatureDownloadInfo sdInf, SignatureInfo sInfo,
			User usr) {

		MailTemplete m = new MailTemplete();
		m.setBody(replaceDodnloadTemplate(mt.getBody(), sdInf, sInfo, usr));
		m.setSubject(replaceDodnloadTemplate(mt.getSubject(), sdInf, sInfo, usr));
		m.setType(mt.getType());

		return m;
	}

	private String replaceDodnloadTemplate(String temp, SignatureDownloadInfo sdInf, SignatureInfo signatureInfo,
			User usr) {

		String st = temp.replace(TokenConstant.downloaderEmail, checkNull(usr.getEmail()))
				.replace(TokenConstant.downloaderName, checkNull(usr.getFullName()))
				.replace(TokenConstant.institutionName, checkNull(sdInf.getInstitutionName()))
				.replace(TokenConstant.letterRefNo, checkNull(sdInf.getReferralNumber()))
//				.replace(TokenConstant.letterIssDate, checkNull(sdInf.getDocumentDate()))
				.replace(TokenConstant.letterIssDate, dateFormate(sdInf.getDocumentDate()))
				.replace(TokenConstant.remarks, checkNull(sdInf.getRemark()))
				.replace(TokenConstant.pa, signatureInfo != null ? checkNull(signatureInfo.getPa()) : "")
				.replace(TokenConstant.paHolderName, signatureInfo != null ? checkNull(signatureInfo.getName()) : "");

		log.info("replacing template value is: {}", st);
		return st;
	}

}
