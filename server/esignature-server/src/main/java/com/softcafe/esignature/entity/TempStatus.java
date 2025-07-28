package com.softcafe.esignature.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "T_TEMP_STATUS")
public class TempStatus {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "TEMP_STATUS_GEN")
	@SequenceGenerator(name = "TEMP_STATUS_GEN", sequenceName = "TEMP_STATUS_SEQ", allocationSize = 1)
	@Column(name = "ID_TEMP_STATUS_KEY")
	private Long tempStatusId;
	
	private Long requestUserId;
	
	private Date requestTime;
	
	private String tempStatus;

	public Long getTempStatusId() {
		return tempStatusId;
	}

	public void setTempStatusId(Long tempStatusId) {
		this.tempStatusId = tempStatusId;
	}

	public Long getRequestUserId() {
		return requestUserId;
	}

	public void setRequestUserId(Long requestUserId) {
		this.requestUserId = requestUserId;
	}

	public Date getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(Date requestTime) {
		this.requestTime = requestTime;
	}

	public String getTempStatus() {
		return tempStatus;
	}

	public void setTempStatus(String tempStatus) {
		this.tempStatus = tempStatus;
	}
	
	

}
