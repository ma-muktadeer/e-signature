package com.softcafe.core.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.SessionCookieConfig;
import javax.servlet.SessionTrackingMode;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.softcafe.core.repo.RoleRepo;
import com.softcafe.core.service.RoleService;

@EnableWebSecurity
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	private static final Logger log = LoggerFactory.getLogger(WebSecurityConfig.class);

	@Value("${public.base.url:/public/**}")
	private String publicBaseUrl;

	@Value("${public.base.url:**/secure/jsonRequest}")
	private String secureBaseUrl;

	@Value("${public.base.url:**/secure/admin/jsonRequest}")
	private String secureAdminBaseUrl;

	@Value("${server.cross.origin}")
	private List<String> applicationDomain;

	@Value("${server.cross.method}")
	private List<String> allowMethod;

	@Autowired
	RoleRepo roleRepo;

	@Autowired
	private ApiValidationFilter apiValidationFilter;

	@Autowired
	JWTAuthorizationFilter jwtAuthorizationFilter;

	@Autowired
	RoleService roleService;

	HttpSecurity http;

	@Override
	protected void configure(HttpSecurity http) throws Exception {

//		List<Role> roles = roleRepo.findAll();

//		List<String> rList = roles.stream().map(i -> i.getRoleName()).collect(Collectors.toList());
//		log.info("Role Count [{}]", roles.size());
		http.cors(crs -> crs.configurationSource(cs -> corsRequestFilter()))
				.csrf(csrf -> csrf.disable())
				.headers(headers -> headers.disable())
				.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
				.addFilterBefore(apiValidationFilter, UsernamePasswordAuthenticationFilter.class) 
		        .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class) 
		        .authorizeRequests(
						requests -> requests.antMatchers(publicBaseUrl).permitAll().anyRequest().authenticated())
				.exceptionHandling(handling -> handling.accessDeniedHandler(accessDeniedHandler()))

		;

		this.http = http;
	}

	@Bean
	public AccessDeniedHandler accessDeniedHandler() {
		return new CustomAccessDeniedHandler();
	}

//	@Bean
//	public RequestMappingHandlerMapping requestMappingHandlerMapping(ApplicationContext applicationContext) {
//		return applicationContext.getBean(RequestMappingHandlerMapping.class);
//	}
//	
//	@Bean
//    public JWTAuthorizationFilter jwtAuthorizationFilter() {
//        return new JWTAuthorizationFilter();
//    }

	@Bean
	public ServletContextInitializer servletContextInitializer() {
		return new ServletContextInitializer() {
			@Override
			public void onStartup(ServletContext servletContext) throws ServletException {
				servletContext.setSessionTrackingModes(Collections.singleton(SessionTrackingMode.COOKIE));
				SessionCookieConfig sessionCookieConfig = servletContext.getSessionCookieConfig();
				sessionCookieConfig.setHttpOnly(true);
				sessionCookieConfig.setSecure(true);
			}
		};
	}

	private CorsConfiguration corsRequestFilter() {
		CorsConfiguration config = new CorsConfiguration();

		config.setAllowedOrigins(applicationDomain);
		config.setAllowedMethods(allowMethod);
		config.addAllowedHeader("*");
		config.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
		config.setAllowCredentials(true);
		config.setMaxAge(3600L);
		return config;
	}
}

class CustomAccessDeniedHandler implements AccessDeniedHandler {
	private static final Logger log = LoggerFactory.getLogger(CustomAccessDeniedHandler.class);

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException exc)
			throws IOException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String roles = auth.getAuthorities().stream().map(i -> i.getAuthority()).collect(Collectors.joining(","));

		log.info("Access denied for the user with role [{}]:[{}]:[{}]:[{}]", auth.getPrincipal(),
				request.getRequestURI(), request.getRequestedSessionId(), roles);
		response.setStatus(HttpStatus.FORBIDDEN.value());
		response.getWriter().write("Access Denied");
	}
}