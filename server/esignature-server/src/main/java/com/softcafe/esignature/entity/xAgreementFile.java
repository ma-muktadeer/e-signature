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

import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name="T_AGREEMENT")
public class xAgreementFile {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "AGREEMENT_FILES_GEN") //for oracle
    @SequenceGenerator(sequenceName = "AGREEMENT_FILES_GEN", allocationSize = 1, name = "AGREEMENT_FILES_REQ") //for oracle
	@Column(name = "id_document_files_key")
	private Long agreementFileId;
	
	@Column(name = "is_active")
	protected Integer active = 1;
	
	@Column(name = "ID_CREATE_BY")
	private Long creatorId;
	
	@Column(name = "DT_CREATE")
	private Date createDate;
	
	@Column(name = "TX_STATUS")
	private String status;
	
	@Transient
	private String generalNoticFileName;
	
	@Transient
	private MultipartFile generalNotic;
	
	@Transient 
	private String instructionFileName;
	
	@Transient 
	private MultipartFile instruction;
	

	@Transient 
	private String base64File;
	
	public Long getAgreementFileId() {
		return agreementFileId;
	}

	public void setAgreementFileId(Long agreementFileId) {
		this.agreementFileId = agreementFileId;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
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

	public Integer getActive() {
		return active;
	}

	public void setActive(Integer active) {
		this.active = active;
	}

	public String getBase64File() {
		return base64File;
	}

	public void setBase64File(String base64File) {
		this.base64File = base64File;
	}
	
	
	

}
