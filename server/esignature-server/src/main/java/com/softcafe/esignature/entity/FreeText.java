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
@Table(name = "T_FREE_TEXT")
public class FreeText extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "FREE_TEXT_GEN")
	@SequenceGenerator(name = "FREE_TEXT_GEN", sequenceName = "FREE_TEXT_SEQ", allocationSize = 1)
	@Column(name = "ID_FREE_TEXT_KEY")
	private Long freeTextId;

	@Column(name = "TX_SUBJECT", length = 128)
	private String subject;

	@Column(name = "TX_BODY", length = 4000)
	private String body;

	@Column(name = "TX_REQ_BODY", length = 4000)
	private String reqBody;

	@Column(name = "TX_TYPE", length = 256)
	private String type;

	@Column(name = "TX_GROUP", length = 96)
	private String textGroup;
	
	@Column(name = "TX_STATUS")
	private String status;

//	@Transient
//	private String actionStatus;

	
	public Long getFreeTextId() {
		return freeTextId;
	}

	public void setFreeTextId(Long freeTextId) {
		this.freeTextId = freeTextId;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getReqBody() {
		return reqBody;
	}

	public void setReqBody(String reqBody) {
		this.reqBody = reqBody;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTextGroup() {
		return textGroup;
	}

	public void setTextGroup(String textGroup) {
		this.textGroup = textGroup;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

//	public String getActionStatus() {
//		return actionStatus;
//	}
//
//	public void setActionStatus(String actionStatus) {
//		this.actionStatus = actionStatus;
//	}


}
