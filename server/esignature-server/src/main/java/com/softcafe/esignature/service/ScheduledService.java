package com.softcafe.esignature.service;

import java.io.FileNotFoundException;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.softcafe.core.model.Login;
import com.softcafe.core.model.SConfiguration;
import com.softcafe.core.model.User;
import com.softcafe.core.service.UserService;
import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.utils.Str;

@Component
public class ScheduledService {
	private static final Logger log = LogManager.getLogger();
	
	@Value("${user.login.date.before.first.notification}")
	private int login1Notification;
	
	@Value("${user.login.date.before.secound.notification}")
	private int login2Notification;
	
	@Value("${user.pass.date.before.first.notification}")
	private int pass1Notification;
	
	@Value("${user.pass.date.before.secound.notification}")
	private int pass2Notification;
	@Autowired
	private UserService userService;
	
	@Autowired
	private MailTempleteService mailTempleteService;
	
	@Scheduled(cron = "${user.notification.schedule}")
	@Async
	public void userNotificationScheduler() throws FileNotFoundException {
		//checkUserActivation
		
		List<User> users = userService.findAllExternalActiveUser();
		if(!users.isEmpty()) {
			userLoginDate(users);
		}
	}

	private void userLoginDate(List<User> users) throws FileNotFoundException {
		
		for (User user : users) {
			if(userService.isLoginDateIn(user, login1Notification)) {
				//now sending 10 days mail to user
				log.info("sending user {} days login notification for user= {}", login1Notification, user.getLoginName());
				mailTempleteService.sendUserLoninMail(login1Notification, Str.USER, MailType.LOGING_NOTIFY_TEN.toString(), user);
//				mailTempleteService.sendUserMail(Str.USER, MailType.LOGING_NOTIFY_TEN.toString(), user);
			}
			else if(userService.isLoginDateIn(user, login2Notification)) {
				log.info("sending user {} days login notification for user= {}", login2Notification, user.getLoginName());
//				mailTempleteService.sendUserMail(Str.USER, MailType.LOGING_NOTIFY_SEVEN.toString(), user);
				mailTempleteService.sendUserLoninMail(login2Notification, Str.USER, MailType.LOGING_NOTIFY_SEVEN.toString(), user);

			}
			
			//pass change date
			if(userService.checkPasswordChangeDate(user, pass1Notification)) {
				log.info("sending user {} days password notification for user= {}", pass1Notification, user.getLoginName());
//				mailTempleteService.sendUserMail(Str.USER, MailType.PASS_NOTIFY_TEN.toString(), user);
				mailTempleteService.sendUserLoninMail(pass1Notification, Str.USER, MailType.PASS_NOTIFY_TEN.toString(), user);

			}
			else if(userService.checkPasswordChangeDate(user, pass2Notification)) {
				log.info("sending user {} days password notification for user= {}", pass2Notification, user.getLoginName());
//				mailTempleteService.sendUserMail(Str.USER, MailType.PASS_NOTIFY_SEVEN.toString(), user);
				mailTempleteService.sendUserLoninMail(pass2Notification, Str.USER, MailType.PASS_NOTIFY_SEVEN.toString(), user);

			}
		}
		
	}
}
