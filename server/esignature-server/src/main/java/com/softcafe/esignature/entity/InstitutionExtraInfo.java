package com.softcafe.esignature.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "VW_INSTITUTION_EXTRA_INFO")
public class InstitutionExtraInfo {
	
	@Id
	@Column(name = "ID_INSTITUTION_EXTRA_KEY")
	private int institutionExtraId;
	
	@Column(name = "USER_LIMIT")
	private Integer userLimit;
	@Column(name = "APPROVE_USER")
	private Integer approveUser;
	@Column(name = "PEND_USER")
	private Integer pendUser;
	@Column(name = "ID_INSTITUTION_KEY")
	private Long institutionId;
	
	
	
	public int getInstitutionExtraId() {
		return institutionExtraId;
	}
	public void setInstitutionExtraId(int institutionExtraId) {
		this.institutionExtraId = institutionExtraId;
	}
	
	public Integer getUserLimit() {
		return userLimit;
	}
	public void setUserLimit(Integer userLimit) {
		this.userLimit = userLimit;
	}
	public Integer getApproveUser() {
		return approveUser;
	}
	public void setApproveUser(Integer approveUser) {
		this.approveUser = approveUser;
	}
	public Integer getPendUser() {
		return pendUser;
	}
	public void setPendUser(Integer pendUser) {
		this.pendUser = pendUser;
	}
	public Long getInstitutionId() {
		return institutionId;
	}
	public void setInstitutionId(Long institutionId) {
		this.institutionId = institutionId;
	}
	
	
	

}
