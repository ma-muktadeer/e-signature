package com.softcafe.esignature.entity;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.softcafe.core.model.BaseEntity;

@Entity
@Table(name = "T_QUESTION_ANSWER")
public class SecurityQuestionAnswer extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "QUESTION_ANSWER_GEN") // for oracle
	@SequenceGenerator(sequenceName = "QUESTION_ANSWEW_SQL", allocationSize = 1, name = "QUESTION_ANSWER_GEN") // for
																												// oracle
	@Column(name = "ID_SECURITY_QUESTION_KEY")
	private Long securityQuestionAnswerKey;
	
	@Column(name = "ID_USER_KEY")
	private Long userId;
	
	@Column(name = "ID_QUESTION_KEY")
	private Long questionId;
	
	
	@Column(name = "TX_QUESTION_ANSWER", length = 128)
	private String questionAnswer;
	
	@Transient
	private String securityQuestion;
	
	@Transient
	private Long securityQuestionId;
	
	public Long getSecurityQuestionAnswerKey() {
		return securityQuestionAnswerKey;
	}


	public void setSecurityQuestionAnswerKey(Long securityQuestionAnswerKey) {
		this.securityQuestionAnswerKey = securityQuestionAnswerKey;
	}


	public Long getUserId() {
		return userId;
	}


	public void setUserId(Long userId) {
		this.userId = userId;
	}


	public Long getQuestionId() {
		return questionId;
	}


	public void setQuestionId(Long questionId) {
		this.questionId = questionId;
	}


	public String getQuestionAnswer() {
		return questionAnswer;
	}


	public void setQuestionAnswer(String questionAnswer) {
		this.questionAnswer = questionAnswer;
	}


	public String getSecurityQuestion() {
		return securityQuestion;
	}


	public void setSecurityQuestion(String securityQuestion) {
		this.securityQuestion = securityQuestion;
	}


	public final Long getSecurityQuestionId() {
		return securityQuestionId;
	}


	public final void setSecurityQuestionId(Long securityQuestionId) {
		this.securityQuestionId = securityQuestionId;
	}


}
