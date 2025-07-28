package com.softcafe.core.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@SuppressWarnings("serial")
@MappedSuperclass
public class BaseEntity implements Serializable{
	@Column(name = "tx_ip_addr")
	private String ipAddr;
	
	@Column(name = "TX_GATEWAY_IP")
	private String ipGateway;
	
	@Column(name = "is_active")
	protected Integer active = 1;
	
	@Column(name = "id_user_mod_key")
	protected Long userModId;
	
	@Column(name = "id_client_key")
	protected Long clientId;
	
	@Column(name = "id_user_create_key", updatable = false)
	protected Long creatorId;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "dtt_mod", nullable = false)
	@LastModifiedDate
	protected Date modDate = new Date();
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "dtt_create" , nullable = true, updatable = false)
	@CreatedDate
	protected Date createDate;
	
	@Column(name = "id_state_key" , nullable = true)
	protected Integer stateId;
	
	@Column(name = "id_event_key" , nullable = true)
	protected Integer eventId;
	
	
	@Column(name = "id_approved_by_id")
	protected Long approveById;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "dtt_approve")
	protected Date approveTime;
	
	
	@Transient
	protected Date fromDate;
	
	@Transient
	protected Date toDate;
	
	@Transient
	protected String stateName;
	
	
	
	protected static Map<String, String> bean2SqlMap = null;
	protected static Map<String, String> rs2BeanMap = null;
	
	public static final Map<String, String> getBaseBean2SqlMap() {

		if (bean2SqlMap == null) {
			bean2SqlMap = new ConcurrentHashMap<String, String>();

			bean2SqlMap.put("@is_active", "active");
			bean2SqlMap.put("@id_user_mod_key", "userModId");
			bean2SqlMap.put("@dtt_mod", "modDate");
			bean2SqlMap.put("@tx_create_by", "createBy");
			bean2SqlMap.put("@dtt_create", "createDate");
			bean2SqlMap.put("@tx_mod_by", "modifyBy");
			bean2SqlMap.put("@dtt_from", "fromDate");
			bean2SqlMap.put("@dtt_to", "toDate");
			bean2SqlMap.put("@id_user_create_key", "creatorId");
			bean2SqlMap.put("@id_event_key", "eventId");
			bean2SqlMap.put("@id_state_key", "stateId");
			bean2SqlMap.put("@tx_state_name", "stateName");
			
			
		}
		return bean2SqlMap;
	} 

	public static final Map<String, String> getBaseRs2BeanMap() {

		if (rs2BeanMap == null) {
			rs2BeanMap = new ConcurrentHashMap<String, String>();

			rs2BeanMap.put("is_active", "active");
			rs2BeanMap.put("id_user_mod_key", "userModId");
			rs2BeanMap.put("dtt_mod", "modDate");
			rs2BeanMap.put("tx_create_by", "createBy");
			rs2BeanMap.put("dtt_create", "createDate");
			rs2BeanMap.put("tx_mod_by", "modifyBy");
			rs2BeanMap.put("dtt_from", "fromDate");
			rs2BeanMap.put("dtt_to", "toDate");
			rs2BeanMap.put("id_user_create_key", "createorId");// to ensure backward compatibility
			
			rs2BeanMap.put("id_user_create_key", "creatorId");
			rs2BeanMap.put("id_event_key", "eventId");
			rs2BeanMap.put("id_state_key", "stateId");
			rs2BeanMap.put("tx_state_name", "stateName");
			
			
			
			
		}
		
		return rs2BeanMap;
	}

	public Integer getActive() {
		return active;
	}

	public void setActive(Integer active) {
		this.active = active;
	}

	public Long getUserModId() {
		return userModId;
	}

	public void setUserModId(Long userModId) {
		this.userModId = userModId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getCreatorId() {
		return creatorId;
	}

	public void setCreatorId(Long creatorId) {
		this.creatorId = creatorId;
	}

	public Date getModDate() {
		return modDate;
	}

	public void setModDate(Date modDate) {
		this.modDate = modDate;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Integer getStateId() {
		return stateId;
	}

	public void setStateId(Integer stateId) {
		this.stateId = stateId;
	}

	public Integer getEventId() {
		return eventId;
	}

	public void setEventId(Integer eventId) {
		this.eventId = eventId;
	}

	public Date getFromDate() {
		return fromDate;
	}

	public void setFromDate(Date fromDate) {
		this.fromDate = fromDate;
	}

	public Date getToDate() {
		return toDate;
	}

	public void setToDate(Date toDate) {
		this.toDate = toDate;
	}

	public String getStateName() {
		return stateName;
	}

	public void setStateName(String stateName) {
		this.stateName = stateName;
	}

	public Long getApproveById() {
		return approveById;
	}

	public void setApproveById(Long approveById) {
		this.approveById = approveById;
	}

	public Date getApproveTime() {
		return approveTime;
	}

	public void setApproveTime(Date approveTime) {
		this.approveTime = approveTime;
	}

	public String getIpAddr() {
		return ipAddr;
	}

	public void setIpAddr(String ipAddr) {
		this.ipAddr = ipAddr;
	}

	public String getIpGateway() {
		return ipGateway;
	}

	public void setIpGateway(String ipGateway) {
		this.ipGateway = ipGateway;
	}
	
	
}