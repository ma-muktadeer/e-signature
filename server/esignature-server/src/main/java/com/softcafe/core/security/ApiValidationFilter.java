package com.softcafe.core.security;

import java.io.IOException;
import java.util.function.Function;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Component
public class ApiValidationFilter extends OncePerRequestFilter {

	@Autowired
	private RequestMappingHandlerMapping handlerMapping;

	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			// Check if a handler exists for the incoming request
			HandlerExecutionChain handler = handlerMapping.getHandler(request);
			if (handler == null) {
				throw new NoHandlerFoundException(request.getMethod(), request.getRequestURI(),
						new ServletServerHttpRequest(request).getHeaders());
			}
			
			String userAgent = request.getHeader("User-Agent");
			if (!isBrowser.apply(userAgent)) {
				response.getWriter().write("Access denied. Unauthorized request.");
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				return;
			}
			
			filterChain.doFilter(request, response);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			response.getWriter().write("API endpoint not found");
		}

	}
	
	Function<String, Boolean> isBrowser = (userAgent) -> {
		if (StringUtils.isEmpty(userAgent)) {
			return false;
		} else {
			return userAgent.contains("Mozilla") || userAgent.contains("Chrome") || userAgent.contains("Safari")
					|| userAgent.contains("Firefox") || userAgent.contains("Edge");
		}
	};

}
