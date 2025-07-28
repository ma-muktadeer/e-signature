package com.softcafe.esignature.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.softcafe.core.model.BaseEntity;

@Entity
@Table(name = "T_INSTITUTION")
public class Institution extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "INSTITUTION_GEN")
	@SequenceGenerator(name = "INSTITUTION_GEN", sequenceName = "INSTITUTION_SEQ", allocationSize = 1)
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
	
//	
//	@Column(name = "INT_CHECKER_BY")
//	private Long checkerId;
//	
//	@Column(name = "DTT_CHECKER_DATE")
//	private Date checkerDate;
	
//	@Transient
//	private String institutionName;
	
//	@Transient
//	private List<Institution> requestInstitutionList;

//	public Long getCheckerId() {
//		return checkerId;
//	}
//
//	public void setCheckerId(Long checkerId) {
//		this.checkerId = checkerId;
//	}

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

	

//	public String getInstitutionName() {
//		return institutionName;
//	}
//
//	public void setInstitutionName(String institutionName) {
//		this.institutionName = institutionName;
//	}

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
	

//	public Date getCheckerDate() {
//		return checkerDate;
//	}
//
//	public void setCheckerDate(Date checkerDate) {
//		this.checkerDate = checkerDate;
//	}

//	public List<Institution> getRequestInstitutionList() {
//		return requestInstitutionList;
//	}
//
//	public void setRequestInstitutionList(List<Institution> requestInstitutionList) {
//		this.requestInstitutionList = requestInstitutionList;
//	}

	


}
