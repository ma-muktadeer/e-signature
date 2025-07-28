package com.softcafe.esignature.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.softcafe.esignature.utils.ActivityType;

@Entity
@Table(name = "T_ACTIVITY_LOG")
public class ActivityLog {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ACTIVITY_LOG_GEN")
	@SequenceGenerator(name = "ACTIVITY_LOG_GEN", sequenceName = "ACTIVITY_LOG_SEQ", allocationSize = 1)
	@Column(name = "ID_ACTIVITY_LOG_KEY")
	private Long activityLogId;
	
	@CreatedDate
	@Column(name = "dtt_activity", updatable = false)
	private Date activityTime = new Date();
	
	@Column(name = "id_user_key")
	private Long userId;
	
	
	//this could be any object id, for signature view, it will be Signature table primary key,or any other
	@Column(name = "int_on_key")
	private Long onId;
	
	@Column(name = "tx_activity_type", length = 64)
	@Enumerated(EnumType.STRING)
	private ActivityType activityType;
	
	@Column(name = "tx_source_ip", length = 16)
	private String sourceIp;
	
	@Column(name = "tx_gateway_ip", length = 16)
	private String gatewayIp;
	
	
	@Column(name = "tx_email", length = 80)
	private String email;
	
	@Transient
	private int pageNumber = 1;
	
	@Transient
	private int pageSize = 10;
	@Transient
	String fromDate;
	@Transient
	String toDate;
	
	
	@Column(name = "tx_desc", length = 80)
	private String desc;
	
	@Column(name = "tx_pa", length = 16)
	private String pa;
	
	@Column(name = "tx_name", length = 64)
	private String name;

	@Column(name = "tx_status", length = 16)
	private String status;
	

	public Long getActivityLogId() {
		return activityLogId;
	}


	public void setActivityLogId(Long activityLogId) {
		this.activityLogId = activityLogId;
	}


	public Date getActivityTime() {
		return activityTime;
	}


	public void setActivityTime(Date activityTime) {
		this.activityTime = activityTime;
	}


	public Long getUserId() {
		return userId;
	}


	public void setUserId(Long userId) {
		this.userId = userId;
	}


	public Long getOnId() {
		return onId;
	}


	public void setOnId(Long onId) {
		this.onId = onId;
	}


	public ActivityType getActivityType() {
		return activityType;
	}


	public void setActivityType(ActivityType activityType) {
		this.activityType = activityType;
	}


	public String getSourceIp() {
		return sourceIp;
	}


	public void setSourceIp(String sourceIp) {
		this.sourceIp = sourceIp;
	}




	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public String getDesc() {
		return desc;
	}


	public void setDesc(String desc) {
		this.desc = desc;
	}


	public int getPageNumber() {
		return pageNumber;
	}


	public void setPageNumber(int pageNumber) {
		this.pageNumber = pageNumber;
	}


	public int getPageSize() {
		return pageSize;
	}


	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}


	public String getGatewayIp() {
		return gatewayIp;
	}


	public void setGatewayIp(String gatewayIp) {
		this.gatewayIp = gatewayIp;
	}


	public String getPa() {
		return pa;
	}


	public void setPa(String pa) {
		this.pa = pa;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public String getFromDate() {
		return fromDate;
	}


	public void setFromDate(String fromDate) {
		this.fromDate = fromDate;
	}


	public String getToDate() {
		return toDate;
	}


	public void setToDate(String toDate) {
		this.toDate = toDate;
	}


	@Override
	public String toString() {
		return "ActivityLog [activityLogId=" + activityLogId + ", activityTime=" + activityTime + ", userId=" + userId
				+ ", onId=" + onId + ", activityType=" + activityType + ", sourceIp=" + sourceIp + ", gatewayIp="
				+ gatewayIp + ", email=" + email + ", pageNumber=" + pageNumber + ", pageSize=" + pageSize + ", desc="
				+ desc + ", pa=" + pa + ", name=" + name + ", status=" + status + "]";
	}


	
	
	

}
