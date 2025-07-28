package com.softcafe.esignature.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.softcafe.core.model.BaseEntity;

@Entity
@Table(name = "T_MAIL_TEMP")
public class MailTemplete extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "MAIL_TEMP_GEN")
	@SequenceGenerator(name = "MAIL_TEMP_GEN", sequenceName = "MAIL_TEMP_SEQ", allocationSize = 1)
	@Column(name = "ID_MAIL_TEMP_KEY")
	private Long mailTempId;

	@Column(name = "TX_SUBJECT", length = 128)
	private String subject;

	@Lob
	@Column(name = "TX_BODY", columnDefinition = "CLOB")
	private String body;

	@Column(name = "TX_REQ_SUBJECT", length = 128)
	private String reqSubject;

	@Lob
	@Column(name = "TX_REQ_BODY", columnDefinition = "CLOB")
	private String reqBody;

	@Column(name = "TX_TYPE", length = 256)
	private String type;

	@Column(name = "TX_GROUP", length = 96)
	private String group;

	@Column(name = "TX_STATUS", length = 56)
	private String status;

	@Column(name = "TX_UPDATE_STATUS", length = 56)
	private String updateStatus;

	@Column(name = "ID_AUTHORIZE_BY")
	private Long authorizeBy;

	@Column(name = "TX_AUTHORIZE_TIME")
	private Date authorizeDate;

	public Long getMailTempId() {
		return mailTempId;
	}

	public void setMailTempId(Long mailTempId) {
		this.mailTempId = mailTempId;
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

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getAuthorizeBy() {
		return authorizeBy;
	}

	public void setAuthorizeBy(Long authorizeBy) {
		this.authorizeBy = authorizeBy;
	}

	public Date getAuthorizeDate() {
		return authorizeDate;
	}

	public void setAuthorizeDate(Date authorizeDate) {
		this.authorizeDate = authorizeDate;
	}

	public String getUpdateStatus() {
		return updateStatus;
	}

	public void setUpdateStatus(String updateStatus) {
		this.updateStatus = updateStatus;
	}

	public String getReqSubject() {
		return reqSubject;
	}

	public void setReqSubject(String reqSubject) {
		this.reqSubject = reqSubject;
	}

}
