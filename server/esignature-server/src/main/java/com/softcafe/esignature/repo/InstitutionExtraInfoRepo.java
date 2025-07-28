package com.softcafe.esignature.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.InstitutionExtraInfo;

public interface InstitutionExtraInfoRepo extends JpaRepository<InstitutionExtraInfo, Integer>{

	InstitutionExtraInfo findAllByInstitutionId(Long institutionId);

}
