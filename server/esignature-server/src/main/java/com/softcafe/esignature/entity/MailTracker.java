package com.softcafe.esignature.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.softcafe.esignature.model.MailType;
import com.softcafe.esignature.utils.Str;

@Entity
@Table(name = "T_MAIL_TRACKER")
public class MailTracker {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "MAIL_TRACKER_GEN")
	@SequenceGenerator(name = "MAIL_TRACKER_GEN", sequenceName = "MAIL_TRACKER_SEQ", allocationSize = 1)
	@Column(name = "ID_MAIL_TRACKER_KEY")
	private Long mailTrackerId;
	
	@Column(name = "dtt_entry")
	private Date entryDate;
	
	@Column(name = "tx_subject", length = 227)
	private String subject;
	
	@Lob
	@Column(name = "TX_BODY", columnDefinition = "CLOB")
	private String body;
	
	@Column(name = "tx_type", length = 64)
	@Enumerated(EnumType.STRING)
	private MailType type;
	
	
	@Column(name = "tx_status", length = 32)
	private String status;
	
	
	@Column(name = "tx_error", length = 512)
	private String error;
	
	
	public MailTracker() {
	}

	public MailTracker(MailTemplete mailTemplate, MailType mailType) {
		// TODO Auto-generated constructor stub
		this.body = mailTemplate.getBody();
		this.subject = mailTemplate.getSubject();
		this.type = mailType;
		this.entryDate = new Date();
		this.status = Str.NEW;
	}



	public Long getMailTrackerId() {
		return mailTrackerId;
	}



	public void setMailTrackerId(Long mailTrackerId) {
		this.mailTrackerId = mailTrackerId;
	}



	public Date getEntryDate() {
		return entryDate;
	}



	public void setEntryDate(Date entryDate) {
		this.entryDate = entryDate;
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



	public MailType getType() {
		return type;
	}



	public void setType(MailType type) {
		this.type = type;
	}



	public String getStatus() {
		return status;
	}



	public void setStatus(String status) {
		this.status = status;
	}



	public String getError() {
		return error;
	}



	public void setError(String error) {
		this.error = error;
	}


	

}


