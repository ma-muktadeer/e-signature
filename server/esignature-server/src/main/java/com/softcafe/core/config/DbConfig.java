package com.softcafe.core.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import com.delfian.core.jdbc.factory.JdbcStatementFactory;
import com.delfian.core.jdbc.service.JdbcService;
import com.zaxxer.hikari.HikariDataSource;
public class DbConfig {
	
	@Autowired
	Environment env;
	

	@Autowired
	HikariDataSource dataSource;

	
	@Primary
	@Bean
	public JdbcService jdbcService() {
		JdbcService jdbcService = new JdbcService();
		jdbcService.setDataSource(dataSource);
		jdbcService.setTransactionManager(transactionManager());
		jdbcService.setJdbcStatementFactory(jdbcStatementFactory());
		return jdbcService;
	}
	
	
	
	@Bean
	JdbcStatementFactory jdbcStatementFactory() {
		JdbcStatementFactory f = new JdbcStatementFactory();
		return f;
	}
	
	
	@Bean
	DataSourceTransactionManager transactionManager (){
		DataSourceTransactionManager dataSourceTransactionManager = new DataSourceTransactionManager();
		dataSourceTransactionManager.setDataSource(dataSource);
		return dataSourceTransactionManager;
	}
	

}
