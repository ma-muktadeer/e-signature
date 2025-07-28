package com.softcafe.esignature.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.softcafe.core.model.BaseEntity;

@Entity
@Table(name = "T_USER_LINK")
public class UserLink extends BaseEntity{

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "USER_LINK_GEN")
	@SequenceGenerator(name = "USER_LINK_GEN", sequenceName = "USER_LINK_SEQ", allocationSize = 1)
	@Column(name = "ID_USER_LINK_KEY")
	private Long userLinkId;
	
	@Column(name="ID_USER_KEY")
	private Long userId;
	
	@Column(name="ID_OTP_KEY")
	private Long otpId;
	
	@Column(name = "TX_LINK")
	private String link;
	

	@Column(name = "TX_LINK_TPYE", length = 56)
	private String linkType;
	
	@Column(name = "TX_STATUS", length = 56)
	private String status;
	
	@Column(name = "DT_EXPIRE")
	private Date expireDate;

	public Long getUserLinkId() {
		return userLinkId;
	}

	public void setUserLinkId(Long userLinkId) {
		this.userLinkId = userLinkId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public Date getExpireDate() {
		return expireDate;
	}

	public void setExpireDate(Date expireDate) {
		this.expireDate = expireDate;
	}

	public String getLinkType() {
		return linkType;
	}

	public void setLinkType(String linkType) {
		this.linkType = linkType;
	}

	public Long getOtpId() {
		return otpId;
	}

	public void setOtpId(Long otpId) {
		this.otpId = otpId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	
	
}
