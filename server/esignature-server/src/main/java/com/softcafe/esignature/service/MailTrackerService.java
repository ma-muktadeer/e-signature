package com.softcafe.esignature.service;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafe.esignature.entity.MailTemplete;
import com.softcafe.esignature.entity.MailTracker;
import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.repo.MailTrackerRepo;

@Service
public class MailTrackerService {

	@Autowired
	private MailTrackerRepo mailTrackerRepo;
	
	public MailTracker saveNewMailTracker(MailTemplete mailTemplate, MailType mailType) {
		// TODO Auto-generated method stub
		MailTracker mt = new MailTracker(mailTemplate, mailType);
		return mailTrackerRepo.save(mt);
	}

	public void updateMailTracker(MailTracker mt, String status, String error) {
		// TODO Auto-generated method stub
		if(!StringUtils.isBlank(error)) {
			mt.setError(error);
		}
		mt.setStatus(status);
		mailTrackerRepo.save(mt);
	}

}
