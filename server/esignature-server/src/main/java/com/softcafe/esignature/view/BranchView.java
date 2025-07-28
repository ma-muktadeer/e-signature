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
@Table(name="VW_BRANCH")
public class BranchView {
	
	@Id
	@Column(name = "id_branch_id")
	private Long branchId;
	@Column(name = "id_branch_ver")
	private Integer branchVer;
	
	@Column(name = "tx_name")
	private String name;
	
	@Column(name = "tx_bic_code")
	private String bicCode;
	
	@Column(name = "tx_address")
	private String address;
	
	@Column(name = "TX_BRANCH_NAME")
	private String branchName;
	
	@Column(name = "TX_AD_CODE")
	private String adCode;
	
	@Column(name = "TX_ROUTING_NUMBER")
	private String routingNumber;
	
	@Column(name = "TX_CBS_BRANCH_ID")
	private String cbsBranchId;
	
	@Column(name = "INT_HEAD_OFFICE")
	private Integer headOffice;
	
	@Column(name = "TX_STATUS")
	private String status;
	
	@Column(name = "is_active")
	protected Integer active = 1;
	
	@Column(name = "id_user_mod_key")
	protected Long userModId;
	
	@Column(name = "id_client_key")
	protected Long clientId;
	
	@Column(name = "id_user_create_key")
	protected Long creatorId;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "dtt_mod")
	@LastModifiedDate
	protected Date modDate = new Date();
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "dtt_create" )
	@CreatedDate
	protected Date createDate;
	
	@Column(name = "id_state_key" )
	protected Integer stateId;
	
	@Column(name = "id_event_key" )
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
	public Long getBranchId() {
		return branchId;
	}
	public void setBranchId(Long branchId) {
		this.branchId = branchId;
	}
	public Integer getBranchVer() {
		return branchVer;
	}
	public void setBranchVer(Integer branchVer) {
		this.branchVer = branchVer;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBicCode() {
		return bicCode;
	}
	public void setBicCode(String bicCode) {
		this.bicCode = bicCode;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getBranchName() {
		return branchName;
	}
	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}
	public String getAdCode() {
		return adCode;
	}
	public void setAdCode(String adCode) {
		this.adCode = adCode;
	}
	public String getRoutingNumber() {
		return routingNumber;
	}
	public void setRoutingNumber(String routingNumber) {
		this.routingNumber = routingNumber;
	}
	public String getCbsBranchId() {
		return cbsBranchId;
	}
	public void setCbsBranchId(String cbsBranchId) {
		this.cbsBranchId = cbsBranchId;
	}
	public Integer getHeadOffice() {
		return headOffice;
	}
	public void setHeadOffice(Integer headOffice) {
		this.headOffice = headOffice;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
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
