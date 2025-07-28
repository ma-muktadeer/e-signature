package com.softcafe.core.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;



@SuppressWarnings("serial")
@Entity
@Table(name="T_BRANCH")
public class Branch extends BaseEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BRANCH_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "BRANCH_SEQ", allocationSize = 1, name = "BRANCH_SEQ") //for oracle
	@Column(name = "id_branch_id")
	private Long branchId;
	@Column(name = "id_branch_ver")
	private Integer branchVer;
	
	@Column(name = "tx_name", length=56 )
	private String name;
	
	@Column(name = "tx_bic_code", length=56 )
	private String bicCode;
	
	@Column(name = "tx_address", length=124 )
	private String address;
	
	@Column(name = "TX_BRANCH_NAME", length=56 )
	private String branchName;
	
	@Column(name = "TX_AD_CODE", length=36 )
	private String adCode;
	
	@Column(name = "TX_ROUTING_NUMBER", length=36 )
	private String routingNumber;
	
	@Column(name = "TX_CBS_BRANCH_ID", length=36 )
	private String cbsBranchId;
	
	@Column(name = "INT_HEAD_OFFICE")
	private Integer headOffice;
	
	@Column(name = "TX_STATUS", length=36 )
	private String status;
	
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