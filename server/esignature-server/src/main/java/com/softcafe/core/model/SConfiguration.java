package com.softcafe.core.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.hibernate.annotations.DynamicUpdate;

import com.softcafe.mapper.BaseDbBeanMap;

@SuppressWarnings("serial")
@Entity
@Table(name="T_CONFIGURATION")
@DynamicUpdate
public class SConfiguration extends BaseEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CONFIGURATION_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "CONFIGURATION_SEQ", allocationSize = 1, name = "CONFIGURATION_SEQ") //for oracle
	private Long configId;
	private Long configVer;
	
	private String configGroup;
	private String configSubGroup;
	private String configName;
	private String value1;
	private String value2;
	private String value3;
	private String value4;
	private String value5;
	
	private String comments;
	private String notes;
	
	@Column(name= "ID_SECURITY_QUESTION_KEY")
	private int securityQuestionId;
	
	@Transient
	private List<SConfiguration> requestData = new ArrayList<SConfiguration>();
	@Transient
	private List<String> configNameList = new ArrayList<String>();
	
	@Transient
	private String password;
	
	@Transient
	private String encDecFlag;
	
	public SConfiguration() {
		super();
	}
	
	public SConfiguration(Long configId, int active, Long creatorId, String configGroup, String configSubGroup, int securityQuestionId, 
			String value1, String value5) {
		super.active = active;
		super.creatorId = creatorId;
		this.configId = configId;
		this.configGroup = configGroup;
		this.configSubGroup = configSubGroup;
		this.value1 = value1;
		this.value5 = value5;
		this.securityQuestionId = securityQuestionId;
	}



	public Long getConfigId() {
		return configId;
	}
	public void setConfigId(Long configId) {
		this.configId = configId;
	}
	public Long getConfigVer() {
		return configVer;
	}
	public void setConfigVer(Long configVer) {
		this.configVer = configVer;
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
	public String getConfigName() {
		return configName;
	}
	public void setConfigName(String configName) {
		this.configName = configName;
	}
	public String getValue1() {
		return value1;
	}
	public void setValue1(String value1) {
		this.value1 = value1;
	}
	public String getValue2() {
		return value2;
	}
	public void setValue2(String value2) {
		this.value2 = value2;
	}
	public String getValue3() {
		return value3;
	}
	public void setValue3(String value3) {
		this.value3 = value3;
	}
	public String getValue4() {
		return value4;
	}
	public void setValue4(String value4) {
		this.value4 = value4;
	}
	public String getValue5() {
		return value5;
	}
	public void setValue5(String value5) {
		this.value5 = value5;
	}
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}

	public int getSecurityQuestionId() {
		return securityQuestionId;
	}

	public void setSecurityQuestionId(int securityQuestionId) {
		this.securityQuestionId = securityQuestionId;
	}
	public List<SConfiguration> getRequestData() {
		return requestData;
	}
	public void setRequestData(List<SConfiguration> requestData) {
		this.requestData = requestData;
	}
	public List<String> getConfigNameList() {
		return configNameList;
	}
	public void setConfigNameList(List<String> configNameList) {
		this.configNameList = configNameList;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEncDecFlag() {
		return encDecFlag;
	}
	public void setEncDecFlag(String encDecFlag) {
		this.encDecFlag = encDecFlag;
	}

	
	
}
