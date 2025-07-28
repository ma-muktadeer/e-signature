package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "VIEW_DOWNLOAD_SIGNATURE")
public class DownloadReportView{

	@Id
	@Column(name = "ID_DOWNLOAD_SIGNATURE_KEY")
	private Long downloadSignatureKey;
	
	@Column(name = "TX_SEEKING_FOR")
	private String seekingFor;
	
	@Column(name = "TX_DOWNLOAD_PA")
	private String downloadPa;
	
	@Column(name = "ID_DOWNLOADER_KEY")
	private Long downloaderKey;
	
	@Column(name = "TX_DOWNLOADER_NAME")
	private String downloderName;
	
	@Column(name = "DT_DOWNLOAD")
	private Date downloadDate;

	@Column(name = "TX_ACTIVITY_TYPE")
	private String activityType;
	
	@Column(name = "TX_DOWNLOAD_TYPE")
	private String downloadType;


	@Column(name = "TX_LETTER_ISU_AUTH")
	private String letterIsuAuth;
	
	@Column(name = "TX_REMARK")
	private String remarks;
	

	@Column(name = "TX_LETTER_REF_NUM")
	private String letterRefNum;
	
	@Column(name = "DT_LETTER")
	private Date letterDate;

	public String getSeekingFor() {
		return seekingFor;
	}

	public void setSeekingFor(String seekingFor) {
		this.seekingFor = seekingFor;
	}

	public String getDownloadPa() {
		return downloadPa;
	}

	public void setDownloadPa(String downloadPa) {
		this.downloadPa = downloadPa;
	}

	public Long getDownloaderKey() {
		return downloaderKey;
	}

	public void setDownloaderKey(Long downloaderKey) {
		this.downloaderKey = downloaderKey;
	}

	public String getDownloderName() {
		return downloderName;
	}

	public void setDownloderName(String downloderName) {
		this.downloderName = downloderName;
	}

	public Date getDownloadDate() {
		return downloadDate;
	}

	public void setDownloadDate(Date downloadDate) {
		this.downloadDate = downloadDate;
	}

	public String getActivityType() {
		return activityType;
	}

	public void setActivityType(String activityType) {
		this.activityType = activityType;
	}

	public String getDownloadType() {
		return downloadType;
	}

	public void setDownloadType(String downloadType) {
		this.downloadType = downloadType;
	}

	public String getLetterIsuAuth() {
		return letterIsuAuth;
	}

	public void setLetterIsuAuth(String letterIsuAuth) {
		this.letterIsuAuth = letterIsuAuth;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getLetterRefNum() {
		return letterRefNum;
	}

	public void setLetterRefNum(String letterRefNum) {
		this.letterRefNum = letterRefNum;
	}

	public Date getLetterDate() {
		return letterDate;
	}

	public void setLetterDate(Date letterDate) {
		this.letterDate = letterDate;
	}

	public Long getDownloadSignatureKey() {
		return downloadSignatureKey;
	}

	public void setDownloadSignatureKey(Long downloadSignatureKey) {
		this.downloadSignatureKey = downloadSignatureKey;
	}

	
	
	
}
