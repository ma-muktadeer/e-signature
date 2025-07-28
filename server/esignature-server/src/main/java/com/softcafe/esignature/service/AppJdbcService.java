package com.softcafe.esignature.service;

import java.sql.Connection;
import java.sql.DriverManager;

import javax.annotation.PostConstruct;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
public class AppJdbcService {
	private static final Logger log = LogManager.getLogger(AppJdbcService.class);
	
	@Autowired
	Environment env;
	 
	private String url;
	private String username;
	private String password;
	private String driverClass;
	
	@PostConstruct
	public void init() {
		url = env.getProperty("spring.datasource.url");
		username = env.getProperty("spring.datasource.username");
		password = env.getProperty("spring.datasource.password");
		driverClass = env.getProperty("spring.datasource.driverClassName");
		
		log.info("URL [{}]", url);
	}
	
	
	public Connection getJdbcConnection() throws Exception {
		Class.forName(driverClass);
		log.info("Getting jdbc connection");
		Connection con = DriverManager.getConnection(url, username, password);
		log.info("Connection done");
		return con;
	}

}
