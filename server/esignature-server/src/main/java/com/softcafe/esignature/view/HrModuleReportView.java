package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "VW_RPT_HR_MODULE")
public class HrModuleReportView {
	@Id
	@Column(name = "ID_HR_MODULE_KEY")
	private Long hrModuleKey;
	
	@Column(name = "ID_SIGNATORY_KEY")
	private Long signatoryKey;
	
	@Column(name = "TX_PA")
	private String pa;
	
	@Column(name = "TX_NAME")
	private String paHolderName;
	
	
	@Column(name = "ID_HR_MAKER_KEY")
	private Long hrMakerKey;
	
	@Column(name = "TX_HR_MAKER_NAME")
	private String hrMakerName;
	
	@Column(name = "ID_HR_CHECKER_KEY")
	private Long hrCheckerKey;
	
	@Column(name = "TX_HR_CHECKER_NAME")
	private String hrCheckerName;

	@Column(name = "DT_PA_CREATE")
	private Date paCreateDate;
	
	@Column(name = "DT_AGREEMENT_FILE")
	private Date agreementFile;


	@Column(name = "DT_APPROVER_FILE")
	private Date approverFile;
	
	@Column(name = "DT_CANCEL_FILE")
	private Date cancelFile;
	

	@Column(name = "DT_CANCEL_CERCULAR")
	private Date cancelCircularDate;
	
	@Column(name = "TX_CANCEL_CAUSE")
	private String cancelCaause;
	

	public Long getHrModuleKey() {
		return hrModuleKey;
	}

	public void setHrModuleKey(Long hrModuleKey) {
		this.hrModuleKey = hrModuleKey;
	}

	public Long getSignatoryKey() {
		return signatoryKey;
	}

	public void setSignatoryKey(Long signatoryKey) {
		this.signatoryKey = signatoryKey;
	}

	public Long getHrMakerKey() {
		return hrMakerKey;
	}

	public void setHrMakerKey(Long hrMakerKey) {
		this.hrMakerKey = hrMakerKey;
	}

//	public String getDownloaderKey() {
//		return downloaderKey;
//	}
//
//	public void setDownloaderKey(String downloaderKey) {
//		this.downloaderKey = downloaderKey;
//	}
	

	public Long getHrCheckerKey() {
		return hrCheckerKey;
	}

	public String getHrMakerName() {
		return hrMakerName;
	}

	public void setHrMakerName(String hrMakerName) {
		this.hrMakerName = hrMakerName;
	}

	public void setHrCheckerKey(Long hrCheckerKey) {
		this.hrCheckerKey = hrCheckerKey;
	}

	public String getHrCheckerName() {
		return hrCheckerName;
	}

	public void setHrCheckerName(String hrCheckerName) {
		this.hrCheckerName = hrCheckerName;
	}

	public Date getPaCreateDate() {
		return paCreateDate;
	}

	public void setPaCreateDate(Date paCreateDate) {
		this.paCreateDate = paCreateDate;
	}

	public Date getAgreementFile() {
		return agreementFile;
	}

	public void setAgreementFile(Date agreementFile) {
		this.agreementFile = agreementFile;
	}

	public Date getApproverFile() {
		return approverFile;
	}

	public void setApproverFile(Date approverFile) {
		this.approverFile = approverFile;
	}

	public Date getCancelFile() {
		return cancelFile;
	}

	public void setCancelFile(Date cancelFile) {
		this.cancelFile = cancelFile;
	}

	public Date getCancelCircularDate() {
		return cancelCircularDate;
	}

	public void setCancelCircularDate(Date cancelCircularDate) {
		this.cancelCircularDate = cancelCircularDate;
	}

	public String getCancelCaause() {
		return cancelCaause;
	}

	public void setCancelCaause(String cancelCaause) {
		this.cancelCaause = cancelCaause;
	}

	public String getPa() {
		return pa;
	}

	public void setPa(String pa) {
		this.pa = pa;
	}

	public String getPaHolderName() {
		return paHolderName;
	}

	public void setPaHolderName(String paHolderName) {
		this.paHolderName = paHolderName;
	}


	
	
	
	

}
