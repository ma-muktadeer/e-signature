package com.softcafe.esignature.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.softcafe.esignature.model.ViewActivityLog;
import com.softcafe.esignature.repo.ViewActivityLogRepo;

@Service
public class ViewActivityLogService {
	private static Logger log = LoggerFactory.getLogger(ViewActivityLog.class);

	@Autowired
	private ViewActivityLogRepo viewActivityLogRepo;
	
	
	public Page<ViewActivityLog> findAllActivityLog(Pageable pageable) {
		log.info("Finding all activity log");
		
		return viewActivityLogRepo.findAll(pageable);
	}

}
