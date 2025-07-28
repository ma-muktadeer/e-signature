package com.softcafe.esignature.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafe.esignature.entity.InstitutionExtraInfo;
import com.softcafe.esignature.repo.InstitutionExtraInfoRepo;

@Service
public class InstitutionExtraInfoService {
	
	@Autowired
	private InstitutionExtraInfoRepo institutionExtraInfoRepo;

	public InstitutionExtraInfo findAllByInstitutionId(Long institutionId) {
		
		return institutionExtraInfoRepo.findAllByInstitutionId(institutionId);
	}
	

}
