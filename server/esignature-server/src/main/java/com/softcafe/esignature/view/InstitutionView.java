package com.softcafe.esignature.view;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(name = "VW_INSTITUTION")
public class InstitutionView {
	

	@Id
	@Column(name = "ID_INSTITUTION_KEY")
	private Long institutionId;

	@Column(name = "TX_NAME", length = 128)
	private String institutionName;
	
	@Column(name = "TX_TYPE", length = 128)
	private String type;
	
	@Column(name = "TX_STATUS", length = 128)
	private String status;
	
	@Column(name = "INT_NUMBER_USER")
	private Integer numberUser;
	
	@Column(name = "INT_NUMBER_GEN_USER")
	private Integer numberGenUser = 0;
	
	@Column(name = "TX_DOMAIN")
	private String domain;
	
	@Column(name = "int_own_institution")
	private int ownInstitution;
	
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
	
	@Transient
	private int pageNumber = 1;
	@Transient
	private int pageSize = 20;
	public Long getInstitutionId() {
		return institutionId;
	}
	public void setInstitutionId(Long institutionId) {
		this.institutionId = institutionId;
	}
	public String getInstitutionName() {
		return institutionName;
	}
	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Integer getNumberUser() {
		return numberUser;
	}
	public void setNumberUser(Integer numberUser) {
		this.numberUser = numberUser;
	}
	public Integer getNumberGenUser() {
		return numberGenUser;
	}
	public void setNumberGenUser(Integer numberGenUser) {
		this.numberGenUser = numberGenUser;
	}
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public int getOwnInstitution() {
		return ownInstitution;
	}
	public void setOwnInstitution(int ownInstitution) {
		this.ownInstitution = ownInstitution;
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

	

}
