package com.softcafe.esignature.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;

import com.softcafe.esignature.utils.ActivityType;

@Table(name="VIEW_ACTIVITY_LOG")
@Entity
public class ViewActivityLog {
	
	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "VIEW_ACTIVITY_LOG_GEN")
//	@SequenceGenerator(name = "VIEW_ACTIVITY_LOG_GEN", sequenceName = "VIEW_ACTIVITY_LOG_SEQ", allocationSize = 1)
	@Column(name = "ID_VIEW_ACTIVITY_KEY")
	private Long viewActivityLogId;
	
	@Column(name = "id_user_key")
	private Long userId;
	
	@Column(name = "DTT_ACTIVITY")
	private Date activityTime;
	
	@Column(name = "tx_activity_type", length = 64)
	@Enumerated(EnumType.STRING)
	private ActivityType activityType;
	
	@Column(name = "TX_LINK_SENDING_EMAIL", length = 80)
	private String linkSendingEmail;
	
	@Column(name = "tx_desc", length = 80)
	private String desc;

	@Column(name = "tx_source_ip", length = 16)
	private String sourceIp;
	
	@Column(name = "tx_gateway_ip", length = 16)
	private String gatewayId;
	
	@Column(name = "DT_CANCEL_EFFECTIVE_DATE")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date cancelEffectiveDate;
	
	@Column(name = "DT_CANCEL_TIME")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date cancelTime;

	@Column(name = "DT_INACTIVE_TIME")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date inactiveTime;


	@Column(name = "DTT_EFFECTIVE_DATE")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date effictiveDate;
	
	@Column(name = "ID_SIGNATURE_INFO_KEY")
	private Long signatureInfoId;

	@Column(name = "IS_MAIN_SIGNATURE")
	private Integer isMainSignature;


	@Column(name = "TX_ADDRESS")
	private String address;

	@Column(name = "TX_CANCEL_CAUSE")
	private String calcelCause;

	@Column(name = "TX_DEPARTMENT")
	private String department;

	@Column(name = "TX_DESIGNATION")
	private String designation;

	@Column(name = "TX_USER_EMAIL")
	private String email;

	@Column(name = "TX_PA")
	private String pa;

	@Column(name = "TX_NAME")
	private String name;
	
	@Column(name = "TX_REJECTION_CAUSE")
	private String rejectionCause;
	
	@Column(name = "TX_SIGNATURE_STATUS")
	private String signatureStatus;

	@Column(name = "TX_SIGNATURE_TYPE")
	private String signatureType;

	public Long getViewActivityLogId() {
		return viewActivityLogId;
	}

	public void setViewActivityLogId(Long viewActivityLogId) {
		this.viewActivityLogId = viewActivityLogId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public ActivityType getActivityType() {
		return activityType;
	}

	public void setActivityType(ActivityType activityType) {
		this.activityType = activityType;
	}

	public String getLinkSendingEmail() {
		return linkSendingEmail;
	}

	public void setLinkSendingEmail(String linkSendingEmail) {
		this.linkSendingEmail = linkSendingEmail;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getSourceIp() {
		return sourceIp;
	}

	public void setSourceIp(String sourceIp) {
		this.sourceIp = sourceIp;
	}

	public String getGatewayId() {
		return gatewayId;
	}

	public void setGatewayId(String gatewayId) {
		this.gatewayId = gatewayId;
	}

	public Date getCancelEffectiveDate() {
		return cancelEffectiveDate;
	}

	public void setCancelEffectiveDate(Date cancelEffectiveDate) {
		this.cancelEffectiveDate = cancelEffectiveDate;
	}

	public Date getCancelTime() {
		return cancelTime;
	}

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	public Date getInactiveTime() {
		return inactiveTime;
	}

	public void setInactiveTime(Date inactiveTime) {
		this.inactiveTime = inactiveTime;
	}

	public Date getEffictiveDate() {
		return effictiveDate;
	}

	public void setEffictiveDate(Date effictiveDate) {
		this.effictiveDate = effictiveDate;
	}

	public Long getSignatureInfoId() {
		return signatureInfoId;
	}

	public void setSignatureInfoId(Long signatureInfoId) {
		this.signatureInfoId = signatureInfoId;
	}

	public Integer getIsMainSignature() {
		return isMainSignature;
	}

	public void setIsMainSignature(Integer isMainSignature) {
		this.isMainSignature = isMainSignature;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCalcelCause() {
		return calcelCause;
	}

	public void setCalcelCause(String calcelCause) {
		this.calcelCause = calcelCause;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
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

	public String getRejectionCause() {
		return rejectionCause;
	}

	public void setRejectionCause(String rejectionCause) {
		this.rejectionCause = rejectionCause;
	}

	public String getSignatureStatus() {
		return signatureStatus;
	}

	public void setSignatureStatus(String signatureStatus) {
		this.signatureStatus = signatureStatus;
	}

	public String getSignatureType() {
		return signatureType;
	}

	public void setSignatureType(String signatureType) {
		this.signatureType = signatureType;
	}

	public Date getActivityTime() {
		return activityTime;
	}

	public void setActivityTime(Date activityTime) {
		this.activityTime = activityTime;
	}

	

	

}
