package com.softcafe;

import javax.servlet.MultipartConfigElement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.util.unit.DataSize;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class SoftcafeServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SoftcafeServerApplication.class, args);
	}
	
	//for upload download file size configuration
		@Bean
		MultipartConfigElement multipartConfigElement() {
		    MultipartConfigFactory factory = new MultipartConfigFactory();
		    factory.setMaxFileSize(DataSize.ofBytes(512000000L));
		    factory.setMaxRequestSize(DataSize.ofBytes(512000000L));
		    return factory.createMultipartConfig();
		}

}
