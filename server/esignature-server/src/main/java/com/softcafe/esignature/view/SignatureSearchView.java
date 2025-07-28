package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "VW_RPT_SINGATURE_SEARCH")
public class SignatureSearchView{
	@Id
	@Column(name = "ID_SIGNATURE_SEARCH_KEY")
	private Long signatureKey;
	
	@Column(name = "TX_SEARCH_USER_NAME")
	private String searchUserName;
	
	@Column(name = "DTT_ACTIVITY")
	private Date activityTime;
	
	@Column(name = "TX_ACTIVITY_TYPE")
	private String activityType;
	
	@Column(name = "TX_SEARCH_BY")
	private String searchBy;
	
	@Column(name = "TX_SEARCH_TEXT")
	private String searchText;

	@Column(name = "TX_STATUS")
	private String status;
	
	@Column(name = "TX_SOURCE_IP")
	private String sourceIP;
	
	@Column(name = "TX_INSTITUTION_NAME")
	private String institutionName;
	
	@Column(name = "TX_BRANCH_NAME")
	private String branchName;

	public Long getSignatureKey() {
		return signatureKey;
	}

	public void setSignatureKey(Long signatureKey) {
		this.signatureKey = signatureKey;
	}

	public String getSearchUserName() {
		return searchUserName;
	}

	public void setSearchUserName(String searchUserName) {
		this.searchUserName = searchUserName;
	}

	public Date getActivityTime() {
		return activityTime;
	}

	public void setActivityTime(Date activityTime) {
		this.activityTime = activityTime;
	}

	public String getActivityType() {
		return activityType;
	}

	public void setActivityType(String activityType) {
		this.activityType = activityType;
	}

	public String getSearchBy() {
		return searchBy;
	}

	public void setSearchBy(String searchBy) {
		this.searchBy = searchBy;
	}

	public String getSearchText() {
		return searchText;
	}

	public void setSearchText(String searchText) {
		this.searchText = searchText;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getSourceIP() {
		return sourceIP;
	}

	public void setSourceIP(String sourceIP) {
		this.sourceIP = sourceIP;
	}

	public String getInstitutionName() {
		return institutionName;
	}

	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}

	public String getBranchName() {
		return branchName;
	}

	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}
	
	
	
}
