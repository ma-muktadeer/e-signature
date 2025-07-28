package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.core.model.SConfiguration;
import com.softcafe.esignature.entity.SecurityQuestionAnswer;

public interface SecurityQuestionAnswerRepo extends JpaRepository<SecurityQuestionAnswer, Long> {
	
	List<SecurityQuestionAnswer> findAllByUserId(Long userId);

	SecurityQuestionAnswer findByUserIdAndQuestionIdAndQuestionAnswer(Long userId, Long questionId, String questionAnswer);
	
	SecurityQuestionAnswer findAllByQuestionAnswerAndUserIdAndQuestionId(String questionAns, Long userId, Long questionId);

	List<SecurityQuestionAnswer> findAllByQuestionIdAndUserIdAndActive(Long securityQuestionId, Long userId, int i);

	SecurityQuestionAnswer findAllByQuestionAnswerAndQuestionIdAndUserIdAndActive(String questionAnswer, Long questionId, Long userId, int i);


}
