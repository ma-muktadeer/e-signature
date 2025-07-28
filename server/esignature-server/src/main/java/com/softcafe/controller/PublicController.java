package com.softcafe.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.GenericMessage;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.processor.service.ProcessorService;
import com.delfian.core.message.service.ServiceCoordinator;
import com.delfian.core.shared.constants.Constants;
import com.softcafe.constants.ActionType;
import com.softcafe.core.model.AppPermission;
import com.softcafe.core.model.LoginRes;
import com.softcafe.core.model.Role;
import com.softcafe.core.model.User;
import com.softcafe.core.security.SecurityService;
import com.softcafe.core.service.AppPermissionService;
import com.softcafe.core.service.UserService;
import com.softcafe.esignature.view.UserListView;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@CrossOrigin(origins = { "http://localhost:4200", "http://10.100.100.166:8080" }, allowCredentials = "true")
@RestController
@RequestMapping(value = "/public")
public class PublicController {
	private static final Logger log = LoggerFactory.getLogger(PublicController.class);
	private static final String VIA = "VIA";

	@Value("${jwt.exp.time:60}")
	public long tokenExpSec;
	
	@Autowired
	ProcessorService processorService;

	@Autowired
	ServiceCoordinator serviceCoordinator;

	@Autowired
	UserService userService;
	@Autowired
	SecurityService securityService;

	@Autowired
	AppPermissionService appPermissionService;

	@PostMapping(value = "/login")
	public ResponseEntity<?> login(@RequestBody String json, HttpServletRequest req) {

		log.trace("UI request \n{}", json);

		Message requestMessage = null;
		Message processedMessage = null;
		String serverResponse = null;
		try {
			requestMessage = processorService.fromJson(json);

			boolean isAuth = checkAuthRequest(req, requestMessage);

			if (!isAuth) {
				return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Unauthorized request.");
			}

			requestMessage.getHeader().setSenderSourceIPAddress(req.getRemoteAddr());
			requestMessage.getHeader().setSenderGatewayIPAddress(req.getHeader(VIA));
			String actionType = requestMessage.getHeader().getActionType();
			String content = requestMessage.getHeader().getContentType();

			if (actionType.equals(ActionType.ACTION_LOGIN.toString())) {
				return ResponseEntity.ok(handleLogin(requestMessage));
			}

		} catch (Exception e) {
			log.error("Exception processing message [{}]", e);
		}
		// return serverResponse;
		return ResponseEntity.ok(new LoginRes());
	}

	private boolean checkAuthRequest(HttpServletRequest req, Message requestMessage) {
		String ref = requestMessage.getHeader().getReferance();
		return StringUtils.isBlank(ref) || (StringUtils.isNotBlank(ref) && ref.matches("^[a-zA-Z0-9_-]+$"));
	}

	@RequestMapping(value = "/jsonRequest", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<?> handleJsonRequest(@RequestBody String json, HttpServletRequest req) {

		log.trace("UI request \n{}", json);

		Message requestMessage = null;
		Message processedMessage = null;
		String serverResponse = null;
		try {
			requestMessage = processorService.fromJson(json);

			boolean isAuth = checkAuthRequest(req, requestMessage);

			if (!isAuth) {
				return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Unauthorized request.");
			}
			requestMessage.getHeader().setSenderSourceIPAddress(req.getRemoteAddr());
			requestMessage.getHeader().setSenderGatewayIPAddress(req.getHeader(VIA));
			processedMessage = serviceCoordinator.service(requestMessage);

			processedMessage.getHeader().setSenderSourceIPAddress("");

			serverResponse = processorService.toJson(processedMessage);
		} catch (Exception e) {
			log.error("Exception processing message [{}]", e);
		}
		return ResponseEntity.ok(serverResponse);
	}

	@GetMapping(value = "/map/permission/role")
	public AppPermission permissionRole(@RequestParam("permissionId") long permissionId,
			@RequestParam("roleId") long roleId) {

		return appPermissionService.mapRoleToPermission(permissionId, roleId, 100000);
	}

	@GetMapping(value = "/map/permission/roles")
	public AppPermission permissionRoleS(@RequestParam("permissionId") long permissionId,
			@RequestParam("roleId") String roleId) {

		return appPermissionService.mapRoleToPermission(permissionId, roleId, 100000);
	}

	@GetMapping(value = "/map/permission/role/by/name")
	public AppPermission permissionRoleByName(@RequestParam("permissionName") String permissionName,
			@RequestParam("roleName") String roleName) {

		return appPermissionService.mapRoleToPermission(permissionName, roleName, 100000);
	}

	private LoginRes handleLogin(Message requestMessage) throws Exception {
		LoginRes login = new LoginRes();
		Message<?> res = userService.serviceSingle(requestMessage);
		log.info("Login");

		if (!res.getHeader().getStatus().equals(Constants.STATUS_OK)) {
			AbstractMessageHeader header = res.getHeader();
			GenericMessage m = new GenericMessage();
			header.setStatus(Constants.STATUS_ERROR);
			header.setSenderSourceIPAddress("");
			m.setHeader(header);
			login.setRes(m);
			return login;
		}
		login.setRes(res);

		List<UserListView> u = (List<UserListView>) res.getPayload();

		if (u == null || u.size() == 0) {
			return login;
		}

		UserListView user = u.get(0);

		long iss = System.currentTimeMillis();

		Date issuedAt = new Date(iss);
//		Date expAt = new Date(iss + SecurityService.tokenExpSec);
		Date expAt = new Date(iss + (tokenExpSec * 1000 * 60));

//		List<User> lu = (List<User>) res.getPayload();

		String token = getJWTToken(user.getUserId(), user.getLoginName(), user.getLoginId(), issuedAt, expAt,
				user.getRoleList());

		login.setToken(token);
		login.setExpireAt(expAt);
		login.setIssuedAt(issuedAt);
		login.setAuthenticated(true);

		login.setPermission(securityService.loadUserPermission(user.getUserId()));

		login.setRes(res);
		return login;
	}

	@PostMapping("register")
	public void register(@RequestBody User u) {

	}

	private String getJWTToken(Long userId, String username, Long loginId, Date issueAt, Date expAt, List<Role> roles) {

		List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
		String d = roles.stream().map(i -> i.getRoleName()).collect(Collectors.joining(","));
		grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList(d);

		Map<String, Object> clims = new HashMap<>();
		clims.put("authorities",
				grantedAuthorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
		clims.put("UserId", userId);
		clims.put("loginId", loginId);

		String token = Jwts.builder().setId("softcafeJWT").setSubject(username).addClaims(clims)
//				.claim("authorities", grantedAuthorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
				.setIssuedAt(issueAt).setExpiration(expAt)
				.signWith(SignatureAlgorithm.HS512, SecurityService.secret.getBytes()).compact();

		return "Bearer " + token;
	}

	@GetMapping(value = "/ping")
	public String ping() {
		log.info("calling ping {}", new Date());
		return "pong";
	}

}
