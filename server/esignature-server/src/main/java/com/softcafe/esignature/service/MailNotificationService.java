package com.softcafe.esignature.service;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafe.esignature.entity.MailTemplete;
import com.softcafe.esignature.entity.MailTracker;
import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.utils.Str;

@Service
public class MailNotificationService {
	private static final Logger log = LoggerFactory.getLogger(MailNotificationService.class);

	@Autowired
	private MailTrackerService mailTrackerService;

	@Autowired
	private MailService mailService;

	public void sendUserNotification(MailTemplete mailTemplate, String mailAddress, String cc, String bcc,
			MailType mailType) {
		if (StringUtils.isBlank(mailAddress)) {
			return;
		}
		Thread th = new Thread(() -> {
			sendNotification2Async(mailTemplate, mailAddress, cc, bcc, mailType);
		});
		th.start();
	}

	private void sendNotification2Async(MailTemplete mailTemplate, String mailAddress, String cc, String bcc,
			MailType mailType) {
		MailTracker mt = null;
		if (mailTemplate == null) {
			log.info("MailTemplate is getting null value.");
		} else if (StringUtils.isBlank(mailAddress)) {
			log.info("Mial Address is getting null value.");
		} else {
			log.info("Sending mail to2: cc: bcc= {}:{}:\n{}", mailAddress, cc, bcc);
			try {
//				1st save mailTemplate to the mailTracker
				mt = mailTrackerService.saveNewMailTracker(mailTemplate, mailType);

//				try to send mail
				mailService.send(mt.getSubject(), mt.getBody(), mailAddress, cc, bcc);
				mailTrackerService.updateMailTracker(mt, Str.SUCCESSED, null);

			} catch (Exception e) {
				log.info("getting error to sending mail to:error:[{},{}\n{}]", mailAddress, e.getMessage(), e);
				mailTrackerService.updateMailTracker(mt, Str.FAILED, e.getMessage());
			}
		}
	}

	public void sendPaNotification() {

	}

	public void sendSignatureNotification() {

	}

	public void REQUEST() {

	}

}
