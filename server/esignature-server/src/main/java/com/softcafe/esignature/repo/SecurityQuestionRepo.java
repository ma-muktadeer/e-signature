package com.softcafe.esignature.repo;

import com.softcafe.esignature.entity.SecurityQuestion;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SecurityQuestionRepo extends JpaRepository<SecurityQuestion, Long> {

	@Query(value = "SELECT new com.softcafe.esignature.entity.SecurityQuestion(S.securityQuestionId, S.securityQuestion, S.active) from SecurityQuestion S WHERE "
			+ " S.active = :i")
	List<SecurityQuestion> findAllByActive(int i);
	
	@Query(value = "SELECT new com.softcafe.esignature.entity.SecurityQuestion(S.securityQuestionId, S.securityQuestion, S.active) from SecurityQuestion S WHERE "
			+ " S.active = :i AND S.securityQuestionId in :ids")
	List<SecurityQuestion> findAllByIdAndActive(List<Long> ids, int i);

	SecurityQuestion findAllBySecurityQuestionIdAndActive(Long securityQuestionId, int i);
}
