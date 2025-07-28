package com.softcafe.esignature.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "T_PUBLIC_LINK")
public class PublicLink {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "REQ_LINK_GEN")
	@SequenceGenerator(name = "REQ_LINK_GEN", sequenceName = "REQ_LINK_SEQ", allocationSize = 1)
	@Column(name="ID_PUBLIC_LINK_KEY")
	private Long publicLinckId;
	
	@Column(name="ID_REQUEST_KEY")
	private Long requestId;
	
	@Column(name = "TX_PA", length = 56)
	private String pa;
	
	@Column(name = "TX_SENDING_EMAIL", length = 96)
	private String lnkSendingEmail;
	
	@Column(name = "TX_LINK_TYPE", length = 56)
	private String linkType;
	
	@Column(name = "TX_LINK_STATUS", length = 56)
	private String linkStatus;
	
	@Column(name = "TX_PUBLIC_LINK", length = 96)
	private String publicLink;
	

	@Column(name = "DT_START")
	private Date startDate;
	@Column(name = "DT_EXPIRE")
	private Date expireDate;
	
	@Column(name = "IS_VIEW_LINK")
	private Integer viewLink = 0;
	
	@Column(name = "DT_VIEW_TIME")
	private Date viewTime;

	@Column(name = "ID_REQUESTED_USR_INSTITUTION")
	private Long requestedUsrInstiturion;

	@Transient
	private String image64;


	public Long getPublicLinckId() {
		return publicLinckId;
	}

	public void setPublicLinckId(Long publicLinckId) {
		this.publicLinckId = publicLinckId;
	}

	public Long getRequestId() {
		return requestId;
	}

	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}

	public String getPa() {
		return pa;
	}

	public void setPa(String pa) {
		this.pa = pa;
	}

	public String getLnkSendingEmail() {
		return lnkSendingEmail;
	}

	public void setLnkSendingEmail(String lnkSendingEmail) {
		this.lnkSendingEmail = lnkSendingEmail;
	}

	public String getLinkType() {
		return linkType;
	}

	public void setLinkType(String linkType) {
		this.linkType = linkType;
	}

	public String getLinkStatus() {
		return linkStatus;
	}

	public void setLinkStatus(String linkStatus) {
		this.linkStatus = linkStatus;
	}

	public String getPublicLink() {
		return publicLink;
	}

	public void setPublicLink(String publicLink) {
		this.publicLink = publicLink;
	}

	public Date getExpireDate() {
		return expireDate;
	}

	public void setExpireDate(Date expireDate) {
		this.expireDate = expireDate;
	}


	public Date getViewTime() {
		return viewTime;
	}

	public void setViewTime(Date viewTime) {
		this.viewTime = viewTime;
	}

	public Long getRequestedUsrInstiturion() {
		return requestedUsrInstiturion;
	}

	public void setRequestedUsrInstiturion(Long requestedUsrInstiturion) {
		this.requestedUsrInstiturion = requestedUsrInstiturion;
	}

	public Integer getViewLink() {
		return viewLink;
	}

	public void setViewLink(Integer viewLink) {
		this.viewLink = viewLink;
	}

	public String getImage64() {
		return image64;
	}

	public void setImage64(String image64) {
		this.image64 = image64;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	
	
}
