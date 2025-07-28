package com.softcafe.core.security;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JWTAuthorizationFilter extends OncePerRequestFilter {
	private final Logger log = LogManager.getLogger();
	
	@Value("${default.block.request.denied.msg:Too many requests. Please slow down.}")
	String defaultBlockRequestDeniedMsg;


	private static int requestLimit;

	private final String HEADER = "Authorization";
	private final String PREFIX = "Bearer ";
	
	
	@Autowired
	private SecurityService securityService;
	

	private final Map<String, AtomicUserInfo> requstUserInfo = new ConcurrentHashMap<>();
	private final long timeWindow = 1000;


	@PostConstruct
	public void init() {
		try {
			String m = FileUtils.readFileToString(ResourceUtils.getFile("classpath:file/blockUser.txt"),
					Charset.defaultCharset());
			log.info("limit vaue is=>{}", m);

			requestLimit = Integer.valueOf(m);
		} catch (Exception e) {
			log.info("getting error to convert limit value to integer=>{}", e.getMessage());
			requestLimit = 10;
		}

	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		try {
			
			log.info("filter request.");
			
//			String userAgent = request.getHeader("User-Agent");
//			if (!isBrowser.apply(userAgent)) {
//				response.getWriter().write("Access denied. Unauthorized request.");
//				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//				return;
//			}

			if (checkJWTToken(request, response)) {
				String jwtToken = request.getHeader(HEADER).replace(PREFIX, "");
				if(securityService.isTokenBlacklisted(jwtToken)) {
					log.info("request in block listed token.");
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().write("Un-Authorized request.");
					return;
				}
				String userId = request.getHeader("UserId");

				// now check is multiple request

//				add user request in first time
				requstUserInfo.putIfAbsent(userId, new AtomicUserInfo(new Date(), 1));

				if (isBlockReq(requstUserInfo, userId)) {
					updateRequestUserInfo(requstUserInfo, userId);
					log.info("request is block");
					response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
					response.getWriter().write(defaultBlockRequestDeniedMsg);
					return;
				} else {
					updateRequestUserInfo(requstUserInfo, userId);
				}

				Claims claims = JwtTokenService.validateToken(request);
//				validateClaims2Header(claims, userId);

				if (!StringUtils.equals(claims.get("UserId").toString(), userId)) {

					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED,
							"Unauthorized Request.");
					return;
				}

				if (claims.get("authorities") != null) {
					setUpSpringAuthentication(claims);
				} else {
					SecurityContextHolder.clearContext();
				}
			} else {
				SecurityContextHolder.clearContext();
			}
			chain.doFilter(request, response);

		} catch (ExpiredJwtException e) {
			response.setStatus(430);
			((HttpServletResponse) response).sendError(HttpServletResponse.SC_FORBIDDEN, "Session Expired");
			return;
		} catch (UnsupportedJwtException | MalformedJwtException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			((HttpServletResponse) response).sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
			return;
		}
	}

	private void updateRequestUserInfo(Map<String, AtomicUserInfo> requstUserInfo, String userId) {
		if (requstUserInfo.get(userId) == null) {
			return;
		}
		AtomicUserInfo atomicUserInfo = requstUserInfo.get(userId);

		if (new Date().getTime() - atomicUserInfo.getDate().getTime() < timeWindow) {
//			atomicUserInfo.set(new Date(), atomicUserInfo.getCount() + 1);
			atomicUserInfo.incrementCount();
		} else {
			requstUserInfo.remove(userId);
		}

	}

	private boolean isBlockReq(Map<String, AtomicUserInfo> requstUserInfo, String userId) {
		AtomicUserInfo atmUsr = requstUserInfo.get(userId);
		log.info("UserId:requestCounts =>[{},{}]", userId, atmUsr.getCount());
		return isBlockReq(atmUsr);
	}

	private boolean isBlockReq(AtomicUserInfo atomicUserInfo) {

		return new Date().getTime() - atomicUserInfo.getDate().getTime() < timeWindow
				&& atomicUserInfo.getCount() > requestLimit;
	}

	/**
	 * Authentication method in Spring flow
	 * 
	 * @param claims
	 */
	private void setUpSpringAuthentication(Claims claims) {
		@SuppressWarnings("unchecked")
		List<String> authorities = (List<String>) claims.get("authorities");

		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(claims.getSubject(), null,
				authorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
		SecurityContextHolder.getContext().setAuthentication(auth);

	}

	private boolean checkJWTToken(HttpServletRequest request, HttpServletResponse res) {
		String authenticationHeader = request.getHeader(HEADER);
		if (authenticationHeader == null || !authenticationHeader.startsWith(PREFIX))
			return false;
		return true;
	}

//	Function<String, Boolean> isBrowser = (userAgent) -> {
//		if (StringUtils.isEmpty(userAgent)) {
//			return false;
//		} else {
//			return userAgent.contains("Mozilla") || userAgent.contains("Chrome") || userAgent.contains("Safari")
//					|| userAgent.contains("Firefox") || userAgent.contains("Edge");
//		}
//	};

}
