package com.softcafe.esignature.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafe.core.util.MailSender;

@Service(value = "mailService")
public class MailService {
	
	@Autowired
	MailConfig mailConfig;
	
	public  boolean send(String subject, String body, String to, final String cc, final String bcc) throws Exception{
		return MailSender.sendHtmlMail(subject, body, mailConfig, to, cc, bcc);
	}
	
	public  boolean send(String subject, String body, String to) throws Exception{
		return MailSender.sendHtmlMail(subject, body, mailConfig, to, null, null);
	}

}
