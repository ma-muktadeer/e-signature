package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "VW_RPT_SINGATURE")
public class SignatureReportView extends ReportBase{
	@Column(name = "ID_USER_CREATE_KEY")
	private Long userCreateKey;
	
	@Column(name = "TX_FULL_NAME")
	private String fullName;
	
	@Column(name = "TX_PA")
	private String pa;
	
	@Column(name = "TX_NAME")
	private String paHolderName;
	
	@Column(name = "TX_MAKER_NAME")
	private String makerName;
	
	@Column(name = "TX_CHECKER_NAME")
	private String checkerName;
	
	@Column(name = "DTT_PA_CREATE")
	private Date createDate;
	
	@Column(name = "DTT_SIGNATURE_CREATE")
	private Date signatureCreateDate;
	
	@Column(name = "DTT_EFFECTIVE_DATE")
	private Date effectiveDate;
	
	@Column(name = "TX_SIGNATURE_STATUS")
	private String signatureStatus;
	
	@Column(name = "DT_INACTIVE_TIME")
	private Date inactiveTime;
	
	@Column(name = "DT_AUTHORIZE_TIME")
	private Date authorizeTime;
	
	@Column(name = "DTT_SIGNATURE_AUTH")
	private Date signatureAuth;


	public Date getAuthorizeTime() {
		return authorizeTime;
	}


	public void setAuthorizeTime(Date authorizeTime) {
		this.authorizeTime = authorizeTime;
	}


	@Column(name = "DT_CANCEL_TIME")
	private Date cancelTime;
	
	@Column(name = "DTT_AGREEMENT_FILE")
	private Date agreementFileDate;
	
	@Column(name = "DTT_APPROVAL_FILE")
	private Date approvalFileDate;
	
	@Column(name = "DTT_DELETE")
	private Date deleteDate;

	@Column(name = "DT_CANCEL_CERCULAR")
	private Date cancelCircularUploadDate;

	public Long getUserCreateKey() {
		return userCreateKey;
	}


	public void setUserCreateKey(Long userCreateKey) {
		this.userCreateKey = userCreateKey;
	}


	public String getFullName() {
		return fullName;
	}


	public void setFullName(String fullName) {
		this.fullName = fullName;
	}


	public String getPa() {
		return pa;
	}


	public void setPa(String pa) {
		this.pa = pa;
	}


	public Date getCreateDate() {
		return createDate;
	}


	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}


	public Date getSignatureCreateDate() {
		return signatureCreateDate;
	}


	public void setSignatureCreateDate(Date signatureCreateDate) {
		this.signatureCreateDate = signatureCreateDate;
	}


	public Date getEffectiveDate() {
		return effectiveDate;
	}


	public void setEffectiveDate(Date effectiveDate) {
		this.effectiveDate = effectiveDate;
	}


	public String getSignatureStatus() {
		return signatureStatus;
	}


	public void setSignatureStatus(String signatureStatus) {
		this.signatureStatus = signatureStatus;
	}


	public Date getInactiveTime() {
		return inactiveTime;
	}


	public void setInactiveTime(Date inactiveTime) {
		this.inactiveTime = inactiveTime;
	}


	public Date getCancelTime() {
		return cancelTime;
	}


	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
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


	public Date getDeleteDate() {
		return deleteDate;
	}


	public void setDeleteDate(Date deleteDate) {
		this.deleteDate = deleteDate;
	}


	public Date getCancelCircularUploadDate() {
		return cancelCircularUploadDate;
	}


	public void setCancelCircularUploadDate(Date cancelCircularUploadDate) {
		this.cancelCircularUploadDate = cancelCircularUploadDate;
	}


	public String getPaHolderName() {
		return paHolderName;
	}


	public void setPaHolderName(String paHolderName) {
		this.paHolderName = paHolderName;
	}


	public String getMakerName() {
		return makerName;
	}


	public void setMakerName(String makerName) {
		this.makerName = makerName;
	}


	public String getCheckerName() {
		return checkerName;
	}


	public void setCheckerName(String checkerName) {
		this.checkerName = checkerName;
	}


	public Date getSignatureAuth() {
		return signatureAuth;
	}


	public void setSignatureAuth(Date signatureAuth) {
		this.signatureAuth = signatureAuth;
	}
	
	

}
