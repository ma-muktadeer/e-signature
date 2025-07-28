package com.softcafe.esignature.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "VIEW_AGREEMENT_FILE_INFO")
public class AgreementFileInfo {

	@Id
	@Column(name = "id_document_files_key")
	private Long agreementFileId;
	
	@Column(name = "id_config_key")
	private Long configId;
	
	@Column(name = "CONFIG_GROUP")
	private String configGroup;
	
	@Column(name = "CONFIG_SUB_GROUP")
	private String configSubGroup;

	@Column(name = "is_active")
	protected Integer active = 1;

	@Column(name = "TX_STATUS")
	private String status;
	
	@Column(name = "TX_FILE_NAME")
	private String fileName;
	

	@Column(name = "TX_FILE_PATH")
	private String filePath;

	@Column(name = "TX_OBJECT_TYPE")
	private String objectType;
	
	@Column(name = "ID_CREATE_BY")
	private Long creatorId;

	@Column(name = "DT_CREATE")
	private Date createDate;
	

	@Transient
	private String generalNoticFileName;

	@Transient
	private MultipartFile generalNotic;

	@Transient
	private String instructionFileName;

	@Transient
	private MultipartFile instruction;

	@Transient
	private MultipartFile legalDisclaimer;

	@Transient
	private String base64File;
	

	public Long getAgreementFileId() {
		return agreementFileId;
	}

	public void setAgreementFileId(Long agreementFileId) {
		this.agreementFileId = agreementFileId;
	}

	public Long getConfigId() {
		return configId;
	}

	public void setConfigId(Long configId) {
		this.configId = configId;
	}

	public String getConfigGroup() {
		return configGroup;
	}

	public void setConfigGroup(String configGroup) {
		this.configGroup = configGroup;
	}

	public String getConfigSubGroup() {
		return configSubGroup;
	}

	public void setConfigSubGroup(String configSubGroup) {
		this.configSubGroup = configSubGroup;
	}

	public Integer getActive() {
		return active;
	}

	public void setActive(Integer active) {
		this.active = active;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getObjectType() {
		return objectType;
	}

	public void setObjectType(String objectType) {
		this.objectType = objectType;
	}

	public Long getCreatorId() {
		return creatorId;
	}

	public void setCreatorId(Long creatorId) {
		this.creatorId = creatorId;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getGeneralNoticFileName() {
		return generalNoticFileName;
	}

	public void setGeneralNoticFileName(String generalNoticFileName) {
		this.generalNoticFileName = generalNoticFileName;
	}

	public MultipartFile getGeneralNotic() {
		return generalNotic;
	}

	public void setGeneralNotic(MultipartFile generalNotic) {
		this.generalNotic = generalNotic;
	}

	public String getInstructionFileName() {
		return instructionFileName;
	}

	public void setInstructionFileName(String instructionFileName) {
		this.instructionFileName = instructionFileName;
	}

	public MultipartFile getInstruction() {
		return instruction;
	}

	public void setInstruction(MultipartFile instruction) {
		this.instruction = instruction;
	}

	public String getBase64File() {
		return base64File;
	}

	public void setBase64File(String base64File) {
		this.base64File = base64File;
	}

	public MultipartFile getLegalDisclaimer() {
		return legalDisclaimer;
	}

	public void setLegalDisclaimer(MultipartFile legalDisclaimer) {
		this.legalDisclaimer = legalDisclaimer;
	}
	
	
}
