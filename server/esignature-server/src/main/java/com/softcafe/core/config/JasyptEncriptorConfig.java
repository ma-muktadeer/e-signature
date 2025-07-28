package com.softcafe.core.config;

import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class JasyptEncriptorConfig {
	
	@Bean(name="jasyptStringEncryptor")
	public StringEncryptor jasyptEncriptor() {
		
		PooledPBEStringEncryptor encriptor=new PooledPBEStringEncryptor();
		SimpleStringPBEConfig config=new SimpleStringPBEConfig();
		config.setPassword("softcafe");
		config.setAlgorithm("PBEWithMD5AndDES");
		config.setKeyObtentionIterations(100);
		config.setPoolSize("1");
		config.setProviderName("SunJCE");
		config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
		config.setStringOutputType("base64");
		encriptor.setConfig(config);
		
		return encriptor;
	}
	
	@Bean
	public PasswordEncoder encoder() {
	    return new BCryptPasswordEncoder();
	}

}
