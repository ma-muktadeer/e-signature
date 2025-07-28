package com.softcafe.esignature.entity;


import com.softcafe.core.model.BaseEntity;
import com.softcafe.core.model.SConfiguration;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

@Entity
@Table(name="T_SECURITY_QUESTION")
public class SecurityQuestion extends BaseEntity {


    @Id
    @Column(name="ID_SECURITY_QUESTION_KEY")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "SECURITY_GEN")
    @SequenceGenerator(name = "SECURITY_GEN", sequenceName = "SECURITY_SEQ", allocationSize = 1)
    private Long securityQuestionId;

    @Column(name="TX_SECURITY_QUESTION")
    private String securityQuestion;
   
    @Transient
    private String questionAnswer = "";
    
    @Transient
    private SecurityQuestion saveOrUpdateQuestion;
    
    @Transient
    private List<SecurityQuestion> allQuestion;
    
    @Transient
    private List<SConfiguration> questionAnsList = new ArrayList<SConfiguration>();    
    
    public SecurityQuestion() {
		super();
	}

	public SecurityQuestion(Long securityQuestionId, String securityQuestion, int active) {
		super.active = active;
		this.securityQuestionId = securityQuestionId;
		this.securityQuestion = securityQuestion;
	}



	public void setSecurityQuestionId(Long id_security_question_key) {
        this.securityQuestionId = id_security_question_key;
    }

    public Long getSecurityQuestionId() {
        return securityQuestionId;
    }

    public String getSecurityQuestion() {
        return securityQuestion;
    }

    public void setSecurityQuestion(String securityQuestion) {
        this.securityQuestion = securityQuestion;
    }
    
   

	public String getQuestionAnswer() {
		return questionAnswer;
	}

	public void setQuestionAnswer(String questionAnswer) {
		this.questionAnswer = questionAnswer;
	}

	public final SecurityQuestion getSaveOrUpdateQuestion() {
		return saveOrUpdateQuestion;
	}

	public void setSaveOrUpdateQuestion(SecurityQuestion saveOrUpdateQuestion) {
		this.saveOrUpdateQuestion = saveOrUpdateQuestion;
	}

	public List<SecurityQuestion> getAllQuestion() {
		return allQuestion;
	}

	public void setAllQuestion(List<SecurityQuestion> allQuestion) {
		this.allQuestion = allQuestion;
	}

	public List<SConfiguration> getQuestionAnsList() {
		return questionAnsList;
	}

	public void setQuestionAnsList(List<SConfiguration> questionAnsList) {
		this.questionAnsList = questionAnsList;
	}


	
}
