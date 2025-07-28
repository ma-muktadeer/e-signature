package com.softcafe.esignature.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import com.softcafe.esignature.model.SignatureDownloadType;

@Entity
@Table(name="T_SIGNATURE_DOWNLOAD_INFO")
public class SignatureDownloadInfo {
	

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SIGNATURE_DOWNLOAD_SQL") //for oracle
    @SequenceGenerator(sequenceName = "SIGNATURE_DOWNLOAD_SQL", allocationSize = 1, name = "SIGNATURE_DOWNLOAD_SQL") //for oracle
    @Column(name = "ID_SIGNATURE_DOWNLOAD_KEY")
    private Long signatureDownId;
    
    @Column(name = "ID_SIGNATURE_KEY")
    private Long signatureId;
    
    @Column(name = "ID_USER_KEY")
    private Long downloadBy;
    
    @Column(name = "ID_SIGNATORY_KEY")
    private Long signatoryId;
    
    @Column(name = "DTT_DOCUMENT_DATE")
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date documentDate;
    
    @Column(name="TX_DOWNLOAD_TYPE", length = 36, nullable = false)
    @Enumerated(EnumType.STRING)
    private SignatureDownloadType downloadType;
    
    @Column(name="TX_INSTITUTION_NAME", length = 124)
    private String institutionName;
    
    
    @Column(name="TX_REFERRAL_NUMBER", length = 56)
    private String referralNumber;
    
    @Column(name="TX_REMARK", length = 564)
    private String remark;
    
    @Transient
    private List<MultipartFile> file;

	public Long getSignatureDownId() {
		return signatureDownId;
	}

	public void setSignatureDownId(Long signatureDownId) {
		this.signatureDownId = signatureDownId;
	}

	public Long getSignatureId() {
		return signatureId;
	}

	public void setSignatureId(Long signatureId) {
		this.signatureId = signatureId;
	}

	public Long getDownloadBy() {
		return downloadBy;
	}

	public void setDownloadBy(Long downloadBy) {
		this.downloadBy = downloadBy;
	}

	public Long getSignatoryId() {
		return signatoryId;
	}

	public void setSignatoryId(Long signatoryId) {
		this.signatoryId = signatoryId;
	}

	public Date getDocumentDate() {
		return documentDate;
	}

	public void setDocumentDate(Date documentDate) {
		this.documentDate = documentDate;
	}

	public SignatureDownloadType getDownloadType() {
		return downloadType;
	}

	public void setDownloadType(SignatureDownloadType downloadType) {
		this.downloadType = downloadType;
	}

	public String getInstitutionName() {
		return institutionName;
	}

	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}

	public String getReferralNumber() {
		return referralNumber;
	}

	public void setReferralNumber(String referralNumber) {
		this.referralNumber = referralNumber;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public List<MultipartFile> getFile() {
		return file;
	}

	public void setFile(List<MultipartFile> file) {
		this.file = file;
	}

	
    
    
    
}
