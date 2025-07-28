package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="VW_SIGNATURE_HISTORY_REPORT")
public class SignatureHistoryReportView extends ReportBase{
	
	@Column(name = "TX_NAME")
	private String userName;
	
	@Column(name = "TX_PA")
	private String pa;

	
	@Column(name = "DTT_SIGNATURE_CREATE")
	private Date signatureCreateDate;
	
	@Column(name = "DTT_AGREEMENT_FILE")
	private Date agreementFileDate;
	
	@Column(name = "DTT_APPROVAL_FILE")
	private Date approvalFileDate;
	
	
	@Column(name = "DTT_UPDATE")
	private Date updateDate;

	
	@Column(name = "DTT_UPDATE_IMAGE")
	private Date updateImageDate;

	public String getUserName() {
		return userName;
	}


	public void setUserName(String userName) {
		this.userName = userName;
	}


	public String getPa() {
		return pa;
	}


	public void setPa(String pa) {
		this.pa = pa;
	}


	public Date getSignatureCreateDate() {
		return signatureCreateDate;
	}


	public void setSignatureCreateDate(Date signatureCreateDate) {
		this.signatureCreateDate = signatureCreateDate;
	}


	public Date getAgreementFileDate() {
		return agreementFileDate;
	}


	public void setAgreementFileDate(Date agreementFileDate) {
		this.agreementFileDate = agreementFileDate;
	}


	public Date getApprovalFileDate() {
		return approvalFileDate;
	}


	public void setApprovalFileDate(Date approvalFileDate) {
		this.approvalFileDate = approvalFileDate;
	}


	public Date getUpdateDate() {
		return updateDate;
	}


	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}


	public Date getUpdateImageDate() {
		return updateImageDate;
	}


	public void setUpdateImageDate(Date updateImageDate) {
		this.updateImageDate = updateImageDate;
	}
	
	
	
	

}
