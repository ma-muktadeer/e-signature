package com.softcafe.core.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name="T_FILES")
public class DocumentFiles extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "FILES_GEN") //for oracle
	@SequenceGenerator(sequenceName = "FILES_GEN", allocationSize = 1, name = "FILES_GEN") //for oracle
	@Column(name = "id_document_files_key")
	private Long documetnFilesId;
	
//	DOCUMENTS_FILES_GEN
	@Column(name = "tx_group",length = 96)
	private String group;
	
	
	//ATTACHEMENT, UPLOADED
	@Column(name = "tx_source")
	private String source;
	
	
	@Column(name = "tx_file_name")
	private String fileName;
	
	@Column(name = "tx_note")
	private String note;
	
	@Column(name = "tx_file_path")
	private String filePath;
	
	//INSTRUCTION,TASK
	@Column(name = "id_object_key")
	private Long objectId;
	
	
	//INSTRUCTION,TASK
	@Column(name = "tx_object_type")
	private String objectType;
	
	@Column(name = "tx_status", length = 30)
	private String status;

	@Transient
	private List<String> configSubGroupList;
	

	@Transient
	private String configGroup;

	public Long getDocumetnFilesId() {
		return documetnFilesId;
	}


	public void setDocumetnFilesId(Long documetnFilesId) {
		this.documetnFilesId = documetnFilesId;
	}


	


	public String getGroup() {
		return group;
	}


	public void setGroup(String group) {
		this.group = group;
	}


	public String getSource() {
		return source;
	}


	public void setSource(String source) {
		this.source = source;
	}


	public String getFileName() {
		return fileName;
	}


	public void setFileName(String fileName) {
		this.fileName = fileName;
	}


	public String getNote() {
		return note;
	}


	public void setNote(String note) {
		this.note = note;
	}


	public String getFilePath() {
		return filePath;
	}


	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}


	public Long getObjectId() {
		return objectId;
	}


	public void setObjectId(Long objectId) {
		this.objectId = objectId;
	}


	public String getObjectType() {
		return objectType;
	}


	public void setObjectType(String objectType) {
		this.objectType = objectType;
	}


	public List<String> getConfigSubGroupList() {
		return configSubGroupList;
	}


	public void setConfigSubGroupList(List<String> configSubGroupList) {
		this.configSubGroupList = configSubGroupList;
	}


	public String getConfigGroup() {
		return configGroup;
	}


	public void setConfigGroup(String configGroup) {
		this.configGroup = configGroup;
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	@Override
	public String toString() {
		return "DocumentFiles [documetnFilesId=" + documetnFilesId + ", group=" + group + ", source=" + source
				+ ", fileName=" + fileName + ", note=" + note + ", filePath=" + filePath + ", objectId=" + objectId
				+ ", objectType=" + objectType + ", configSubGroupList=" + configSubGroupList + ", configGroup="
				+ configGroup + ", active=" + active + ", userModId=" + userModId + ", clientId=" + clientId
				+ ", creatorId=" + creatorId + ", modDate=" + modDate + ", createDate=" + createDate + ", stateId="
				+ stateId + ", eventId=" + eventId + ", approveById=" + approveById + ", approveTime=" + approveTime
				+ ", fromDate=" + fromDate + ", toDate=" + toDate + ", stateName=" + stateName + ", status=" +status
						+ "]";
	}

	
	
}
