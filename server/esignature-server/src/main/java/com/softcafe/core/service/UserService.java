package com.softcafe.core.service;

import java.io.IOException;
import java.nio.charset.Charset;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.security.sasl.AuthenticationException;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.ValidationException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomUtils;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.jdt.core.compiler.InvalidInputException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.util.ResourceUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.GenericMessage;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.delfian.core.shared.constants.Constants;
import com.google.gson.Gson;
import com.softcafe.constants.ActionType;
import com.softcafe.constants.SConfig;
import com.softcafe.core.model.GenericMap;
import com.softcafe.core.model.Login;
import com.softcafe.core.model.Role;
import com.softcafe.core.model.RoleGroup;
import com.softcafe.core.model.SConfiguration;
import com.softcafe.core.model.User;
import com.softcafe.core.model.UserApp;
import com.softcafe.core.model.UserAudit;
import com.softcafe.core.repo.AddressRepo;
import com.softcafe.core.repo.GenericMapRepo;
import com.softcafe.core.repo.LoginRepo;
import com.softcafe.core.repo.RoleRepo;
import com.softcafe.core.repo.UserAuditRepo;
import com.softcafe.core.repo.UserRepo;
import com.softcafe.core.security.JwtTokenService;
import com.softcafe.core.security.SecurityService;
import com.softcafe.core.util.AppUtils;
import com.softcafe.core.util.CF;
import com.softcafe.esignature.entity.Institution;
import com.softcafe.esignature.entity.InstitutionExtraInfo;
import com.softcafe.esignature.entity.MailTemplete;
import com.softcafe.esignature.entity.Otp;
import com.softcafe.esignature.entity.PasswordList;
import com.softcafe.esignature.entity.Regex;
import com.softcafe.esignature.entity.SecurityQuestion;
import com.softcafe.esignature.entity.SecurityQuestionAnswer;
import com.softcafe.esignature.entity.UserLink;
import com.softcafe.esignature.exceptions.OtpValidationException;
import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.model.RequestFormModle;
import com.softcafe.esignature.repo.RegexRepo;
import com.softcafe.esignature.repo.UserListViewRepo;
import com.softcafe.esignature.service.ActivityLogService;
import com.softcafe.esignature.service.InstitutionExtraInfoService;
import com.softcafe.esignature.service.InstitutionService;
import com.softcafe.esignature.service.MailNotificationService;
import com.softcafe.esignature.service.MailService;
import com.softcafe.esignature.service.MailTempleteService;
import com.softcafe.esignature.service.OtpService;
import com.softcafe.esignature.service.PasswordListService;
import com.softcafe.esignature.service.SecurityQuestionAnswerService;
import com.softcafe.esignature.service.UserLinkService;
import com.softcafe.esignature.utils.ActivityType;
import com.softcafe.esignature.utils.EncryptDecryptHelper;
import com.softcafe.esignature.utils.PassValidationRes;
import com.softcafe.esignature.utils.PasswordGenerator;
import com.softcafe.esignature.utils.RoleStr;
import com.softcafe.esignature.utils.Str;
import com.softcafe.esignature.utils.Utils;
import com.softcafe.esignature.view.UserListView;
import com.softcafe.esignature.view.ViewUserAudit;
import com.softcafe.esignature.view.ViewUserAuditRepo;

import io.jsonwebtoken.Claims;

@Service(value = "userService")
public class UserService extends AbstractService<List<User>> {
	private static final Logger log = LoggerFactory.getLogger(UserService.class);

	private static Gson gson;
	static {
		gson = new Gson();
	}
	private static final String USER = "USER";
	private static final String ROLE = "ROLE";

	private static final String APP_PERMISSION = "APP_PERMISSION";

	private static final String ROLE_GROUP = "ROLE_GROUP";

	private static final String DEPARTMENT = "DEPARTMENT";

	private static final String APP_NAME = "appName";

	private static final String USER_APP = "USER_APP";

	private static final String USER_DEPARTMENT = "USER_DEPARTMENT";

	@Value("${pass.secret.key}")
	private String SECRET_KEY;

	@Value("${profile.image.base.path}")
	private String profileImageBasePath;

//	@Value("${allow.login.attempts}")
//	private int allowLoginAttempts;

	@Value("${tmp.code.validity.min}")
	private int tmpCodeValidity;

	@Value("${sendActivationMail:true}")
	private boolean sendActivationMail;

	@Value("${sendDeactivationMail:true}")
	private boolean sendDeactivationMail;

	@Value("${adUserNotExistsMsg:Not AD user}")
	private String adUserNotExistsMsg;

	@Value("${user.password.validation.date:30}")
	private long passwordValidationDate;

	@Value("${user.password.validation.date.msg:30}")
	private long passwordValidationDateMsg;

	@Value("${user.last.login.validation.date:30}")
	private long lastLoginValidationDate;

	@Value("${presetApp:true}")
	private boolean presetApp;

	@Value("${validate.app.at.login:false}")
	private boolean validateAppAtLogin;

	@Value("${invalid.app.error.msg:You are not allowed to login this app. Please contact your administrator.}")
	private String invalidAppErrorMsg;

	@Value("${appName:E-Signature}")
	public String appName;

	@Value("${user.block.worng.pass.msg}")
	public String userBlockMsg;
	@Value("${user.block.last.login.msg}")
	public String userBlocLastLoginkMsg; // LAST_LOGIN
	@Value("${user.block.not.change.pass.msg}")
	public String userBlocNotChangePassMsg; // LAST_LOGIN

	@Value("${activationMailBodyPath:mail/activationMailBody.html}")
	String activationMailBodyPath;
	String activationMailBody;

	@Value("${activationMailBodyPath:mail/activationMailBodyToAdmin.html}")
	String activationMailToAdminBodyPath;
	String activationMailToAdminBody;

	@Value("${activationMailSubject:e-Signature account activated}")
	String activationMailSubject;

	@Value("${loginAttemptLeftMsg:Login attempt left #LEFT_COUNT# out of #TOTAL#.}")
	String loginAttemptLeftMsg;

	@Value("${before.attempt.msg}")
	public String attemptBeforeMsg;

	@Value("${deActivationMailBodyPath:mail/deActivationMailBody.html}")
	String deActivationMailBodyPath;
	String deActivationMailBody;

	@Value("${deActivationMailBodyPath:mail/deActivationMailBodyToAdmin.html}")
	String deActivationMailToAdminBodyPath;
	String deActivationMailToAdminBody;

	@Value("${userFirstLoginMailBodyPath:mail/extUserFirstLoginMailToBody.html}")
	String extUserFirstLoginMailToUserBodyPath;
	String extUserFirstLoginMailToUserBody;

	@Value("${deActivationMailSubject:Swift Viewer account deactivated}")
	String deActivationMailSubject;

	@Value("${extUserFirstLoginMailSubject:Signature profile complete}")
	String extUserFirstLoginMailSubject;

	@Value("${registerMailSubject:Swift Viewer User Registration}")
	String registerMailSubject;

	@Value("${registerMailToUserPath:mail/registerMailToUser.html}")
	String registerMailToUserPath;
	String registerMailToUserTemplate;

	@Value("${registerMailToAdminPath:mail/registerMailToAdmin.html}")
	String registerMailToAdminPath;
	String registerMailToAdminTemplate;

	@Value("${userRegistrationAdminMail:sajid.wasim@dhakabank.com.bd}")
	String userRegistrationAdminMail;

	@Autowired
	private LdapService ldapService;

	@Value("${ldapLogin:false}")
	private boolean ldapLogin;

	@Value("${isSendOtp:true}")
	private boolean isSendOtp;

	@Value("${resend.otp.valid.time}")
	private int otpResendValidationTime;

	@Value("${send.activation.toggle.mail.to.admin:true}")
	private boolean sendActivationToggleMailToAdmin;

	@Value("${dbLoginOnLdapFail:true}")
	private boolean dbLoginOnLdapFail;

	@Value("${defaultAdPass:9+VVfd09XXJGPnRwD69/3w==}")
	private String defaultAdPass;

	@Autowired
	private LoginRepo loginRepo;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private UserListViewRepo listViewRepo;
	@Autowired
	private RoleRepo roleRepo;
	@Autowired
	private RoleService roleService;
	@Autowired
	SharedGenericMapService sharedGenericMapService;

	@Autowired
	private RoleGroupService roleGroupService;

	@Autowired
	SConfigurationService sConfigurationService;

	@Autowired
	LoginService loginService;

	@Autowired
	private MailNotificationService mailNotificationService;

	@Autowired
	private OtpService otpService;
	@Autowired
	private AppPermissionService appPermissionService;

	@Autowired
	private GenericMapRepo gm;
	@Autowired
	private AddressRepo addrRepo;
	@Autowired
	AddressService addressService;
	@Autowired
	UserAppService userAppService;

	@Autowired
	MailService mailService;

	@Autowired
	GenericMapRepo genericMapRepo;

	@Autowired
	GenericMapService genericMapService;
	@Autowired
	SecurityService securityService;

	@Autowired
	private InstitutionExtraInfoService institutionExtraInfoService;

	@Autowired
	SecurityQuestionAnswerService securityQuestionAnswerService;

	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private ActivityLogService activityLogService;

	@Autowired
	private UserLinkService userLinkService;

	@Autowired
	private InstitutionService institutionService;

	@Autowired
	private MailTempleteService mailTempleteService;

	@Autowired
	private PasswordListService passwordListService;

	@Autowired
	private EncryptDecryptHelper encryptDecryptHelper;

	@Autowired
	private RegexRepo regexRepo;

	@Autowired
	UserListViewRepo userListViewRepo;

	@Autowired
	UserAuditRepo userAuditRepo;

	@Autowired
	ViewUserAuditRepo viewUserAuditRepo;

	@PostConstruct
	public void init() {
		log.info("Initializing user service");
		try {
			activationMailBody = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + activationMailBodyPath), Charset.defaultCharset());
			deActivationMailBody = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + deActivationMailBodyPath), Charset.defaultCharset());

			activationMailToAdminBody = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + activationMailToAdminBodyPath), Charset.defaultCharset());

			deActivationMailToAdminBody = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + deActivationMailToAdminBodyPath), Charset.defaultCharset());

			registerMailToUserTemplate = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + registerMailToUserPath), Charset.defaultCharset());
			registerMailToAdminTemplate = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + registerMailToAdminPath), Charset.defaultCharset());

			extUserFirstLoginMailToUserBody = FileUtils.readFileToString(
					ResourceUtils.getFile("classpath:" + extUserFirstLoginMailToUserBodyPath),
					Charset.defaultCharset());

			log.info("appName : [{}]", appName);
			log.info("activationMailBody : [{}]", activationMailBody);
			log.info("activationMailSubject : [{}]", activationMailSubject);
			log.info("deActivationMailBody : [{}]", deActivationMailBody);
			log.info("deActivationMailSubject : [{}]", deActivationMailSubject);
			log.info("extUserFirstLoginMailToUserBody : [{}]", extUserFirstLoginMailToUserBody);

			log.info("activationMailToAdminBody : [{}]", activationMailToAdminBody);
			log.info("deActivationMailToAdminBody : [{}]", deActivationMailToAdminBody);

			log.info("registerMailToUserTemplate : [{}]", registerMailToUserTemplate);
			log.info("registerMailToAdminTemplate : [{}]", registerMailToAdminTemplate);
		} catch (Exception e) {
			log.error("Error initializing user service {}", e);
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {

			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				Page<UserListView> userLIst = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.SELECT_PEND_USER.toString())) {
				Page<UserListView> userLIst = selectPendUser(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				List<User> userLIst = selectAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.SELECT_SINGLE.toString())) {
				List<User> userLIst = selectSingle(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_SELECT_SINGLE_WITH_ROLE.toString())) {
				List<User> userLIst = selectSingleWithRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.SELECT_SINGLE_WITH_ROLE_GROUP.toString())) {
				List<User> userLIst = selectSingleWithRoleGroup(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.REGISTER.toString())) {
				User userLIst = register(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.SELECT_USER_APP.toString())) {
				List<User> userLIst = selectUserApp(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_MANAGE_ROLE.toString())) {
				List<User> userLIst = manageRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_MANAGE_ROLE_GROUP.toString())) {
				List<User> userLIst = manageRoleGroup(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.MANAGE_ROLE_GROUP.toString())) {
				List<User> userLIst = manageRoleGroup(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				List<User> userList = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userList);
			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				msgResponse = ResponseBuilder.buildResponse(header, update(requestMessage));
			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				User user = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.USER_REGECT.toString())) {
				User user = reject(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.USER_CLOSE.toString())) {
				User user = close(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_LOGIN.toString())) {
				List<User> userList = login(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userList);
			} else if (actionType.equals(ActionType.ACTION_VERIFY_LOGIN_2_FA.toString())) {
				List<User> userList = verify2Fa(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userList);
			} else if (actionType.equals(ActionType.ACTION_RESEND_2FA_CODE.toString())) {
				List<User> userList = resend2FaCode(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userList);
			} else if (actionType.equals(ActionType.ACTION_LOGOUT.toString())) {
				User user = logout(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_CHANGE_PASS.toString())) {
				User userList = changePass(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userList);
			} else if (actionType.equals(ActionType.ACTION_FORGOT_PASS.toString())) {
				User user = forgotPass(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.LOGIN_OTP.toString())) {
				User user = loginOtp(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.INTERNAL_USER_UNLOCK_OTP.toString())) {
				User user = internalUserOtp(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_TOGGLE_ACTIVATION.toString())) {
				User user = toggleActivation(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.USER_ACTIVATION.toString())) {
				User user = userActivation(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_TOGGLE_2_FA.toString())) {
				User user = toggle2Fa(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.LOAD_IMAGE.toString())) {
				User img = loadImage(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, img);
			} else if (actionType.equals(ActionType.ACTION_SELECT_USER_ALL_APP.toString())) {
				List<UserApp> user = userApp(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_AUTH_FORGOT_PASS.toString())) {
				// this action use when forgot pass word send and user try to recover password
				// this allow change password via tmp password
				User user = authForgotPass(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.APPROVE_ROLE.toString())) {
				List<User> userLIst = approveRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.APPROVE_DEASSIGN.toString())) {
				List<User> userLIst = approveDeAssign(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.APPROVE_USER.toString())) {
				User user = approvedUser(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.APPROVE.toString())) {
				Page<User> user = approved(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.SUBMIT.toString())) {
				Page<User> user = submit(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_SELECT_1.toString())) {
				User user = select1(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.SELECT_BY_OTP.toString())) {
				User user = selectByOtp(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.REQUEST4LINK.toString())) {
				User user = request4Link(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.CHECK_MASTER_USER.toString())) {
				List<User> user = checkMasterUser(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.LDAP_LOGIN_NAME_CHECK.toString())) {
				User userLIst = ldapLoginNameCheck(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.FIND_LINK.toString())) {
				UserLink userLink = findLink(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLink);
			} else if (actionType.equals(ActionType.SAVE_NEW_PASS.toString())) {
				User user = saveNewPass(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.UNLOCK_INTERNAL_USER.toString())) {
				User user = unlockInternalUser(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.FIRST_ACCEPT.toString())) {
				Login login = firstAccpt(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, login);
			} else if (actionType.equals(ActionType.SECOUND_ACCEPT.toString())) {
				Login login = secoundAccpt(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, login);
			} else if (actionType.equals(ActionType.LOAD_EXTRA.toString())) {
				InstitutionExtraInfo insExra = loadExtra(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, insExra);
			} else if (actionType.equals(ActionType.RESET_PASSWORD.toString())) {
				User insExra = resetPassword(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, insExra);
			} else if (actionType.equals(ActionType.FIND_USER_BY_ROLE.toString())) {
				List<UserListView> insExra = findUserListByRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, insExra);
			} else if (actionType.equals(ActionType.CHECK_PASS.toString())) {
				List<User> insExra = checkPass(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, insExra);
			} else if (actionType.equals(ActionType.SELECT_ALL_ROLE.toString())) {
				List<Role> insExra = getAllRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, insExra);
			} else if (actionType.equals(ActionType.USER_AUDIT_LOG.toString())) {
				List<ViewUserAudit> userLIst = selectUserAuditData(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.LOAD_USER_TYPE_WISE.toString())) {
				List<User> userLIst = loadUserTypeWise(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			}

			else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			try {
				msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

				log.error("Exception Message **** [{}]", ex);
			} catch (Exception e) {
				log.error("Error parsing expception");

				header.setErrorMsg(ex.getLocalizedMessage());
				GenericMessage m = new GenericMessage();
				header.setStatus(Constants.STATUS_ERROR);
				m.setHeader(header);
				return m;
			}

		}

		return msgResponse;
	}

	private List<Role> getAllRole(Message<List<User>> requestMessage, String actionType) {
		User ins = requestMessage.getPayload().get(0);

		return roleRepo.findAllByStatusAndActive(ins.getStatus(), 1);
	}

	private List<User> checkPass(Message<List<User>> requestMessage, String actionType) {
		User usr = userRepo.findByUserIdAndActive(requestMessage.getHeader().getUserId().longValue(), 1);
		if (usr != null && chackPass2Lonig(usr, requestMessage.getPayload().get(0)) != null) {

			mailTempleteService.sendUserMailWithPblAdmin(Str.USER, MailType.PASSWORD_CHANGE_INFO.toString(), usr, true);

		}
		return null;
	}

	private List<UserListView> findUserListByRole(Message<List<User>> requestMessage, String actionType) {
		Role rl = requestMessage.getPayload().get(0).getRoleList().get(0);
		if (rl == null) {
			log.info("role not found for getting the role");
		} else {
			return findUserByRole(rl.getRoleName());
		}
		return null;
	}

	private User resetPassword(Message<List<User>> requestMessage, String actionType) throws Exception {
		User usr = requestMessage.getPayload().get(0);
		String pass = null;
		try {
			if (usr != null) {
				log.info("finding user for loginName: {}", usr.getLoginName());
				User dbUser = userRepo.findByLoginNameAndActive(usr.getLoginName(), 1);
				if (dbUser != null) {
					pass = PasswordGenerator.generatePassword(12);
					String oldPass = dbUser.getPassword();
					dbUser.setPassword(encryptPassword(pass));
					dbUser.setUserModId(requestMessage.getHeader().getUserId().longValue());
					dbUser.setModDate(new Date());
					userRepo.save(dbUser);

					sendingResendPassword(dbUser, pass);

					passwordListService.savePassword(dbUser, oldPass,
							requestMessage.getHeader().getUserId().longValue(), Str.ADMIN_RESET_PASSWORD, null);
//					sending1stLonigMail2User(dbUser, new UserLink(), pass);
				} else {
					log.info("can not find active user information for password reset request. For user LoginName:[{}]",
							usr.getLoginName());
					throw new RuntimeException("Can not find User information.");
				}

			} else {
				log.info("can not find user information for password reset request.");
				throw new RuntimeException("Invalid request");
			}

			return usr;
		} catch (Exception e) {
			log.info("getting error for password reset. ", e.getMessage());
			throw new Exception(e.getMessage());
		}

	}

	private InstitutionExtraInfo loadExtra(Message<List<User>> requestMessage, String actionType) {
		long userId = requestMessage.getHeader().getUserId().longValue();
		User usr = requestMessage.getPayload().get(0);
		if (usr.getInstitutionId() == null) {
			usr = userRepo.findByUserIdAndActive(userId, 1);
		}
		log.info("findins user institution extra information for userId:InstitutionId =>[{}:{}]", userId,
				usr.getInstitutionId());

		return institutionExtraInfoService.findAllByInstitutionId(usr.getInstitutionId());
	}

	private Login firstAccpt(Message<List<User>> requestMessage, String actionType) {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		Claims cl = JwtTokenService.validateToken(request);
		if (cl == null) {
			log.info("can not found login id for accepting first agreement.");
			throw new IllegalAccessError("Envalid request.");
		}
		Long loginId = Long.valueOf(cl.get("loginId").toString());

//		Long loginId = requestMessage.getPayload().get(0).getLoginId();

		if (loginId == null) {
			log.info("can not found login id for accepting first agreement.");
			throw new IllegalAccessError("Envalid request.");
		}
		if (requestMessage.getPayload().get(0).getLoginId() != null
				&& loginId != requestMessage.getPayload().get(0).getLoginId().longValue()) {
			log.info("login id is not match. login id from token:payload is= {}:{}", loginId,
					requestMessage.getPayload().get(0).getLoginId());
			throw new IllegalAccessError("Unauthorized reqest.");
		}
		log.info("finding login information for loginId: {}", loginId);
		Login lg = loginService.findByLoginId(loginId);
		updateLoginUserInfo(lg, new Date(), 1);
		return lg;
	}

	private Login secoundAccpt(Message<List<User>> requestMessage, String actionType) {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		Claims cl = JwtTokenService.validateToken(request);
		if (cl == null) {
			log.info("can not found login id for accepting first agreement.");
			throw new IllegalAccessError("Envalid request.");
		}
		Long loginId = Long.valueOf(cl.get("loginId").toString());
//		Long loginId = 782735l;
		if (loginId == null) {
			log.info("can not found login id for accepting secound agreement.");
			throw new IllegalAccessError("Envalid request.");
		}

		if (requestMessage.getPayload().get(0).getLoginId() != null
				&& loginId != requestMessage.getPayload().get(0).getLoginId().longValue()) {
			log.info("login id is not match. login id from token:payload is= {}:{}", loginId,
					requestMessage.getPayload().get(0).getLoginId());
			throw new IllegalAccessError("Unauthorized reqest.");
		}

		log.info("finding login information for loginId: {}", loginId);
		Login lg = loginService.findByLoginId(loginId);
		updateLoginUserInfo(lg, new Date(), 2);
		return lg;
	}

	private void updateLoginUserInfo(Login lg, Date date, int i) {
		log.info("updating login information for loginId: {}", lg.getLoginId());
		loginService.update(lg, date, i);
	}

	private User saveNewPass(Message<List<User>> requestMessage, String actionType) throws Exception {

		User usr = requestMessage.getPayload().get(0);
		String requestPass = decryptPassword(usr.getPassword());
		User dbUser = null;
		UserLink ul = findUserLinkByLink(usr.getLink());

		if (ul != null) {
			dbUser = checkUseByUserLink(ul);
			checkUsertype(dbUser);
			// now chenk password validation
			boolean isPassValid = checkPassValidation(dbUser.getUserId(), requestPass);

			log.info("pass is : [{}]", isPassValid ? "valid" : "Not valid");

			if (!isPassValid) {
				throw new RuntimeException("You can’t make your last 3 past passwords as a new password.");
			}
			updateUserPassword(dbUser, dbUser.getUserId(), encryptPassword(requestPass));

			passwordListService.savePassword(dbUser, encryptPassword(requestPass), dbUser.getUserId(), Str.FORGET_PASS,
					ul.getOtpId());

			userLinkService.updateUserLink(ul, dbUser.getUserId(), Str.SUCCESSED);

			updateFaildLoginAttempt(dbUser.getLoginName());

			mailTempleteService.sendForgotPassChangeSuccess(dbUser);

		}
		dbUser.setPassword("");
		return dbUser;
	}

	private User selectByOtp(Message<List<User>> requestMessage, String actionType) throws ParseException {

		User usr = requestMessage.getPayload().get(0);
		Otp otp = findOtpByOtp(usr.getOtp(), usr.getUserId(), Str.FORGET_PASS);
		if (otp != null) {
			usr = checkUseByOtp(otp);
			UserLink ul = userLinkService.save(usr, Str.FORGET_PASS, otp.getOtpId());
			usr.setLink(ul.getLink());
			usr.setPassword("");
			return usr;
		} else {
			log.info("User information not found for the link: {}", usr.getOtp());
			throw new RuntimeException("Wrong OTP.");
		}
	}

	private User unlockInternalUser(Message<List<User>> requestMessage, String actionType) throws ParseException {

		User usr = requestMessage.getPayload().get(0);
		Otp otp = findOtpByOtp(usr.getOtp(), usr.getUserId(), Str.USER_UNLOCK);
		if (otp != null) {
			usr = checkUseByOtp(otp);
			usr.setUserBlockCause("");
			usr.setAllowLogin(1);
			usr = userRepo.save(usr);

			// save audit data
			saveAuditData(usr);

			updateFaildLoginAttempt(usr.getLoginName());
			return usr;
		} else {
			log.info("User information not found for the link: {}", usr.getOtp());
			throw new RuntimeException("Wrong OTP.");
		}
	}

	private User select1(Message<List<User>> requestMessage, String actionType) throws ParseException {
		User usr = requestMessage.getPayload().get(0);
		UserLink ul = findUserLinkByLink(usr.getLink());

		if (ul != null) {
			return checkUseByUserLink(ul);

		} else {
			log.info("User information not found for the link: {}", usr.getLink());
			throw new RuntimeException("Invalid Request.");
		}

	}

	private UserLink findLink(Message<List<User>> requestMessage, String actionType) {

		long userId = requestMessage.getPayload().get(0).getUserId();
		log.info("try to find first login link for user id:[{}]", userId);
		return userLinkService.findUserLinkByUserId(userId);
	}

	private List<User> checkMasterUser(Message<List<User>> requestMessage, String actionType) {
		User user = requestMessage.getPayload().get(0);

		return userRepo.findAllByInstitutionIdAndIsMasterUserAndActive(user.getInstitutionId(), 1, 1);
	}

	private Page<User> approved(Message<List<User>> requestMessage, String actionType) throws InvalidInputException {
		User usr = requestMessage.getPayload().get(0);
		User dbUser = null;

		Pageable pageable = PageRequest.of(usr.getPageNumber() - 1, usr.getPageSize(), Sort.by("userId").descending());

		log.info("comes for approve user. userId:{}", usr.getUserId());

		dbUser = approveUser(usr, dbUser, requestMessage.getHeader().getUserId().longValue());

		return userRepo.findAllByActive(1, pageable);
	}

	private Page<User> submit(Message<List<User>> requestMessage, String actionType) throws InvalidInputException {
		User usr = requestMessage.getPayload().get(0);
		User dbUser = null;

		Pageable pageable = PageRequest.of(usr.getPageNumber() - 1, usr.getPageSize(), Sort.by("userId").descending());

		log.info("comes for approve user. userId:{}", usr.getUserId());
		if (usr.getUserId() != null) {
//			dbUser = userRepo.findByUserIdAndFirstLoginAndUserStatusAndActive(usr.getUserId(), 1, Str.PEND_APPROVE, 1);
			dbUser = userRepo.findByUserIdAndActive(usr.getUserId(), 1);

			if (dbUser != null) {
				dbUser.setUserStatus(Str.PEND_ACTIVE);
				dbUser.setFirstLogin(0);
//				dbUser.setModDate(new Date());
//				dbUser.setUserModId(Long.valueOf(requestMessage.getHeader().getUserId()));
				dbUser.setApproveById(Long.valueOf(requestMessage.getHeader().getUserId()));
				dbUser.setApproveTime(new Date());
//				String pass = null;
//				if (dbUser.getUserType().equals(Str.EXTERNAL_USER)) {
//					dbUser.setFirstLogin(1);
//					pass = PasswordGenerator.generatePassword(12);
//					log.info("generating default password: {}", pass);
//					dbUser.setPassword(encryptPassword(pass));
//				}
//				dbUser.setAllowLogin(1);
				userRepo.save(dbUser);

				// save audit data
				saveAuditData(dbUser);

//				if (pass != null && dbUser.getFirstLogin() == 1 && dbUser.getUserType().equals(Str.EXTERNAL_USER)) {
//					UserLink ul = userLinkService.findUserLinkByUserId(dbUser.getUserId());
//					sendingMail2User(dbUser, ul, pass);
//				} else if (dbUser.getUserType().equals(Str.INTERNAL_USER)) {
//					activeUser(dbUser, AppUtils.userModId(requestMessage));
//				}

			} else {

				log.info("can not find database user.For userId:{}", usr.getUserId());
				throw new InvalidInputException("User not found");
			}
		}
		return userRepo.findAllByActive(1, pageable);
	}

	private User request4Link(Message<List<User>> requestMessage, String actionType)
			throws InvalidInputException, ParseException {
		User usr = requestMessage.getPayload().get(0);
		UserLink ul = null;
		if (usr.getLink() != null) {

			ul = userLinkService.findUserLinkByLink(usr.getLink());
			log.info("s");
			if (ul == null) {
				log.info("Can not find information for link:[{}]", usr.getLink());
				throw new InvalidInputException("Invalid link");
			}
//			delete exit link
			updateLink(ul, ul.getUserId(), Str.FAILED);

			Long userId = ul.getUserId();
			usr = userRepo.findByUserIdAndActive(userId, 1);
//			create new user link
			UserLink newUl = userLinkService.save(usr, Str.MAKE_NEW_USER, null);

			if (usr == null) {
				log.info("Can not find user information for id:[{}]", userId);
				throw new NullPointerException("Can not find User.");
			}
//			update one time password
			String pass = PasswordGenerator.generatePassword(12);
			updateUserPassword(usr, userId, encryptPassword(pass));

			sendingMail2User(usr, newUl, pass);
//			userLinkService.updateUserLink(ul);
		}
		return usr;
	}

	private void updateUserPassword(User usr, long userId, String encriptPass) {
		usr.setPassword(encriptPass);
		usr.setModDate(new Date());
		usr.setUserModId(userId);
		if (!StringUtils.isBlank(usr.getUserBlockCause()) && !usr.getUserBlockCause().equals(Str.ADMIN_BLOCK_USER)) {
			usr.setAllowLogin(1);
			usr.setUserBlockCause("");
		}

		userRepo.save(usr);
	}

	private void updateLink(UserLink ul, long userId, String status) {
		ul.setActive(0);
		ul.setModDate(new Date());
		ul.setUserModId(userId);
		userLinkService.updateUserLink(ul, userId, status);

	}

	private User checkUseByOtp(Otp otp) {
		boolean isValid = checkOtpValidation(otp.getExpireDate());
		User usr = null;
//		boolean isValid = true;

		if (otp.getUserId() != null && isValid) {
			otpService.deleteOtpByList(Arrays.asList(otp), otp.getUserId(), Str.SUCCESSED);
			usr = userRepo.findById(otp.getUserId()).get();

//			userLinkService.updateUserLink(ul);
			usr.setInstitutionName(institutionService.getInstitutionName(usr.getInstitutionId()));
//			usr.setPassword("");
			return usr;
		} else {
			log.info("OTP is expired. date:{}", otp.getExpireDate());
			otpService.deleteOtpByList(Arrays.asList(otp), otp.getUserId(), Str.FAILED);
//			userLinkService.updateUserLink(ul);
			throw new RuntimeException("OTP time is expired.");
		}
	}

	private User checkUseByUserLink(UserLink ul) throws ParseException {
		boolean isValid = checkTimeValidation(ul);
		User usr = null;
//		boolean isValid = true;

		if (ul.getUserId() != null && isValid) {
			usr = userRepo.findById(ul.getUserId()).get();

//			userLinkService.updateUserLink(ul);
			usr.setInstitutionName(institutionService.getInstitutionName(usr.getInstitutionId()));
			usr.setPassword("");
			return usr;
		} else {
			log.info("linke is expired. date:{}", ul.getExpireDate());
//			userLinkService.updateUserLink(ul);
			throw new RuntimeException("Password time is expired.");
		}
	}

	private Otp findOtpByOtp(String otp, Long userId, String otpType) {

		if (!StringUtils.isBlank(otp)) {
			return otpService.findOtp(otp, userId, otpType);
		}
		return null;
	}

	private UserLink findUserLinkByLink(String link) {

		if (!StringUtils.isBlank(link)) {
			return userLinkService.findUserLink(link);
		}
		return null;
	}

	private boolean checkOtpValidation(Date otpExpireDate) {
		log.info("Current time : Link time = [{},{}]", new Date(), otpExpireDate);

		return otpExpireDate.after(new Date());
	}

	private boolean checkTimeValidation(UserLink ul) throws ParseException {
		log.info("Current time : Link time = [{},{}]", new Date(), ul.getExpireDate());

		return ul.getExpireDate().after(new Date());
	}

	private User approvedUser(Message<List<User>> message, String actionType) {
		User user = message.getPayload().get(0);
		user = userRepo.findByUserIdAndActive(user.getUserId(), 1);
		user.setUserStatus(Str.ACTIVE);
		user.setAllowLogin(1);
		user.setUserBlockCause("");
		return userRepo.save(user);

	}

	private List<User> manageRoleGroup(Message<List<User>> message, String actionType) throws Exception {
		User user = message.getPayload().get(0);

		List<RoleGroup> roleGroupList = user.getRoleGroupList();
		List<RoleGroup> unassignRoleGroupList = user.getUnassignRoleGroupList();

		sharedGenericMapService.unmapAllByFrom(user.getUserId(), USER, ROLE_GROUP,
				Long.valueOf(message.getHeader().getUserId()));

		for (RoleGroup roleGroup : roleGroupList) {
			// check this role already assign or not.
			// if assign just skip
			// or insert
			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeName(user.getUserId(), USER,
					roleGroup.getRoleGroupId(), ROLE_GROUP);
			if (map == null) {
				map = new GenericMap();
				map.setFromId(user.getUserId());
				map.setToId(roleGroup.getRoleGroupId());
				map.setFromTypeName(USER);
				map.setToTypeName(ROLE_GROUP);
				map.setActive(1);
				map.setGenericMapVer(0);
				gm.save(map);
			} else if (map.getActive() == 0) {
				map.setGenericMapVer(map.getGenericMapVer() + 1);
				map.setActive(1);
				gm.save(map);
			}
		}

		return selectSingleWithRoleGroup(message, ActionType.SELECT_SINGLE.toString());

	}

	private List<UserApp> userApp(Message requestMessage, String actionType) {
		return userAppService.all();
	}

	public void assignApp(List<UserApp> appList, User user) {
		if (appList == null || appList.size() == 0) {
			return;
		}
		appList.stream().forEach(i -> {
			assignApp(i, user);
		});
	}

	public void assignApp(UserApp app, User user) {
		GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeName(user.getUserId(), USER, app.getUserAppId(),
				USER_APP);
		if (map == null) {
			map = new GenericMap();
			map.setFromId(user.getUserId());
			map.setToId(app.getUserAppId());
			map.setFromTypeName(USER);
			map.setToTypeName(USER_APP);
			map.setActive(1);
			map.setGenericMapVer(0);
			gm.save(map);
		} else if (map.getActive() == 0) {
			map.setGenericMapVer(map.getGenericMapVer() + 1);
			map.setActive(1);
			gm.save(map);
		}
	}

	private List<User> resend2FaCode(Message requestMessage, String actionType) {
		return null;
	}

	private List<User> verify2Fa(Message<List<User>> message, String actionType) throws Exception {
		User user = null;
		List<User> userList = null;
		user = message.getPayload().get(0);
		User verifyUser = userRepo.findByLoginNameAndPasswordAndVerificationCodeAndActive(user.getLoginName(),
				user.getPassword(), user.getVerificationCode(), 1);
		if (null == verifyUser) {
			throw new Exception("Invalid verification code.");
		} else {
			user = verifyUser;
		}
		user.setRoleList(roleService.selectUserRole(user));
		updateLogin(message, user, 1, user.getLoginName());
		userList = new ArrayList<>();
		userList.add(user);
		return userList;
	}

	private User toggle2Fa(Message<List<User>> message, String actionType) throws Exception {
		User user = message.getPayload().get(0);
		if (StringUtils.isEmpty(user.getEmail()) && user.getTwoFactorAuth() == 1) {
			throw new Exception("You can not set 2FA. Emal not configured with this account.");
		}
		userRepo.toggle2Fa(user.getTwoFactorAuth(), user.getUserId(), AppUtils.userModId(message), new Date());
		return user;
	}

	private User delete(Message<List<User>> message, String actionType) throws Exception {
		User user = message.getPayload().get(0);
		User dbUser = userRepo.findById(user.getUserId()).get();

		if (dbUser.getAllowLogin() == null) {

			user.setModDate(new Date());
			user.setUserModId(Long.valueOf(message.getHeader().getUserId()));
			user.setActive(0);
			user = userRepo.save(user);
			// save audit data
			saveAuditData(user);
			return user;

		} else {

			if (dbUser.getAllowLogin().intValue() == 1) {
				throw new Exception("Approved User Can't Delete");
			}
			if (dbUser.getAllowLogin().intValue() == 0) {
				throw new Exception("Approved User Can't Delete");
			}

		}
		return user;

	}

	private User reject(Message<List<User>> message, String actionType) {
		User user = message.getPayload().get(0);
		User dbUser = userRepo.findById(user.getUserId()).get();

		String modUserEmail = getUserMail(dbUser.getUserModId());

		dbUser.setRejectCause(user.getRejectCause());
		dbUser.setUserStatus(user.getUserStatus());

		userRepo.save(dbUser);

		sendingMail2Maker(dbUser, modUserEmail);
		return dbUser;

	}

	private User close(Message<List<User>> message, String actionType) {
		User user = message.getPayload().get(0);
		User dbUser = userRepo.findById(user.getUserId()).get();
		dbUser.setUserModId(message.getHeader().getUserId().longValue());

		dbUser.setUserStatus(user.getUserStatus());

		userRepo.save(dbUser);

		return dbUser;

	}

	private void sendingMail2Maker(User dbUser, String makerEmail) {

		try {
			Thread th = new Thread(() -> {
				mailTempleteService.sendRejectMail(dbUser, makerEmail);
//				mailTempleteService.sendUserMailWithPblAdmin(modUserEmail, modUserEmail, dbUser, dbLoginOnLdapFail);
//					(Str.PA, dbUser, MailType.PA_REJECT);
			});
			th.start();
		} catch (Exception e) {
			log.info("getting error to sending mail of [{}, {}]", makerEmail, e.getMessage());
		}

	}

	private User update(Message<List<User>> message) throws Exception {
		User user = message.getPayload().get(0);
		User dbUser = userRepo.findById(user.getUserId()).get();

		if (!StringUtils.isBlank(user.getPhoneNumber())) {
			User checkUser = userRepo.findByPhoneNumberAndActive(user.getPhoneNumber(), 1);
			if (checkUser != null && dbUser.getUserId().longValue() != checkUser.getUserId().longValue()) {
				throw new Exception("Duplicate mobile number not allowed.");
			}
		}

		User checkUser = userRepo.findByEmailAndActive(user.getEmail(), 1);
		if (checkUser != null && dbUser.getUserId().longValue() != checkUser.getUserId().longValue()) {
			throw new Exception("Duplicate email not allowed.");
		}
		dbUser.setUserModId(message.getHeader().getUserId().longValue());
		dbUser.setFirstName(user.getFirstName());
		dbUser.setLastName(user.getLastName());
		dbUser.setFullName(user.getFullName());
		dbUser.setLoginName(user.getLoginName());
		dbUser.setEmail(user.getEmail());
		dbUser.setPhoneNumber(user.getPhoneNumber());
		dbUser.setBranchId(user.getBranchId());
		dbUser.setLogingMethod(user.getLogingMethod());
		dbUser.setNid(user.getNid());
		dbUser.setDesignation(user.getDesignation());
		dbUser.setRemarks(user.getRemarks());
		dbUser.setDepartmentId(user.getDepartmentId());
		dbUser.setDob(user.getDob());
		dbUser.setRejectCause("");
		dbUser.setOldAllowLogin(dbUser.getAllowLogin());
//		dbUser.setUserStatus(Str.MODIFIED);
		if (user.getUserStatus() == null || user.getUserStatus().equals("PEND_APPROVE")) {
			dbUser.setUserStatus(Str.MODIFIED);
		} else if (user.getUserStatus().equals("ACTIVE") || user.getUserStatus().equals(Str.PEND_ACTIVE)) {
			dbUser.setAllowLogin(0);
			dbUser.setUserStatus(Str.PEND_ACTIVE);
		} else if (user.getUserStatus().equals("INACTIVE") || user.getUserStatus().equals(Str.PEND_INACTIVE)) {
			dbUser.setAllowLogin(1);
			dbUser.setUserStatus(Str.PEND_INACTIVE);
		} else {
			dbUser.setUserStatus(user.getUserStatus());
		}

		dbUser.setExtBranchName(user.getExtBranchName());

//		dbUser.setAllowLogin(0);
//		if ("INACTIVE".equals(user.getUserStatus())) {
////		    dbUser.setAllowLogin(1);
//		} else if ("PEND_INACTIVE".equals(user.getUserStatus())) {
////		    dbUser.setAllowLogin(1);
//		} else {
//			dbUser.setAllowLogin(0);
//		}

//		sharedGenericMapService.unMapAndMap(user.getUserId(), user.getDepartmentIdList(), USER, USER_DEPARTMENT,
//				message.getHeader().getUserId().longValue());

		dbUser = userRepo.save(dbUser);
		// save audit data
		saveAuditData(dbUser);
		saveNewUserRole(user.getRoleList(), user, message.getHeader().getUserId().longValue());

		return dbUser;
	}

	private User toggleActivation(Message<List<User>> message, String actionType) {

		User user = message.getPayload().get(0);

		User dbUser = userRepo.findById(user.getUserId()).get();

		// check roal
		if (!StringUtils.isBlank(user.getCommonActivity()) && user.getCommonActivity().equals(Str.ACTIVE)) {
			List<GenericMap> list = genericMapRepo.findByFromIdAndActive(user.getUserId(), 1);
			if (list.size() == 0) {
				user.setCommonActivity(Str.ROLE_NOT_FOUND);
				return user;
			}
		}

		return activeUser(dbUser, AppUtils.userModId(message));

	}

	private User userActivation(Message<List<User>> message, String actionType) throws InvalidInputException {

		User user = message.getPayload().get(0);

		User dbUser = userRepo.findById(user.getUserId()).get();

		if (StringUtils.equals(user.getUserStatus(), Str.ACTIVE)
				&& StringUtils.equals(dbUser.getUserType(), Str.EXTERNAL_USER) && dbUser.getFirstLogin() == 1) {
			return approveUser(user, dbUser, message.getHeader().getUserId().longValue());
		}

		// check roal
		if (!StringUtils.isBlank(user.getCommonActivity()) && user.getCommonActivity().equals(Str.ACTIVE)) {
			List<GenericMap> list = genericMapRepo.findByFromIdAndActive(user.getUserId(), 1);
			if (list.size() == 0) {
				user.setCommonActivity(Str.ROLE_NOT_FOUND);
				return user;
			}
		}

		if (!StringUtils.isBlank(user.getUserStatus()) && user.getUserStatus().equals(Str.PEND_INACTIVE)) {
			dbUser.setOldAllowLogin(dbUser.getAllowLogin());
			dbUser = activeInactiveUserMaker(dbUser, message, Str.PEND_INACTIVE, ActivityType.USER_INACITVE_MAKE);
		} else if (!StringUtils.isBlank(user.getUserStatus()) && user.getUserStatus().equals(Str.PEND_ACTIVE)) {
			dbUser.setOldAllowLogin(dbUser.getAllowLogin());
			dbUser = activeInactiveUserMaker(dbUser, message, Str.PEND_ACTIVE, ActivityType.USER_ACITVE_MAKE);
		} else if (!StringUtils.isBlank(user.getUserStatus()) && user.getUserStatus().equals(Str.ACTIVE)) {
			dbUser = activeInactiveUserChecker(dbUser, message, Str.ACTIVE, ActivityType.USER_INACITVE_CHECKE, 1);
		} else if (!StringUtils.isBlank(user.getUserStatus()) && user.getUserStatus().equals(Str.INACTIVE)) {
			dbUser = activeInactiveUserChecker(dbUser, message, Str.INACTIVE, ActivityType.USER_INACITVE_CHECKE, 0);
		}
//		else if(!StringUtils.isBlank(user.getUserStatus()) && user.getUserStatus().equals(Str.ACTIVE)) {
//			if(dbUser.getUserStatus().equals(Str.PEND_INACTIVE)) {
//				dbUser = activeInactiveUserChecker(dbUser, message, Str.INACTIVE, ActivityType.USER_INACITVE_CHECKE, 0);
//			}
//			else if(dbUser.getUserStatus().equals(Str.PEND_ACTIVE)) {
//				dbUser = activeInactiveUserChecker(dbUser, message, Str.ACTIVE, ActivityType.USER_ACITVE_CHECK, 1);
//			}
//		}
		return dbUser;

	}

	private User approveUser(User usr, User dbUser, long usrId) throws InvalidInputException {
		if (usr.getUserId() != null) {
//			dbUser = userRepo.findByUserIdAndFirstLoginAndUserStatusAndActive(usr.getUserId(), 1, Str.PEND_APPROVE, 1);
			dbUser = userRepo.findByUserIdAndActive(usr.getUserId(), 1);

			if (dbUser != null) {
				dbUser.setUserStatus(Str.ACTIVE);
//				dbUser.setFirstLogin(0);
//				dbUser.setModDate(new Date());
//				dbUser.setUserModId(Long.valueOf(requestMessage.getHeader().getUserId()));
				dbUser.setApproveById(usrId);
				dbUser.setApproveTime(new Date());
				String pass = null;
				if (dbUser.getUserType().equals(Str.EXTERNAL_USER)) {
					dbUser.setFirstLogin(1);
					pass = PasswordGenerator.generatePassword(12);
					log.info("generating default password: {}", pass);
					dbUser.setPassword(encryptPassword(pass));
				}
				dbUser.setAllowLogin(1);
				dbUser.setUserBlockCause("");
				userRepo.saveAndFlush(dbUser);
				// audit data save
				saveAuditData(dbUser);

				if (pass != null && dbUser.getFirstLogin() == 1 && dbUser.getUserType().equals(Str.EXTERNAL_USER)) {
					UserLink ul = userLinkService.findUserLinkByUserId(dbUser.getUserId());
					sending1stLonigMail2User(dbUser, ul, pass);

				} else if (dbUser.getUserType().equals(Str.INTERNAL_USER)) {

					sendingInternalUserCreationMail(dbUser, usrId);
//					activeUser(dbUser, AppUtils.userModId(requestMessage));
				}

			} else {

				log.info("can not find database user.For userId:{}", usr.getUserId());
				throw new InvalidInputException("User not found");
			}
		}
		return dbUser;
	}

	private User activeInactiveUserMaker(User dbUser, Message<List<User>> message, String status,
			ActivityType activityType) {
		Long userModId = AppUtils.userModId(message);

//		dbUser.setAllowLogin(dbUser.getAllowLogin() == null || dbUser.getAllowLogin().intValue() == 0 ? 1 : 0);
		dbUser = updateUser(dbUser, userModId, status);

		// save audit data
		saveAuditData(dbUser);

		activityLogService.save(userModId, dbUser.getUserId(), activityType,
				message.getHeader().getSenderSourceIPAddress(), message.getHeader().getSenderGatewayIPAddress());

		// send mail to who have user authorization permission AND role USER_ADMIN
//		try {
//			sendMail4UserInactive(dbUser.getEmail(), true);
//		} catch (Exception e) {
//			log.info("getting error: {}", e.getMessage());
//		}

		return dbUser;
	}

	private User activeInactiveUserChecker(User dbUser, Message<List<User>> message, String status,
			ActivityType activityType, int allowLogin) {
		Long userModId = AppUtils.userModId(message);
		if (allowLogin == 0) {
			dbUser.setInactiveDate(new Date());
			dbUser.setUserBlockCause(Str.ADMIN_BLOCK_USER);
			dbUser.setApproveTime(null);
		} else if (allowLogin == 1) {
			updateFaildLoginAttempt(dbUser.getLoginName());
			dbUser.setInactiveDate(null);
			dbUser.setUserBlockCause("");
			dbUser.setApproveTime(new Date());
		}
		dbUser.setAllowLogin(allowLogin);
		dbUser = updateUser(dbUser, userModId, status);
		// save audit data
		saveAuditData(dbUser);

		activityLogService.save(userModId, dbUser.getUserId(), activityType,
				message.getHeader().getSenderSourceIPAddress(), message.getHeader().getSenderGatewayIPAddress());

		// send mail to who have user authorization permission AND role USER_ADMIN
		try {
			if (dbUser.getOldAllowLogin() != null && dbUser.getOldAllowLogin() == dbUser.getAllowLogin()) {
				return dbUser;
			}
			MailType mailType = findMailType(allowLogin, dbUser.getUserType());

			MailTemplete mt = mailTempleteService.findActiveInactiveMailTemp(mailType);
			if (mt != null) {
				String email = dbUser.getEmail();
				String emails = findAllAdminUsersEmail();
//				if (emails != null && emails.length() > 0) {
//					email = email + "," + emails;
//				}
				MailTemplete m = mailTempleteService.buildUserSubjectAndBody(mt, null, dbUser, null);
//				sendMail4UserInactive(email, false, m, mailType);

				mailNotificationService.sendUserNotification(m, email, null, emails, mailType);
//				mailNotificationService.sendUserNotification(m, emails, mailType);

			} else {
				log.info("active or inactive mail not found");
			}

		} catch (Exception e) {
			log.info("getting error: {}", e.getMessage());
		}

		return dbUser;
	}

	public String findAllAdminUsersEmail() {
		return findAllPblAdminUsers().stream().map(UserListView::getEmail).collect(Collectors.joining(","));
	}

	private MailType findMailType(int allowLogin, String userType) {

		if (StringUtils.isBlank(userType)) {
			log.info("user type is null");
			throw new RuntimeException("User type is null.");
		}

		if (allowLogin == 0) {
			if (userType.equals(Str.INTERNAL_USER)) {
				return MailType.INTERNAL_INACTIVATION_CHECK;
			} else {
				return MailType.EXTERNAL_INACTIVATION_CHECK;
			}
		} else {
			if (userType.equals(Str.INTERNAL_USER)) {
				return MailType.INTERNAL_ACTIVATION_CHECK;
			} else {
				return MailType.EXTERNAL_ACTIVATION_CHECK;
			}
		}
	}

	private User updateUser(User dbUser, Long userModId, String status) {
		dbUser.setModDate(new Date());
		dbUser.setUserModId(userModId);
		dbUser.setUserStatus(status);
		dbUser.setUserVer(dbUser.getUserVer().intValue() + 1);
//		dbUser.setUserBlockCause("");
//		dbUser.setOldAllowLogin(dbUser.getAllowLogin());
		return userRepo.save(dbUser);

	}

	public List<UserListView> findUserByRole(String roleName) {

		return listViewRepo.findUserByRoleNameAndStatus(roleName, Str.APPROVED);
	}

	public List<UserListView> findAllPblAdminUsers() {

		return findUserByRole(RoleStr.PBL_ADMIN_USER);
	}

	private void sendMail4UserInactive(String userEmail, boolean isApproveUser, MailTemplete mt, MailType mailType) {
		AtomicReference<String> finalUserEmail = new AtomicReference<>(userEmail);
//		List<User> userAdminUserList = userRepo.findUserByRoleNameAndStatus(RoleStr.USER_ADMIN, Str.APPROVED);

//		Runnable mail = () -> {
		try {

			if (isApproveUser) {
//				List<User> approveUserList = userRepo.findByPermissionNameAndToTypeNameAndStatus(
//						PermissionStr.USER_APPROVER, AppConstants.STR_ROLE, Str.APPROVED);
//
//				if (approveUserList.size() == 0) {
//					log.info("Can not find user for permission: {}", PermissionStr.USER_APPROVER);
//				} else {
//					finalUserEmail.updateAndGet(email -> email + "," + buildUserEmails(approveUserList));
//				}

			}
			mailNotificationService.sendUserNotification(mt, finalUserEmail.get(), null, null, mailType);

		} catch (Exception e) {
			log.info("getting error to sending inactive user mail. error:{}", e.getMessage());
		}
//		};
//		mail.start();

	}

	private String buildUserEmails(List<User> approveUserList) {
		String appUsrEmail = approveUserList.stream().map(User::getEmail).collect(Collectors.joining(","));
		log.info("getting email emails: {}", appUsrEmail);
		return appUsrEmail;
	}

	private User sendingInternalUserCreationMail(User dbUser, Long userModId) {

		int currentState = dbUser.getAllowLogin();

		// send activation mail
		log.info("Sending activation mail");
		String email = dbUser.getEmail();
		if (email != null) {
			try {
				MailType mailType = findMailType(currentState, dbUser.getUserType());

				MailTemplete mt = mailTempleteService.findActiveInactiveMailTemp(mailType);
				if (mt != null) {
					String emails = findAllAdminUsersEmail();
//					if (emails != null && emails.length() > 0) {
//						email = email + "," + emails;
//					}
					MailTemplete m = mailTempleteService.buildUserSubjectAndBody(mt, null, dbUser, null);
//						sendMail4UserInactive(email, false, m, mailType);

					mailNotificationService.sendUserNotification(m, email, null, emails, mailType);
//					mailNotificationService.sendUserNotification(m, emails, mailType);

				} else {
					log.info("active or inactive mail not found");
				}
			} catch (Exception e) {
				log.error("Error sending activation mail {}", e);
			}
		}
		return dbUser;
	}

	private User activeUser(User dbUser, Long userModId) {

		dbUser.setAllowLogin(dbUser.getAllowLogin() == null || dbUser.getAllowLogin().intValue() == 0 ? 1 : 0);
		dbUser.setModDate(new Date());
		dbUser.setUserModId(userModId);
		dbUser.setUserVer(dbUser.getUserVer().intValue() + 1);
		userRepo.save(dbUser);

		// userRepo.toggleActivation(user.getAllowLogin(), user.getUserId(),
		// AppUtils.userModId(message), new Date());

		dbUser = userRepo.findById(dbUser.getUserId()).get();

		int currentState = dbUser.getAllowLogin();

		if (currentState == 1 && sendActivationMail) {
			// send activation mail
			log.info("Sending activation mail");
			String email = getUserMail(dbUser.getUserId());
			if (email != null) {
				try {

					sendActivationToggleMail(activationMailSubject, mailReplace(dbUser, activationMailBody), email);
					if (sendActivationToggleMailToAdmin) {
						log.info("Sending activation mail to admin");
						sendActivationToggleMail(activationMailSubject, mailReplace(dbUser, activationMailToAdminBody),
								userRegistrationAdminMail);
					}
				} catch (Exception e) {
					log.error("Error sending activation mail {}", e);
				}
			}
		} else if (currentState == 0 && sendDeactivationMail) {
			// send de activation mail
			log.info("Sending deactivation mail");
			String email = getUserMail(dbUser.getUserId());
			if (email != null) {
				try {
					sendActivationToggleMail(deActivationMailSubject, mailReplace(dbUser, deActivationMailBody), email);
					if (sendActivationToggleMailToAdmin) {
						log.info("Sending deactivation mail to admin");
						sendActivationToggleMail(deActivationMailSubject,
								mailReplace(dbUser, deActivationMailToAdminBody), userRegistrationAdminMail);
					}
				} catch (Exception e) {
					log.error("Error sending deactivation mail {}", e);
				}
			}
		}
		return dbUser;
	}

	private void sendActivationToggleMail(String subject, String body, String email) {
		log.info("Sending Activation/Deactivation toggle mail to [{}]", email);
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

	public String getUserMail(Long userId) {
		User dbUser = userRepo.findByUserIdAndActive(userId, 1);
		if (!StringUtils.isBlank(dbUser.getEmail())) {
			return dbUser.getEmail();
		} else {
			log.info("User mail not found for userId [{}]", userId);
			return null;
		}
	}

	public User findUserById(Long id) {
		return userRepo.findByUserIdAndActive(id, 1);
	}

	private void saveNewUserRole(List<Role> roleList, User user, Long makerUserId) {
		if (roleList == null) {
			return;
		}
		List<Long> toIdList = roleList.stream().map(Role::getRoleId).collect(Collectors.toList());
		sharedGenericMapService.unMapAndMap(user.getUserId(), toIdList, USER, ROLE, makerUserId, Str.APPROVED);
	}

	private List<User> manageRole(Message<List<User>> message, String actionType) throws Exception {

		// user roleList if any assign == false. need unassign
		// user unassignRollList if any assign true need to insert

		User user = message.getPayload().get(0);

		List<Role> roleList = user.getRoleList();
		List<Role> unassignRoleList = user.getUnassignRoleList();
		for (Role role : roleList) {
			// check this role already assign or not.
			// if assign just skip
			// or insert
			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeName(user.getUserId(), USER,
					role.getRoleId(), ROLE);
			if (map == null) {
				map = new GenericMap();
				map.setFromId(user.getUserId());
				map.setToId(role.getRoleId());
				map.setFromTypeName(USER);
				map.setToTypeName(ROLE);
				map.setActive(1);
				map.setGenericMapVer(0);
				map.setModDate(new Date());
				map.setUserModId(Long.valueOf(message.getHeader().getUserId()));
				map.setStatus(Str.PEND_ASSIGN);

				gm.save(map);
			} else if (map.getActive() == 0) {
				map.setGenericMapVer(map.getGenericMapVer() + 1);
				map.setActive(1);
				map.setModDate(new Date());
				map.setUserModId(Long.valueOf(message.getHeader().getUserId()));
				map.setStatus(Str.PEND_ASSIGN);

				gm.save(map);
			}
		}

		for (Role role : unassignRoleList) {
			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(user.getUserId(), USER,
					role.getRoleId(), ROLE, 1);

			if (null == map) {
				continue;
			}
			map.setGenericMapVer(map.getGenericMapVer() + 1);
			map.setModDate(new Date());
			map.setUserModId(Long.valueOf(message.getHeader().getUserId()));
			map.setActive(1);
			map.setStatus(Str.PEND_DEASSINED);
			gm.save(map);
		}

		return selectSingleWithRole(message, ActionType.SELECT_SINGLE.toString());
	}

	private User forgotPass(Message<List<User>> message, String actionType) throws Exception {
		User user = message.getPayload().get(0);
//		Long creatorId = Long.valueOf(message.getHeader().getUserId());
		// check external user or not
		String loginName = user.getLoginName();

		if (StringUtils.isBlank(loginName)) {
			log.info("Can not find login name.");
			throw new RuntimeException("Can not find userId.");
		}
		log.info("Finding user for loginName is: {}", loginName);

//		User testUser = userRepo.findByLoginNameAndFirstLoginAndActiveAndUserBlockCauseNotIn(loginName, 0, 1, Arrays.asList(Str.OVER_LOGIN_ATTEMPT));
		User testUser = userRepo.findByLoginNameAndFirstLogin(loginName, 0);

		if (testUser == null) {
			log.info("Can not find active user for login name.");
			throw new RuntimeException("We can not find user for User ID: " + loginName);
		}

		if (testUser.getUserType().equals(Str.INTERNAL_USER)) {
			log.info("request comes from internal user. userId={}", testUser.getUserId());
			throw new RuntimeException("You can not take this action. Please contact the Admin team.");
		}

		checkUsertype(testUser);

		if (!StringUtils.isBlank(testUser.getUserBlockCause())
				&& testUser.getUserBlockCause().equals(Str.ADMIN_BLOCK_USER)) {
			log.info("User is bolcked By Admin. userId={}", testUser.getUserId());
			throw new RuntimeException("Sorry you can not change your password. Please communicate with the admin.");
		}

		List<SecurityQuestionAnswer> questionAnswerList = user.getQuestionAnswer();

		boolean isPassed = checkQuestionAndAnswer(questionAnswerList, testUser.getUserId());
		if (isPassed) {

			log.info("Finding user for loginName is: {}", loginName);

			List<Otp> otpList = otpService.findOtpByUserIdAndOtpType(testUser.getUserId(), Str.FORGET_PASS);

			if (otpList.size() > 0) {
				checkOtpValidationtime(otpList);
				otpService.deleteOtpByList(otpList, testUser.getUserId(), Str.FAILED);
			}

//			Otp otp = otpService.saveNew(testUser, Str.LOGIN_OTP);
//			
//			
//			List<Otp> otpList = otpService.findOtpByUserIdAndOtpType(testUser.getUserId(), Str.FORGET_PASS);
//kafdlj
//			if (otpList.size() > 0) {
//				otpService.deleteOtpByList(otpList, testUser.getUserId(), Str.FAILED);
//			}

			Otp otp = otpService.saveNew(testUser, Str.FORGET_PASS);

			if (otp != null) {
				Runnable task = () -> {
					try {
						mailTempleteService.sendForgotPassMail(otp, testUser);
					} catch (Exception e) {
						log.error("Error Sending forgot password mail to [{}]\n{}", testUser.getEmail(), e);
					}
				};
				Thread thread = new Thread(task);
				thread.start();
//				KJKJ
			}

			List<UserLink> usrList = userLinkService.findUserLinkByUserIdAndLinkType(testUser.getUserId(),
					Str.FORGET_PASS);
			if (usrList.size() > 0) {
				userLinkService.deleteLinkByList(usrList, testUser.getUserId());
			}
			String formattedDate = new SimpleDateFormat("hh:mm a").format(otp.getExpireDate());
			testUser.setMsg("OTP will expire at " + formattedDate);
			return testUser;
		} else {
			log.info("Security question answer is not match.");
			throw new RuntimeException("Security Question Answer not match.");
		}

	}

	private User authForgotPass(Message<List<User>> message, String actionType) throws Exception {
		User user = null;

		user = message.getPayload().get(0);
		User authUser = userRepo.findByLoginNameAndEmailAndVerificationCodeAndActive(user.getLoginName(),
				user.getEmail(), user.getVerificationCode(), 1);
		if (null != authUser) {
			authUser.setPassword(user.getNewPass());
			authUser.setUserVer(authUser.getUserVer() + 1);
			authUser.setVerificationCode(null);
			CF.fillUpdate(authUser);
			authUser = userRepo.save(authUser);
		} else {
			throw new Exception("Invalid verification code");
		}
		return authUser;

	}

	private User changePass(Message<List<User>> message, String actionType) throws Exception {
		User user = message.getPayload().get(0);
		Long creatorId = Long.valueOf(message.getHeader().getUserId());
		// check external user or not
		User testUser = userRepo.findByUserIdAndActive(user.getUserId(), 1);
		checkUsertype(testUser);

		List<SecurityQuestionAnswer> questionAnswerList = user.getQuestionAnswer();
		String oldPass = decryptPassword(user.getPassword());
		String requestPass = decryptPassword(user.getNewPass());
		if (oldPass.equals(requestPass)) {
			otpService.saveFaildOtp(testUser, Str.CHANGE_PASSWORD, Str.FAILED);
			throw new Exception("Old password and new password must not be same");
		}

		// check sequrity question and answer
		boolean isPassed = checkQuestionAndAnswer(questionAnswerList, creatorId);
		if (isPassed) {

			// check is pass has last 3 old pass? yes or no
			user.setPassword(oldPass);// decrypting pass
			User loginUser = checkUserValidation(user, message); // user with dicrypt password

//			// check sequrity question and answer
//			boolean isPassed = checkQuestionAndAnswer(questionAnswerList);

			if (loginUser != null) {

				boolean isPassValid = checkPassValidation(loginUser.getUserId(), requestPass);
				log.info("pass is : [{}]", isPassValid ? "valid" : "Not valid");

				if (!isPassValid) {
					otpService.saveFaildOtp(testUser, Str.CHANGE_PASSWORD, Str.FAILED);
					throw new RuntimeException("You can’t make your last 3 past passwords as a new password.");
				}

				// now change pass
				String encryptOldPass = encryptPassword(oldPass);
				loginUser.setPassword(encryptPassword(requestPass));
				userRepo.save(loginUser);

				// save audit data
				saveAuditData(loginUser);

				Otp otp = otpService.saveFaildOtp(loginUser, Str.CHANGE_PASSWORD, Str.SUCCESSED);
				passwordListService.savePassword(loginUser, encryptOldPass, creatorId, Str.CHANGE_PASSWORD,
						otp.getOtpId());

				// try to sending mail
				mailTempleteService.sendUserMailWithPblAdmin(Str.USER, MailType.PASSWORD_CHANGE_SUCCESS.toString(),
						loginUser, true);

			} else {
				throw new Exception("Invalid Username or Password");
			}
			return loginUser;
		} else {
			otpService.saveFaildOtp(testUser, Str.CHANGE_PASSWORD, Str.FAILED);
			log.info("Security question answer is not match.");
			throw new RuntimeException("Security Question Answer not match.");
		}

	}

	private void checkUsertype(User testUser) {
		if (testUser != null && testUser.getLoginName().equals("softcafe")
				&& testUser.getUserType().equals(Str.INTERNAL_USER)) {
			log.info("Password request come from [{}]", testUser.getUserType());
			throw new RuntimeException("Only External User can changed his password.");
		}

	}

	private boolean checkPassValidation(Long userId, String userPass) {
		return passwordListService.checkValidationForPass(userId, userPass);
	}

	private boolean checkQuestionAndAnswer(List<SecurityQuestionAnswer> questionAnswerList, Long userId) {
		questionAnswerList = securityQuestionAnswerService.matchQuestionAnswer(questionAnswerList, userId);
		log.info("getting answer match question list size is: [{}]", questionAnswerList.size());
		if (questionAnswerList.size() > 0) {
			return true;
		} else {
			throw new RuntimeException("Question answers are not match");
		}
	}

	private User logout(Message<List<User>> message, String actionType) throws Exception {
		User user = null;

		user = message.getPayload().get(0);
		if (user.getLoginName() == null) {
			user = userRepo.findByUserIdAndActive(user.getUserId(), 1);
		}

		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		String jwtToken = request.getHeader("Authorization").replace("Bearer ", "");

		// need to save jwt heare
		if (!StringUtils.isBlank(jwtToken)) {
			securityService.blacklistToken(jwtToken);
		}
		updateLogin(message, user, 0, user.getLoginName());

		return user;
	}

	private void updateLogin(Message<List<User>> message, User user, int loginLogout, String username)
			throws Exception {
		Login login = new Login();
		login.setUserId(user.getUserId());

		if (loginLogout == 0)
			login.setLogoutTime(new Date());
		else
			login.setLoginTime(new Date());

		login.setGateway(message.getHeader().getSenderGatewayIPAddress());
		login.setIpAddr(message.getHeader().getSenderSourceIPAddress());
		login.setLogin(loginLogout);
		login.setLoginName(username);
		login.setAttemptStatus(1);
		login.setFailResolved(0);
		loginRepo.save(login);
	}

//	
	private User loginOtp(Message<List<User>> message, String actionType) throws Exception {
		User user = message.getPayload().get(0);
		String loginName = user.getLoginName();

		if (StringUtils.isBlank(loginName)) {
			log.info("Can not find login name.");
			throw new RuntimeException("Can not find userId.");
		}

		User testUser = validateUser(user, message);

		if (testUser == null) {
			return null;
		}

		log.info("Finding user for loginName is: {}", loginName);

		List<Otp> otpList = otpService.findOtpByUserIdAndOtpType(testUser.getUserId(), Str.LOGIN_OTP);

		if (otpList.size() > 0) {
			checkOtpValidationtime(otpList);
			otpService.deleteOtpByList(otpList, testUser.getUserId(), Str.FAILED);
		}

		Otp otp = otpService.saveNew(testUser, Str.LOGIN_OTP);

		if (otp != null && isSendOtp) {
			Runnable task = () -> {
				try {
					mailTempleteService.sendLoginOtpMail(otp, testUser);
				} catch (Exception e) {
					log.error("Error Sending forgot password mail to [{}]\n{}", testUser.getEmail(), e);
				}
			};
			Thread thread = new Thread(task);
			thread.start();
//				KJKJ
		}

		String formattedDate = new SimpleDateFormat("hh:mm a").format(otp.getExpireDate());
		User ru = new User();
		ru.setMsg("OTP will expire at " + formattedDate);

		ru.setUserStringId(encryptId(testUser.getUserId().toString()));
		return ru;

	}

	private User internalUserOtp(Message<List<User>> message, String actionType) throws Exception {
		User user = message.getPayload().get(0);
		String loginName = user.getLoginName();

		if (StringUtils.isBlank(loginName)) {
			log.info("Can not find login name.");
			throw new RuntimeException("Can not find userId.");
		}

		User testUser = userRepo.findByLoginNameAndUserBlockCauseNotAndUserTypeAndActive(loginName,
				Str.ADMIN_BLOCK_USER, Str.INTERNAL_USER, 1);

		if (testUser == null) {
			throw new RuntimeException("user not found");
		}

		log.info("Finding user for loginName is: {}", loginName);

		List<Otp> otpList = otpService.findOtpByUserIdAndOtpType(testUser.getUserId(), Str.USER_UNLOCK);

		if (otpList.size() > 0) {
			checkOtpValidationtime(otpList);
			otpService.deleteOtpByList(otpList, testUser.getUserId(), Str.FAILED);
		}

		Otp otp = otpService.saveNew(testUser, Str.USER_UNLOCK);

		if (otp != null) {
			Runnable task = () -> {
				try {
					mailTempleteService.sendLoginOtpMail(otp, testUser);
				} catch (Exception e) {
					log.error("Error Sending forgot password mail to [{}]\n{}", testUser.getEmail(), e);
				}
			};
			Thread thread = new Thread(task);
			thread.start();
//				KJKJ
		}

		String formattedDate = new SimpleDateFormat("hh:mm a").format(otp.getExpireDate());
		testUser.setMsg("OTP will expire at " + formattedDate);

//		testUser.setUserStringId(encryptId(testUser.getUserId().toString()));
		return testUser;

	}

	private void checkOtpValidationtime(List<Otp> otpList) throws Exception {
		for (Otp otp : otpList) {
			otpCheck(otp);
		}
	}

	private void otpCheck(Otp otp) throws OtpValidationException {
		Calendar c = Calendar.getInstance();
		c.setTime(otp.getCreateDate());
		c.add(Calendar.MINUTE, otpResendValidationTime);

		boolean isValid = checkOtpValidation(c.getTime());
		if (isValid) {
			log.info("otp creation time is not exist {}. Current date: OTP resend validation date=>{}:{}", new Date(),
					c.getTime());
			throw new OtpValidationException(
					"You can resend OTP after " + new SimpleDateFormat("hh:mm a").format(c.getTime()));
		}

	}

	private List<UserListView> login(Message<List<User>> message, String actionType) throws Exception {
		List<UserListView> userList = null;
		List<Role> roleList = null;
		User user = null;
		long usrId = 0;

		String appName = (String) message.getHeader().getExtraInfoMap().get(APP_NAME);

		user = message.getPayload().get(0);

		if (StringUtils.isBlank(user.getOtp()) || StringUtils.isBlank(user.getUserStringId())
				|| StringUtils.isBlank(user.getLoginName())) {
			log.info("OTP or UserID or LoginName not found. OTP:UserId:LoginName=[{}:{}:{}]", user.getOtp(),
					user.getUserStringId(), user.getLoginName());
			throw new AuthenticationException("Unauthorized request.");
		}

		User dbUser = userRepo.findByLoginNameAndActive(user.getLoginName(), 1);

		if (dbUser == null) {
			log.info("User not found for loginName=[{}]", user.getLoginName());
			throw new AuthenticationException("Unauthorized request.");
		}
		try {
			usrId = Long.valueOf(decryptPassword(user.getUserStringId()));
			user.setUserId(usrId);

		} catch (Exception e) {
			log.info("Can not decript userId");
			throw new AuthenticationException("Unauthorized request.");
		}
		if (dbUser.getUserId() != usrId) {
			log.info("UserId not match for request UserId: Found UserId=[{}:{}]. For loginName={}", user.getLoginName(),
					dbUser.getUserId(), user.getLoginName());
			throw new AuthenticationException("Unauthorized request.");
		}

		Otp otp = findOtpByOtp(user.getOtp(), user.getUserId(), Str.LOGIN_OTP);
		if (otp != null) {
			if (!checkOtpValidation(otp.getExpireDate())) {
				log.info("OTP is expired. date:{}", otp.getExpireDate());
				otpService.deleteOtpByList(Arrays.asList(otp), otp.getUserId(), Str.FAILED);
				throw new RuntimeException("OTP time is expired.");
			}

		} else {
			log.info("User information not found for the otp: {}", user.getOtp());
			throw new RuntimeException("Wrong OTP.");
		}

		otpService.deleteOtpByList(Arrays.asList(otp), user.getUserId(), Str.SUCCESSED);

		user = validateUser(user, message);

		if (user == null) {
			return Collections.emptyList();
		}

		else if (user != null) {
			if (validateAppAtLogin) {
				List<UserApp> appList = userAppService.assignApp(user);
				if (appList.isEmpty()) {
					throw new Exception(invalidAppErrorMsg);
				}
				boolean allowed = appList.stream().filter(a -> a.getAppName().equals(appName)).findFirst().isPresent();
				if (!allowed) {
					throw new Exception(invalidAppErrorMsg);
				}

			}

			Login login = updateLogin(message, user, 1);
			userList = new ArrayList<>();
			if (user.getTwoFactorAuth() != null && user.getTwoFactorAuth() == 1) {
				user = sendCode(user, "Educafe Verification Code", "Verification Code");
				user = userRepo.save(user);
				UserListView ul = userListViewRepo.findById(user.getUserId()).get();
				ul.setLoginId(login.getLoginId());
				userList.add(ul);
				return userList;
			}
			UserListView ul = userListViewRepo.findById(user.getUserId()).get();
			// now select role
			ul.setRoleList(roleService.selectUserRole(user));

			List<Regex> regexList = regexRepo.findAll();
			if (regexList.size() > 0) {
				ul.setRegexList(regexList);
			}

//			user.setPassword(null);
//			user.setDefaultAdPass(null);
//			user.setLoginId(login.getLoginId());
			if (!StringUtils.isBlank(user.getUserType()) && user.getUserType().equals(Str.EXTERNAL_USER)) {
				ul.setMsg(buildMsg(user));
			}

			ul.setProfileImage(StringUtils.isEmpty(user.getProfileImage()) ? ""
					: user.getProfileImage().substring(user.getProfileImage().lastIndexOf("\\") + 1));

			ul.setLoginId(login.getLoginId());

//			userList.add(user);

			ul.setInstitutionName(institutionService.getInstitutionName(user.getInstitutionId()));
			userList.add(ul);

			if (user.getAllowLogin() == 1) {
				mailTempleteService.sendLoginSuccessMail(user);
			}

			return userList;
		} else {
			return Collections.emptyList();
		}
	}

	private User validateUser(User user, Message<List<User>> message) throws Exception {

		String decrPass = "";

		boolean localLdap = ldapLogin;

		User dbUser = userRepo.findByLoginNameAndActive(user.getLoginName(), 1);

		if (dbUser == null) {
			log.info("User not found [{}]", user.getLoginName());

			Login login = updateLogin(message, user, 0);

			throw new Exception("Login Failed.\n Wrong User Id or Password.");
		}

		if (StringUtils.isBlank(dbUser.getUserType()) || Str.EXTERNAL_USER.equals(dbUser.getUserType())
				|| Str.DB.equals(dbUser.getLogingMethod())) {
			log.info("Found external user. trying db login [{}]", user.getLoginName());
			localLdap = false;
		}

		if (localLdap) {
			try {
				log.info("trying ldap login [{}]", user.getLoginName());
				decrPass = decryptPassword(user.getPassword());
				boolean authenticated = ldapService.authenticateWithLdap(user.getLoginName(), decrPass);
				if (StringUtils.isBlank(user.getDefaultAdPass())) {
					user.setDefaultAdPass(defaultAdPass);
				}
				if (authenticated) {
					decrPass = "";
					decrPass = decryptPassword(user.getDefaultAdPass());
					user.setPassword(decrPass);

					user = try2Login(user, message);
				}

			} catch (Exception e) {
				log.error("Ldap authentication fail \n{}", e.getMessage());
				if (dbLoginOnLdapFail) {
					decrPass = "";
					log.debug("Trying to login with db [{}]", user.getLoginName());

					decrPass = decryptPassword(user.getPassword());

					user.setPassword(decrPass);
					user = try2Login(user, message);

				} else {
					throw new AuthenticationException("User ID or Password not correct.");
				}
			}
		} else {
			decrPass = decryptPassword(user.getPassword());
			user.setPassword(decrPass);
			user = try2Login(user, message);

		}
		return user;
	}

	private String buildMsg(User dbUser) {

		PasswordList lastChangePass = passwordListService.findLastChangPass(dbUser.getUserId());

		if (lastChangePass != null) {

			long daysBetween = ChronoUnit.DAYS.between(lastChangePass.getCreateDate().toInstant(),
					new Date().toInstant());

//			long daysBetween = ChronoUnit.DAYS.between(
//					new Date().toInstant(),lastChangePass.getCreateDate().toInstant());

			List<SConfiguration> scList = sConfigurationService.findConfigValueByGroupSubGroupValue5(
					Str.LAST_USER_INFO_GROUP, Str.LAST_USER_INFO_SUBGROUP, Str.LAST_CHANGE_PASS);

			long passDate = scList != null && scList.size() > 0
					? (Long.valueOf(scList.get(0).getValue1()) - daysBetween)
					: 0;

			if (passDate < passwordValidationDateMsg) {
				log.info("last password reset before: {}", daysBetween);
				return "Your password will expire on " + buildExpireDate(passDate);
			}
			return null;
		} else {
			return null;
		}
	}

	public boolean checkPasswordChangeDate(User dbUser, long days) {
		PasswordList lastChangePass = passwordListService.findLastChangPass(dbUser.getUserId());

		if (lastChangePass != null) {

			long daysBetween = ChronoUnit.DAYS.between(lastChangePass.getCreateDate().toInstant(),
					new Date().toInstant());

//			long daysBetween = ChronoUnit.DAYS.between(
//					new Date().toInstant(),lastChangePass.getCreateDate().toInstant());

			List<SConfiguration> scList = sConfigurationService.findConfigValueByGroupSubGroupValue5(
					Str.LAST_USER_INFO_GROUP, Str.LAST_USER_INFO_SUBGROUP, Str.LAST_CHANGE_PASS);

			long passDate = scList != null && scList.size() > 0
					? (Long.valueOf(scList.get(0).getValue1()) - daysBetween)
					: 0;

			return passDate == days;
		}
		return false;
	}

	private String buildExpireDate(long time) {

		LocalDate currentDate = LocalDate.now();
		LocalDate newDateTime = currentDate.plusDays(time);

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
		return newDateTime.format(formatter);
	}

	private Login updateLogin(Message message, User user, int loginLogout) throws Exception {
		Login login = new Login();
		login.setUserId(user.getUserId());

		if (loginLogout == 0) {
			login.setLogoutTime(new Date());
		} else {
			login.setLoginTime(new Date());
		}

		login.setGateway(message.getHeader().getSenderGatewayIPAddress());
		login.setIpAddr(message.getHeader().getSenderSourceIPAddress());
		login.setLogin(loginLogout);
		login.setLoginName(user.getLoginName());
		login.setModTime(new Date());
		login.setAttemptStatus(loginLogout);

		return loginRepo.save(login);
	}

	private User try2Login(User user, Message<List<User>> message) throws Exception {
		User dbUser = null;

		try {
			dbUser = userRepo.findByLoginNameAndActive(user.getLoginName(), 1);

			if (dbUser != null) {

				if (dbUser.getAllowLogin() == 0) {
					// now check lock type
					// if admin lock, do not allow to unlock the user
					// if other lock then allow to unlock the user
					// pass indentifier to ui for lock type

					log.info("user is lock, userId={}", dbUser.getUserId());
					PassValidationRes pRes = new PassValidationRes(
							"Login failed: Account is locked. Please contact with admin.", dbUser.getUserBlockCause(),
							dbUser.getUserType());
					//
					throw new ValidationException(gson.toJson(pRes));
				}
//				if (dbUser.getAllowLogin() == 0 && dbUser.getUserType().equals(Str.EXTERNAL_USER)) {
//					log.info("user is lock, userId={}", dbUser.getUserId());
////					PassValidationRes pRes = new PassValidationRes(
////							"Your ID has been locked. For unlock, click unlock button.", Str.OVER_CHANGE_LAST_PASSWORD_TIME,
////							dbUser.getUserType());
//					PassValidationRes pRes = new PassValidationRes(
//							"Your ID has been locked. For unlock, click unlock button.", dbUser.getUserBlockCause(),
//							dbUser.getUserType());
//					
//					throw new ValidationException(gson.toJson(pRes));
//				}
//				else if (dbUser.getAllowLogin() == 0 && dbUser.getUserType().equals(Str.INTERNAL_USER)) {
//					log.info("user is lock, userId={}", dbUser.getUserId());
//					PassValidationRes pRes = new PassValidationRes(
//							"Your ID has been locked. For unlock, click unlock button.", dbUser.getUserBlockCause(),
//							dbUser.getUserType());
//					//
//					throw new ValidationException(gson.toJson(pRes));
//				}
				String userName = dbUser.getLoginName();
				dbUser = chackPass2Lonig(dbUser, user);
				if (dbUser == null) {
					log.info("User name Or Password not match.");
					// save login attemt faild
					saveFailLoginAttempt(userName, message);
//					login.setGateway(message.getHeader().getSenderGatewayIPAddress());
//					login.setIpAddr(message.getHeader().getSenderSourceIPAddress());

					throw new Exception("User name Or Password not match.");
				} else if (StringUtils.contains(dbUser.getUserBlockCause(), Str.OVER_LOGIN_ATTEMPT)) {
					dbUser.setUserBlockCause("");
					userRepo.save(dbUser);
				}
				updateFaildLoginAttempt(userName);
				long lastChangePass = checkPasswordValidation(dbUser);
				checkUserActivation(dbUser, lastChangePass);

			} else {
				log.info("The active {} not found.", user.getLoginName());
				throw new NullPointerException("Sorry user not found.");
			}

		} catch (Exception e) {
			log.info("getting user validation error. error:{}", e.getMessage());
			throw new Exception(e.getMessage());
		}

		return dbUser;

	}

	private User checkUserValidation(User user, Message<List<User>> message) throws Exception {
		User dbUser = null;

		try {
			dbUser = userRepo.findByLoginNameAndActive(user.getLoginName(), 1);
			if (dbUser != null) {
//				String userName = dbUser.getLoginName();
				dbUser = chackPass2Lonig(dbUser, user);
//				if (dbUser == null) {
//					log.info("User name Or Password not match.");
//					// save login attemt faild
//					saveFailLoginAttempt(userName, message);
////					login.setGateway(message.getHeader().getSenderGatewayIPAddress());
////					login.setIpAddr(message.getHeader().getSenderSourceIPAddress());
//
//					throw new Exception("User name Or Password not match.");
//				}
//				updateFaildLoginAttempt(userName);
				if (dbUser == null) {
					log.info("Current password is not match.");
					throw new Exception("Current password is not match.");
				}
				long lastChangePass = checkPasswordValidation(dbUser);
				checkUserActivation(dbUser, lastChangePass);

			} else {
				log.info("The active {} not found.", user.getLoginName());
				throw new NullPointerException("Sorry user not found.");
			}

		} catch (Exception e) {
			log.info("getting user validation error");
			throw new Exception(e.getLocalizedMessage());
		}

		return dbUser;

	}

	private long checkPasswordValidation(User dbUser) throws ValidationException {
		long daysBetween = 0;
		if (!StringUtils.isBlank(dbUser.getUserType()) && dbUser.getUserType().equals(Str.EXTERNAL_USER)) {
			PasswordList lastChangePass = passwordListService.findLastChangPass(dbUser.getUserId());

			if (lastChangePass == null) {
				lastChangePass = new PasswordList();
				lastChangePass.setCreateDate(dbUser.getCreateDate());
			}

//			if(lastChangePass != null) {

			daysBetween = ChronoUnit.DAYS.between(lastChangePass.getCreateDate().toInstant(), new Date().toInstant());

//			SConfiguration sc = sConfigurationService.findConfigValueByGroupSubGroupValue5(Str.LAST_USER_INFO_GROUP,
//					Str.LAST_USER_INFO_SUBGROUP, Str.LAST_CHANGE_PASS);
			List<SConfiguration> scList = sConfigurationService.findConfigValueByGroupSubGroupValue5(
					Str.LAST_USER_INFO_GROUP, Str.LAST_USER_INFO_SUBGROUP, Str.LAST_CHANGE_PASS);
			Long lgDt = (scList != null && scList.size() > 0) ? Long.valueOf(scList.get(0).getValue1())
					: passwordValidationDate;

			if (daysBetween >= lgDt) {
				log.info("last password reset before: {}", daysBetween);

				if (StringUtils.isBlank(dbUser.getUserBlockCause()) || dbUser.getAllowLogin() == 1
						|| (!StringUtils.isBlank(dbUser.getUserBlockCause())
								&& !dbUser.getUserBlockCause().equals(Str.OVER_CHANGE_LAST_PASSWORD_TIME))) {
					lockUser(dbUser, Str.OVER_CHANGE_LAST_PASSWORD_TIME);
				}

//				lockUser(dbUser, Str.OVER_CHANGE_LAST_PASSWORD_TIME);
				String msg = userBlocNotChangePassMsg;

				PassValidationRes pRes = new PassValidationRes(msg, Str.OVER_CHANGE_LAST_PASSWORD_TIME,
						dbUser.getUserType());
				throw new ValidationException(gson.toJson(pRes));

//				throw new ValidationException(
//						"Your account has been locked because of your last change password was " + lgDt + " days ago.");
			}
//			}
		}

		log.info("last  password validation successful");
		return daysBetween;
	}

	public boolean isLoginDateIn(User dbUser, int days) {

		Login lastLogin = loginService.findFirstRecord(dbUser.getUserId());
		if (lastLogin != null) {

			log.info("user id: lastLogin=[{}:{}]", dbUser.getUserId(), lastLogin.getLoginTime());
			long daysBetween = ChronoUnit.DAYS.between(lastLogin.getLoginTime().toInstant(), new Date().toInstant());
			// get lastlogin max-date from sconfig
			List<SConfiguration> scList = sConfigurationService.findConfigValueByGroupSubGroupValue5(
					Str.LAST_USER_INFO_GROUP, Str.LAST_USER_INFO_SUBGROUP, Str.LAST_LOGIN);
			Long lgDt = (scList != null && scList.size() > 0) ? Long.valueOf(scList.get(0).getValue1())
					: lastLoginValidationDate;

			if (lgDt - daysBetween == days) {
				return true;
			}
		}
		return false;
	}

	protected void checkUserActivation(User dbUser, long lastChangePass) throws ValidationException {

		log.info("finding last login information for userId:{}", dbUser.getUserId());
		Login lastLogin = loginService.findFirstRecord(dbUser.getUserId());

		if (lastLogin == null) {
			lastLogin = new Login();
			lastLogin.setLoginTime(dbUser.getCreateDate());
		}

//		if (lastLogin != null) {
		long daysBetween = ChronoUnit.DAYS.between(lastLogin.getLoginTime().toInstant(), new Date().toInstant());

		// get lastlogin max-date from sconfig
		List<SConfiguration> scList = sConfigurationService.findConfigValueByGroupSubGroupValue5(
				Str.LAST_USER_INFO_GROUP, Str.LAST_USER_INFO_SUBGROUP, Str.LAST_LOGIN);
		Long lgDt = (scList != null && scList.size() > 0) ? Long.valueOf(scList.get(0).getValue1())
				: lastLoginValidationDate;
		log.info("Allow last login date is befor: userId:[{}:{}]", lgDt, dbUser.getUserId());

		if (daysBetween >= lgDt && lgDt < lastChangePass) {
			log.info("last login before: {}", daysBetween);

			if (StringUtils.isBlank(dbUser.getUserBlockCause()) || dbUser.getAllowLogin() == 1
					|| (!StringUtils.isBlank(dbUser.getUserBlockCause())
							&& !dbUser.getUserBlockCause().equals(Str.OVER_LAST_LOGIN_TIME))) {
				lockUser(dbUser, Str.OVER_LAST_LOGIN_TIME);
			}

			String msg = userBlocLastLoginkMsg;
//			kl
//			msg = msg.replace("#FAIL_COUNT#", Integer.toString(fails.size()));
//			msg = msg.replace("#LOGIN_THRESHOLD#", conf.getValue1());

//			throw new Exception(msg);
			PassValidationRes pRes = new PassValidationRes(msg, Str.OVER_LAST_LOGIN_TIME, dbUser.getUserType());
			throw new ValidationException(gson.toJson(pRes));

//			throw new ValidationException(
//					"Your account has been locked because of your last login was " + lgDt + " days ago.");
		}
//		}
		log.info("last login user validation successful");
	}

	private void lockUser(User dbUser, String blockClause) {

		dbUser.setAllowLogin(0);
		dbUser.setUserBlockCause(blockClause);
		dbUser.setModDate(new Date());
		dbUser.setInactiveDate(new Date());

		userRepo.save(dbUser);

	}

	private User chackPass2Lonig(User dbUser, User user) {

		if (StringUtils.isBlank(user.getPassword())) {
			log.info("getting password is null");
			return null;
		}
		boolean isPassMatch = passwordEncoder.matches(user.getPassword(), dbUser.getPassword());
		log.info("pass match result is: [{}]", isPassMatch);

		return isPassMatch ? dbUser : null;
	}

	private String encryptPassword(String srtToEncrpt) {
		String encpass = passwordEncoder.encode(srtToEncrpt);
//		log.info("java password encryption. \nmain pass : encrpt pass= [{}:{}]", srtToEncrpt, encpass);
		return encpass;
	}

	private String encryptId(String srtToEncrpt) throws Exception {
		return encryptDecryptHelper.encrypt(srtToEncrpt, SECRET_KEY);
	}

	private String decryptPassword(String encrpt2Srt) throws Exception {

		String decPass = encryptDecryptHelper.decrypt(encrpt2Srt, SECRET_KEY);
//		log.info("java password decryption. \n encrpt pass : main pass := [{}:{}]", encrpt2Srt, decPass);

		return decPass;
	}

	public Login saveFailLoginAttempt(String username, Message<List<User>> message) throws Exception {
		Login login = new Login();

		login.setLoginTime(new Date());

		login.setGateway(message.getHeader().getSenderGatewayIPAddress());
		login.setIpAddr(message.getHeader().getSenderSourceIPAddress());
		login.setLogin(1);
		login.setLoginName(username);
		login.setAttemptStatus(0);
		login.setFailResolved(0);
		login = loginRepo.save(login);
		SConfiguration conf = sConfigurationService.select3(SConfig.APPLICATION_SUTUP, SConfig.LOGIN,
				SConfig.BLOCK_LOGIN_ATTEMPT);

//		List<Login> fails = loginRepo.findByLoginNameAndFailResolved(username, 0);
//		log.info("Fail counf for the user [{}]:[{}]", username, fails.size());
//
////		int threshhold = allowLoginAttempts;

//		if (daysBetween >= lgDt || (!StringUtils.isBlank(dbUser.getUserBlockCause()) && dbUser.getUserBlockCause().equals(Str.OVER_LAST_LOGIN_TIME))) {
//			log.info("last login before: {}", daysBetween);
//
//			if(StringUtils.isBlank(dbUser.getUserBlockCause()) || (!StringUtils.isBlank(dbUser.getUserBlockCause()) && !dbUser.getUserBlockCause().equals(Str.OVER_LAST_LOGIN_TIME))) {
//				lockUser(dbUser, Str.OVER_LAST_LOGIN_TIME);
//			}

		int threshhold = Integer.parseInt(conf.getValue1());
		if (shouldBlockUser(username, conf)) {
			log.info("Blocking user for fail attempt exceed [{}]", username);

			User user = userRepo.findByLoginNameAndActive(username, 1);

			if (user != null) {

				if (StringUtils.isBlank(user.getUserBlockCause()) || user.getAllowLogin() == 1
						|| (!StringUtils.isBlank(user.getUserBlockCause())
								&& !user.getUserBlockCause().equals(Str.OVER_LOGIN_ATTEMPT))) {

					lockUser(user, Str.OVER_LOGIN_ATTEMPT);
				}

//SEND MAIL

				sendingMail4WorngPass(user, threshhold);

				String msg = userBlockMsg;
				List<Login> fails = loginRepo.findByLoginNameAndFailResolvedAndLogin(username, 0, 1);
				msg = msg.replace("#FAIL_COUNT#", Integer.toString(fails.size()));
				msg = msg.replace("#LOGIN_THRESHOLD#", conf.getValue1());

//				throw new Exception(msg);
				PassValidationRes pRes = new PassValidationRes(msg, user.getUserBlockCause(), user.getUserType());
				throw new Exception(gson.toJson(pRes));
			}
		} else {
			// check count

			String msg = mailAttemptMsg(username);
			if (!StringUtils.isBlank(msg)) {
				throw new Exception(msg);
			}

		}
		return login;
	}

	private void sendingMail4WorngPass(User user, int threshhold) {
		String insName = null;
		Institution ins = institutionService.findInstitutionInfoByUserId(user.getUserId());
		if (ins != null) {
			insName = ins.getInstitutionName();
		}
		mailTempleteService.sendLock4WorngPass(user, threshhold, insName);
	}

	private User sendCode(User user, String subject, String body) throws Exception {
		// send auth code to mail
		int vc = RandomUtils.nextInt(100000, 9999999);
		log.info("[{}]", vc);
		user.setVerificationCode(Integer.toString(vc));
		user.setModDate(new Date());
		user.setUserVer(user.getUserVer() + 1);
		Runnable task = () -> {
			SystemMailService.sendAppSecurityCode(body + " : " + vc, subject, user.getEmail());
		};
		new Thread(task).start();
		return user;
	}

//	private Page<User> select(Message<List<User>> message, String action) throws Exception {
//
//		User user = message.getPayload().get(0);
//		Pageable pageable = PageRequest.of(user.getPageNumber() - 1, user.getPageSize(),
//				Sort.by("userId").descending());
//
//		return userRepo.findAllByActive(1, pageable);
//	}

//	private Page<User> xselect(Message<List<User>> message, String action) throws Exception {
//		User user = message.getPayload().get(0);
//
//		Long institutionId = user.getInstitutionId();
//		String email = user.getEmail();
//		String loginName = user.getLoginName();
//		Pageable pageable = PageRequest.of(user.getPageNumber() - 1, user.getPageSize(),
//				Sort.by("userId").descending());
//		return userRepo.findAllByActiveAndFilters(1, institutionId, email, loginName, pageable);
//	}

	private Page<UserListView> select(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);

		Long institutionId = user.getInstitutionId();
		String email = user.getEmail();
		String loginName = user.getLoginName();
		String fullName = user.getFullName();
		Pageable pageable = PageRequest.of(user.getPageNumber() - 1, user.getPageSize(),
				Sort.by("userId").descending());

		Page<UserListView> list = userListViewRepo.findAllByActiveAndFilters(1, institutionId, email, loginName,
				fullName, user.getUserType(), pageable);
		return list;
	}

	private List<ViewUserAudit> selectUserAuditData(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);

		List<ViewUserAudit> list = viewUserAuditRepo.findByUserIdOrderByAuditUserIdDesc(user.getUserId());
		return list;
	}

	private List<User> loadUserTypeWise(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);

		List<User> list = userRepo.findByUserTypeAndActive(user.getUserType(), user.getActive());
		return list;
	}

	private Page<UserListView> selectPendUser(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);

		Long institutionId = user.getInstitutionId();
		String email = user.getEmail();
		String loginName = user.getLoginName();
		String fullName = user.getFullName();
		Pageable pageable = PageRequest.of(user.getPageNumber() - 1, user.getPageSize(),
				Sort.by("userId").descending());
//		return userListViewRepo.findAllPendByActiveAndFilters(1, institutionId, email, loginName, user.getUserType(),
//				pageable);
		Page<UserListView> list = userListViewRepo.findAllPendByActiveAndFilters(1, institutionId, email, loginName,
				fullName, user.getUserType(), pageable);
		return list;
	}

	private List<User> selectAll(Message<List<User>> message, String action) throws Exception {

		return userRepo.findAll();
	}

	private List<User> selectSingle(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);
		Optional<User> userOp = userRepo.findById(user.getUserId());
		if (userOp.isPresent()) {
			List<User> userList = new ArrayList<>();
			user = userOp.get();

			List<Long> list = new ArrayList<Long>();
			list.add(user.getDepartmentId());
			// user.setDepartmentIdList(sharedGenericMapService.getToIdList(user.getUserId(),
			// USER, USER_DEPARTMENT));
			user.setDepartmentIdList(list);

			// select role
			user.setRoleIdList(sharedGenericMapService.getToIdList(user.getUserId(), "USER", "ROLE"));

			// List<Address> xaddrList = addressService.select(user.getUserId(),
			// AddrFor.USER);
			userList.add(user);
			return userList;
		} else {
			return Collections.emptyList();
		}
	}

	private List<User> selectSingleWithRole(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);
		if (user.getUserId() != null) {
			Optional<User> userOp = userRepo.findById(user.getUserId());
			if (userOp.isPresent()) {
				user = userOp.get();
				List<User> userList = new ArrayList<>();
				List<Role> roleList = roleService.selectUserRole(user);
				user.setRoleList(roleList);

				List<Role> unassignRoleList = roleService.selectUnassignRoleList(roleList);
				user.setUnassignRoleList(unassignRoleList);

				userList.add(user);
				return userList;
			} else {
				return Collections.emptyList();
			}
		}
		return Collections.emptyList();

	}

	private List<User> selectSingleWithRoleGroup(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);
		Optional<User> userOp = userRepo.findById(user.getUserId());
		if (userOp.isPresent()) {
			user = userOp.get();
			List<User> userList = new ArrayList<>();
			List<RoleGroup> roleList = roleGroupService.selectUserRoleGroup(user);
			user.setRoleGroupList(roleList);

			List<RoleGroup> unassignRoleList = roleGroupService.selectUnassignRoleGroupList(roleList);
			user.setUnassignRoleGroupList(unassignRoleList);

			userList.add(user);
			return userList;
		} else {
			return Collections.emptyList();
		}
	}

	private List<User> selectUserApp(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);
		if (user == null || user.getUserId() == null) {
			return Collections.emptyList();
		}
		Optional<User> userOp = userRepo.findById(user.getUserId());
		if (userOp.isPresent()) {
			user = userOp.get();
			List<User> userList = new ArrayList<>();

			userList.add(user);
			return userList;
		} else {
			return Collections.emptyList();
		}
	}

	private User register(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);
		Long userId = user.getUserId();
		if (userId == null) {
			log.info("can not find userId: [{}]", userId);
			throw new InvalidInputException("Invalid Request.");
		}

//		user = userRepo.findByUserIdAndFirstLoginAndUserStatusAndActive(userId, 1, Str.APPROVED, 1);

//		if(user != null) {
//			log.info("can not find user for userId: [{}]",userId);
//			throw new InvalidInputException("User not found.");
//		}

		UserLink ul = userLinkService.findUserLinkByUserId(userId);

		if (ul != null) {
			String appName = (String) message.getHeader().getExtraInfoMap().get("appName");
			List<SecurityQuestion> sq = user.getSecurityQuestionList();

			List<SecurityQuestionAnswer> sqaList = new ArrayList<SecurityQuestionAnswer>();
//			User checkUser = userRepo.findByLoginNameAndActive(user.getLoginName(), 1);

//			User checkUser = userRepo.findByUserIdAndFirstLoginAndUserStatusAndActive(userId, 1, Str.ACTIVE, 1);
			User checkUser = userRepo.findByUserIdAndFirstLoginAndUserTypeAndActive(userId, 1, Str.EXTERNAL_USER, 1);

			List<Role> roleList = user.getRoleList();

			if (checkUser != null && checkUser.getAllowLogin() == 1) {
				// check ad login
				try {
					if (ldapLogin && checkUser.getUserType().equals("INTERNAL_USER")) {
						boolean res = ldapService.authenticateWithLdap(checkUser.getLoginName(),
								decryptPassword(checkUser.getPassword()));
						if (res) {

							checkUser.setPassword(encryptPassword(defaultAdPass));

//							user = decryptPassword(user);
//							user.setPassword(passwordEncoder.encode(user.getDefaultAdPass()));
						} else {
							throw new Exception("LDAP user not found");
						}
					} else {
						checkUser.setPassword(encryptPassword(decryptPassword(user.getPassword())));

//						user = decryptPassword(user);

//						String decrPass = EncryptDecryptHelper.decrypt(user.getPassword(), SECRET_KEY);
//						log.info("deccrip pass is= [{}]", decrPass);
//						user.setPassword(passwordEncoder.encode(decrPass));
//						log.info("encrypt pass by java is: [{}]", user.getPassword());
					}

					CF.fillInsert(checkUser);
					checkUser.setAppName(appName);
					checkUser = try2saveUser(checkUser, user.getUserId());

					// save audit table
					saveAuditData(checkUser);

					userId = checkUser.getUserId();

					sqaList = getQuestionAnswerList(sqaList, sq, userId);
//					
					boolean res = securityQuestionAnswerService.saveAnswerByList(sqaList);

					if (!res) {
						log.info("getting error for saveing question list answer");
						throw new RuntimeException("Sorry something not wright...");
					}
					message.getPayload().add(checkUser);

					// aipotjoto*****************************************

					return checkUser;
				} catch (Exception ex) {
					log.info("error comes : {}", ex);
//					throw new Exception(adUserNotExistsMsg);
					TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
					throw new Exception(ex.getMessage());
				}

			} else {
				if (checkUser != null && checkUser.getAllowLogin() != 1) {
					throw new Exception(
							"User already exist but not allowed to login. Please contact your administrator for activation.");
				} else {
					throw new Exception("User already exist.");
				}
			}
		} else {
			throw new Exception("Link not exist.");
		}

	}

	private void saveAuditData(User u) {

		UserAudit ua = new UserAudit();
		ua.setUserId(u.getUserId());
		ua.setEmpId(u.getEmpId());
		ua.setUserVer(u.getUserVer());
		ua.setAppName(u.getAppName());
		ua.setFirstName(u.getFirstName());
		ua.setMiddleName(u.getMiddleName());
		ua.setLastName(u.getLastName());
		ua.setFullName(u.getFullName());
		ua.setDob(u.getDob());
		ua.setInactiveDate(u.getInactiveDate());
		ua.setNid(u.getNid());
		ua.setCountry(u.getCountry());
		ua.setPhoneNumber(u.getPhoneNumber());
		ua.setEmail(u.getEmail());
		ua.setLoginName(u.getLoginName());
		ua.setPassword(u.getPassword());
		ua.setGender(u.getGender());
		ua.setReligion(u.getReligion());
		ua.setAllowLogin(u.getAllowLogin());
		ua.setPassExpired(u.getPassExpired());
		ua.setTwoFactorAuth(u.getTwoFactorAuth());
		ua.setProfileImage(u.getProfileImage());
		ua.setVerificationCode(u.getVerificationCode());
		ua.setNewPass(u.getNewPass());
		ua.setTmpPass(u.getTmpPass());
		ua.setBranchId(u.getBranchId());
		ua.setExtBranchName(u.getExtBranchName());
		ua.setLogingMethod(u.getLogingMethod());
		ua.setDesignation(u.getDesignation());
		ua.setRemarks(u.getRemarks());
		ua.setUserType(u.getUserType());
		ua.setFirstLogin(u.getFirstLogin());
		ua.setUserStatus(u.getUserStatus());
		ua.setUserBlockCause(u.getUserBlockCause());
		ua.setInstitutionId(u.getInstitutionId());
		ua.setDepartmentId(u.getDepartmentId());
		ua.setIsMasterUser(u.getIsMasterUser());
		ua.setIpAddr(u.getIpAddr());
		ua.setIpGateway(u.getIpGateway());
		ua.setActive(u.getActive());
		ua.setUserModId(u.getUserModId());
		ua.setClientId(u.getClientId());
		ua.setCreatorId(u.getCreatorId());
		ua.setModDate(u.getModDate());
		ua.setCreateDate(u.getCreateDate());
		ua.setStateId(u.getStateId());
		ua.setEventId(u.getEventId());
		ua.setApproveById(u.getApproveById());
		ua.setApproveTime(u.getApproveTime());

		log.info("saving userAudit Data [{}]", u.getLoginId());
		userAuditRepo.save(ua);

	}

	private List<SecurityQuestionAnswer> getQuestionAnswerList(List<SecurityQuestionAnswer> sqaList,
			List<SecurityQuestion> sq, long userId) {
		sq.forEach(e -> {
			SecurityQuestionAnswer sqa = new SecurityQuestionAnswer();
			sqa.setUserId(userId);
			sqa.setQuestionAnswer(e.getQuestionAnswer());
			sqa.setQuestionId(e.getSecurityQuestionId());
			sqa.setCreatorId(userId);
			sqa.setCreateDate(new Date());

			log.info("question ans is: [{}]", gson.toJson(sqa));
			sqaList.add(sqa);

		});
		return sqaList;
	}

	private User try2saveUser(User user, Long userId) throws RuntimeException {
		try {
			user.setUserVer(0);
			user.setAllowLogin(1);
			user.setFirstLogin(0);
			// user.setPassword(user.getDefaultAdPass());
//			user.setCreatorId(user.getCreatorId());
//			user.setCreateDate(new Date());
			user.setModDate(new Date());
			user.setUserModId(userId);

			// ekhan theke************************************************
			user = userRepo.save(user);

			// user link table theke value ke delete korte hobe
			userLinkService.deleteLink(user.getUserId());

			return user;
		} catch (Exception e) {
			throw new RuntimeException("Sorry! User not created...");
		}

	}

	private void sendRegisterMail(User user) {
		try {
			Runnable task = () -> {
				// send two mail from here.
				// one to newly registered user
				// another to admin user. pre-configured email address

				try {
					// mail to admin
					log.info("Sending user registration mail to admin [{}]", userRegistrationAdminMail);
					mailService.send(registerMailSubject, mailReplace(user, registerMailToAdminTemplate),
							userRegistrationAdminMail);
				} catch (Exception e) {
					log.error("Error Sending user registration mail to admin [{}]\n{}", userRegistrationAdminMail, e);
				}

				try {
					// mail to admin
					log.info("Sending user registration mail to user [{}]", user.getEmail());
					mailService.send(registerMailSubject, mailReplace(user, registerMailToUserTemplate),
							user.getEmail());
				} catch (Exception e) {
					log.error("Error Sending user registration mail to user [{}]\n{}", user.getEmail(), e);
				}
			};
//			task.start();

			Thread thread = new Thread(task);
			thread.start();
		} catch (Exception e) {
			log.error("Error sending register mail \n{}", e);
		}
	}

	private String mailReplace(User user, String template) {
		return template.replace("#Username#", StringUtils.isBlank(user.getLoginName()) ? "" : user.getLoginName())
				.replace("#Branch#", StringUtils.isBlank(user.getBranchName()) ? "" : user.getBranchName())
				.replace("#Email#", StringUtils.isBlank(user.getEmail()) ? "" : user.getEmail())
				.replace("#FullName#", StringUtils.isBlank(user.getFullName()) ? "" : user.getFullName());
	}

	private List<User> insert(Message<List<User>> message, String action) throws Exception {

		User user = message.getPayload().get(0);
		Long userId = message.getHeader().getUserId().longValue();
//		User checkUser = userRepo.findByLoginNameAndActive(user.getLoginName(), 1);
//		boolean checkUser = userRepo.existsByEmailAndActive(user.getEmail(), 1);

		if (user.getUserId() == null) {

			return makeNewUser(user, userId);
		} else {
			throw new Exception("Invalid request.");
		}

	}

	private String getClientIp(HttpServletRequest request) {
		String ip = request.getHeader("X-Forwarded-For"); // Handle reverse proxy IPs
		if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr(); // Fallback to the actual remote address
		}
		return ip;
	}

	private List<User> makeNewUser(User user, Long userId) throws Exception {
		if (user.getLoginName() != null) {
			user.setLoginName(user.getLoginName().trim());
		}

		boolean checkUser = userRepo.existsByLoginNameAndActive(user.getLoginName(), 1);

		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();
		if (!checkUser) {
			if (!StringUtils.isBlank(user.getPhoneNumber())) {
				checkUser = userRepo.existsByPhoneNumberAndActive(user.getPhoneNumber(), 1);
				if (checkUser) {
					throw new Exception("Mobile number (" + user.getPhoneNumber() + ") is already exists.");
				}
			}
			if (!StringUtils.isBlank(user.getEmail())) {
				checkUser = userRepo.existsByEmailAndActive(user.getEmail(), 1);
				if (checkUser) {
					throw new Exception("Email (" + user.getEmail() + ") is already exists.");
				}
			}
			if (!StringUtils.isBlank(user.getNid())) {
				checkUser = userRepo.existsByNidAndActive(user.getNid(), 1);
				if (checkUser) {
					throw new Exception("Nid (" + user.getNid() + ") is already exists.");
				}
			}
			if (user.getInstitutionId() != null && user.getEmpId() != null) {
				boolean checkUserByEmpAndInst = userRepo.existsByInstitutionIdAndEmpId(user.getInstitutionId(),
						user.getEmpId());

				if (checkUserByEmpAndInst) {
					throw new Exception(" Employee ID (" + user.getEmpId() + ") already exists in the institution.");
				}
			}

			InstitutionExtraInfo extraInfo = institutionExtraInfoService
					.findAllByInstitutionId(user.getInstitutionId());
			if (extraInfo != null && (extraInfo.getUserLimit()
					.longValue() <= (extraInfo.getApproveUser().longValue() + extraInfo.getPendUser().longValue()))) {
				log.info("User limit is pass over the total user. \n User Limit:Total User:Institution Id=[{}:{}:{}]",
						extraInfo.getUserLimit(),
						extraInfo.getApproveUser().longValue() + extraInfo.getPendUser().longValue(),
						extraInfo.getInstitutionId());
				throw new RuntimeException("User Limit is Exits");
			}
			CF.fillInsert(user);
			user.setCreatorId(Long.valueOf(userId));
			user.setCreateDate(new Date());
//			user.setModDate(new Date());	

			user.setIpAddr(request.getRemoteAddr());
			user.setIpGateway(request.getHeader("X-Forwarded-For"));
			user.setUserModId(Long.valueOf(userId));
			user.setUserVer(0);
			if (userRepo.count() < 1) {
				user.setAllowLogin(1);
			}
			if (user.getUserType().equals(Str.INTERNAL_USER)) {
				user.setPassword(encryptPassword(decryptPassword(defaultAdPass)));
			} else {
				user.setFirstLogin(1);
			}

//			user.setFirstLogin(1);
			user.setUserStatus(Str.PEND_APPROVE);

			user = userRepo.save(user);
			// audit table
			saveAuditData(user);

			if (presetApp) {
				assignApp(userAppService.all(), user);
			}

			// here for external user need to set there pass & question

			if (user.getUserType().equals(Str.EXTERNAL_USER)) {
				UserLink ul = userLinkService.save(user, Str.MAKE_NEW_USER, null);

//				sendingMail2User(user, ul);

			}

//			message.getPayload().add(user);
		}

		else {
			throw new Exception("Duplicate User (" + user.getLoginName() + ") Email is already existing.");
		}

		ArrayList<User> userList = new ArrayList<>();
		userList.add(user);

		saveNewUserRole(user.getRoleList(), user, userId);

		return userList;
	}

	private void sendingResendPassword(User user, String pass) {
		log.info("Sending extUser creation mail");

		try {
			if (user.getEmail() != null) {

				Runnable rn = () -> {
					mailTempleteService.sendResendPassMail(user, pass, Arrays.asList(MailType.RESEND_PASSWORD));

//					(user, pass,
//							Arrays.asList(MailType.FIRST_LOGING_FIRST_MAIL, MailType.FIRST_LOGING_SECOUND_MAIL));
				};

				Thread th = new Thread(rn);

				th.start();
			} else {
				log.error("sending email is not found");
			}

		} catch (Exception e) {
			log.info("getting error: {}", e.getMessage());
		}

	}

	private void sending1stLonigMail2User(User user, UserLink ul, String pass) {

		// sending mail
		log.info("Sending extUser creation mail");
//		String email = getUserMail(user.getUserId());
		if (user.getEmail() != null) {

			Runnable rn = () -> {
				mailTempleteService.sentMail4FirstLogin(user, pass, ul,
						Arrays.asList(MailType.FIRST_LOGING_FIRST_MAIL, MailType.FIRST_LOGING_SECOUND_MAIL));
			};

			Thread th = new Thread(rn);

			th.start();

//sdk
		} else {
			log.error("sending email is not found");
		}

	}

	private void sendingMail2User(User user, UserLink ul, String pass) {

		// sending mail
		log.info("Sending extUser creation mail");
//		String email = getUserMail(user.getUserId());
		User dbUser = userRepo.findByUserIdAndActive(user.getUserId(), 1);
		if (dbUser != null) {

			mailTempleteService.sentMailExUser(dbUser, ul.getLink(), pass);

		} else {
			log.error("sending email is not found");
		}
	}

	public String mailAttemptMsg(String username) {

		if (!isLoginAttemptEnable() || username.equals("softcafe")) {
			return "";
		}
		SConfiguration conf = sConfigurationService.select3(SConfig.APPLICATION_SUTUP, SConfig.LOGIN,
				SConfig.BLOCK_LOGIN_ATTEMPT);
		if (conf == null) {
			return "";
		}

		if (StringUtils.isBlank(conf.getValue1())) {
			return "";
		}

		List<Login> fails = loginRepo.findByLoginNameAndFailResolvedAndLogin(username, 0, 1);
		log.info("Fail count for the user [{}]:[{}]", username, fails.size());

		int threshhold = Integer.parseInt(conf.getValue1());
		// #LEFT_COUNT# out of #TOTAL#

		String msg = attemptBeforeMsg + "\n"
				+ loginAttemptLeftMsg.replace("#LEFT_COUNT#", Integer.toString((threshhold - fails.size())))
						.replace("#TOTAL#", Integer.toString(threshhold));
		return msg;

	}

	public boolean shouldBlockUser(String username, SConfiguration conf) {
//		SConfiguration conf = sConfigurationService.select3(SConfig.APPLICATION_SUTUP, SConfig.LOGIN,
//				SConfig.BLOCK_LOGIN_ATTEMPT);

		if (!isLoginAttemptEnable() || username.equals("softcafe")) {
			return false;
		}

		if (conf == null) {
			return false;
		}

		if (StringUtils.isBlank(conf.getValue1())) {
			return false;
		}

		List<Login> fails = loginRepo.findByLoginNameAndFailResolvedAndLogin(username, 0, 1);
		log.info("Fail counf for the user [{}]:[{}]", username, fails.size());

//        int threshhold = allowLoginAttempts;
		int threshhold = Integer.parseInt(conf.getValue1());

		if (threshhold == 0) {
			return false;
		}

		if (fails.size() >= threshhold) {
			return true;
		} else {
			return false;
		}

	}

	protected void updateFaildLoginAttempt(String userName) {
		List<Login> fails = loginRepo.findByLoginNameAndFailResolvedAndLogin(userName, 0, 1);
		log.info("Fail counf for the user [{}]:[{}]", userName, fails.size());

		if (fails.size() > 0) {
			fails.forEach(e -> {
				e.setFailResolved(1);
			});

			loginRepo.saveAll(fails);
		}

	}

	private boolean isLoginAttemptEnable() {
		SConfiguration conf = sConfigurationService.select3(SConfig.APPLICATION_SUTUP, SConfig.LOGIN,
				SConfig.ENABLE_LOGIN_ATTEMPT);
		if (conf == null) {
			return false;
		}
		log.info("Login attempt value [{}]", conf.getValue1());
		if (conf.getValue1() == null) {
			return false;
		}

		if (conf.getValue1().equals("false")) {
			return false;
		}
		log.info("Login attempt enable [{}]", conf.getValue1());
		return true;
	}

	private List<User> approveRole(Message<List<User>> message, String actionType) {

		try {
			User user = message.getPayload().get(0);

			List<Role> roleList = user.getRoleList();

			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(user.getUserId(), USER,
					roleList.get(0).getRoleId(), ROLE, 1);
			if (map != null) {
				map.setStatus("APPROVED");
				map.setApproveById(user.getUserId());
				map.setApproveTime(new Date());
				gm.save(map);
			}

			return selectSingleWithRole(message, ActionType.SELECT_SINGLE.toString());

		} catch (Exception e) {
			e.printStackTrace();
			log.info("Error! [{}]", e);
			return null;
		}

	}

	private List<User> approveDeAssign(Message<List<User>> message, String actionType) {

		try {
			User user = message.getPayload().get(0);

			List<Role> roleList = user.getRoleList();

			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(user.getUserId(), USER,
					roleList.get(0).getRoleId(), ROLE, 1);
			if (map != null) {
				map.setStatus(null);
				map.setActive(0);
				gm.save(map);
			}

			return selectSingleWithRole(message, ActionType.SELECT_SINGLE.toString());

		} catch (Exception e) {
			e.printStackTrace();
			log.info("Error! [{}]", e);
			return null;
		}

	}

	public List<User> findAllUser() {

//		return userRepo.findAllByUserTypeAndActive(Str.EXTERNAL_USER, 1);
		return userRepo.findAllByActive(1);
	}

	public void createUserByRequest(String userRequestForm, Long userId) throws Exception {
		log.info("try to create user from json:[{}]", userRequestForm);
		try {
			RequestFormModle rfm = gson.fromJson(userRequestForm, RequestFormModle.class);
			log.info("getting user value from json. \n user email:name=[{}:{}]", rfm.getEmail(), rfm.getName());

//			User rfm = gson.fromJson(userRequestForm, User.class);
//			rfm.getDob();
			buildNewUser(rfm, userId);

		} catch (Exception e) {
			log.info("getting error: {}", e.getMessage());
			throw new Exception(e.getMessage());
		}

	}

	public void userByRequest(String userRequestForm, Long userId, String userStatus) throws Exception {
		log.info("try to create user from json:[{}]", userRequestForm);
		try {
			RequestFormModle rfm = gson.fromJson(userRequestForm, RequestFormModle.class);
			log.info("getting user value from json. \n user email:name=[{}:{}]", rfm.getEmail(), rfm.getName());

			User usr = findUser(rfm);

			if (StringUtils.equals(userStatus, usr.getUserStatus())) {
				log.info("user is already in {}. userId ={}", userStatus, usr.getUserId());
				throw new RuntimeException("User is already in " + block2Camel(userStatus) + ".");
			}

			else if (userStatus.equals(Str.PEND_ACTIVE) && usr.getUserStatus().equals(Str.ACTIVE)) {
				log.info("user is already in active. userId ={}", usr.getUserId());
				throw new RuntimeException("User is already in active.");
			} else if (userStatus.equals(Str.PEND_INACTIVE) && usr.getUserStatus().equals(Str.IN_ACTIVE)) {
				log.info("user is already in in-active. userId ={}", usr.getUserId());
				throw new RuntimeException("User is already in inactive.");
			}
			if (userStatus.equals(Str.PEND_ACTIVE)) {
				usr.setOldAllowLogin(usr.getAllowLogin());
				usr.setAllowLogin(0);
			} else if (userStatus.equals(Str.PEND_INACTIVE)) {
				usr.setOldAllowLogin(usr.getAllowLogin());
				usr.setAllowLogin(1);
			}
			usr.setUserStatus(userStatus);
			usr.setUserModId(userId);

			userRepo.save(usr);

		} catch (Exception e) {
			log.info("getting error: {}", e.getMessage());
			throw new Exception(e.getMessage());
		}

	}

	private String block2Camel(String userStatus) {
		String formattedStatus = userStatus.replace("_", " ");
		String[] words = formattedStatus.split(" ");
		StringBuilder result = new StringBuilder();

		for (String word : words) {
			result.append(word.substring(0, 1).toUpperCase()).append(word.substring(1).toLowerCase()).append(" ");
		}

		return result.toString().trim();
	}

	private User findUser(RequestFormModle rfm) {
		User usr = userRepo.findByEmailAndNidAndActive(rfm.getEmail(), rfm.getNid(), 1);
		if (usr == null) {
			log.info("user not found for email:nid=[{}:{}]", rfm.getEmail(), rfm.getNid());
			throw new UsernameNotFoundException("User not found.");
		}
		return usr;
	}

	private void buildNewUser(RequestFormModle rfm, Long userId) throws Exception {
		User user = new User();
		user.setEmail(rfm.getEmail());
		user.setLoginName(rfm.getEmail());
		user.setAllowLogin(0);
		user.setNid(rfm.getNid());
		user.setDesignation(rfm.getDesignation());
//		user.setDivision(rfm.getDivision());
		user.setPhoneNumber(rfm.getPhoneNumber());
		user.setDob(rfm.getDob());
		user.setInstitutionId(rfm.getInstitutionId());
		user.setEmpId(rfm.getEmployeeId());

		user.setFullName(rfm.getName());

		String[] splt = rfm.getName().split(" ", 2);
		user.setFirstName(splt[0]);
		if (splt.length > 1) {
			user.setLastName(splt[1]);
		}
		user.setUserType(Str.EXTERNAL_USER);

		makeNewUser(user, userId);
	}

	private User ldapLoginNameCheck(Message<List<User>> message, String actionType) throws Exception {
		User user = message.getPayload().get(0);

		try {
			User usr = userRepo.findByLoginNameAndActive(user.getLoginName(), 1);
			String uname = user.getLoginName();

			if (usr != null) {
				throw new Exception("User already Exists");
			}

			User ldapUser = ldapService.validateUser(uname);

			return ldapUser;

		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}

	}

	public User findUserByEmail(String email) {
		log.info("finding user information by email: {}", email);
		return userRepo.findByEmailAndActive(email, 1);
	}

	public List<User> findAllExternalActiveUser() {

		return userRepo.findAllByUserTypeAndAllowLoginAndActive(Str.EXTERNAL_USER, 1, 1);
	}

	public String saveUserProfileImg(MultipartFile[] files, Long userId) throws Exception {
		if (userId == null) {
			log.info("userId not found: [{}]", userId);
			throw new Exception("User Id not found.");
		}
		log.info("save user profile for userId: [{}]", userId);
		int T = files.length;
		User usr = findUserById(userId);

		while (T-- > 0) {
			String destPath = Utils.saveFile2Dir(files[T], profileImageBasePath);

			usr.setProfileImage(destPath);

			userRepo.save(usr);

		}
		String st = Utils.file2Base64(usr.getProfileImage());

		return st;
	}

	private User loadImage(Message<List<User>> requestMessage, String actionType) throws IOException {
		User usr = userRepo.findByUserIdAndActive(requestMessage.getHeader().getUserId().longValue(), 1);

		if (usr.getProfileImage() == null) {
			return null;
		}

		usr.setProfileImage(Utils.file2Base64(usr.getProfileImage()));

		return usr;

	}

	public UserListView findUser(Long userId) {
		// TODO Auto-generated method stub
		return userListViewRepo.findById(userId).get();
	}

}
