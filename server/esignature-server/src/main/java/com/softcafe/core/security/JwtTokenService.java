package com.softcafe.core.security;

import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class JwtTokenService {

	private static final String HEADER = "Authorization";
	private static final String PREFIX = "Bearer ";
	
	public static Claims validateToken(HttpServletRequest request) {
		String jwtToken = request.getHeader(HEADER).replace(PREFIX, "");
		return Jwts.parser().setSigningKey(SecurityService.secret.getBytes()).parseClaimsJws(jwtToken).getBody();
	}

}
