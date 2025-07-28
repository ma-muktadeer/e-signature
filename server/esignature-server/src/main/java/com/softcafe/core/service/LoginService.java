package com.softcafe.core.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.softcafe.core.model.Login;
import com.softcafe.core.repo.LoginRepo;

@Service
public class LoginService {
	
	@Autowired
	LoginRepo loginRepo;

	public void markResolvedAttempt(String loginName) {
		List<Login> logins =new ArrayList<Login>();
		logins = loginRepo.findByLoginNameAndFailResolvedAndLogin(loginName, 0, 1);
		
		/*logins.forEach( i -> {
			i.setFailResolved(1);
		});*/
		
		for(Login i:logins) {
			i.setFailResolved(1);
		}
		
		loginRepo.saveAll(logins);
		//loginRepo.resolvedFailAttempt(new Date(), loginName);
	}

	public Login findFirstRecord(Long userId) {
		return loginRepo.findFirstByUserIdAndLoginTimeNotNull(userId, Sort.by("loginTime").descending());
	}

	public Login findByLoginId(Long loginId) {
		
		return loginRepo.findById(loginId).orElseThrow(()-> new UsernameNotFoundException("Login information is not found"));
	}

	public void update(Login lg, Date date, int i) {
		if(i == 1) {
			lg.setGenNoticeTime(date);
		}else if(i == 2) {
			lg.setMdNoticeTime(date);
		}
		
		loginRepo.save(lg);
		
		
	}

}
