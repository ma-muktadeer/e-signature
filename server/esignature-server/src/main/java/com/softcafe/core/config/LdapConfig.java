package com.softcafe.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.ldap.repository.config.EnableLdapRepositories;
import org.springframework.ldap.core.ContextSource;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration
@EnableLdapRepositories
public class LdapConfig {
	
	@Value("${ldap.server:LDAP://dhakabank.com.bd}")
	String server;

	@Bean
	ContextSource contextSource() {

		LdapContextSource ldapContextSource = new LdapContextSource();
		ldapContextSource.setUrl(server);

		return ldapContextSource;
	}

	@Bean
	LdapTemplate ldapTemplate(ContextSource contextSource) {
		return new LdapTemplate(contextSource);
	}

}
