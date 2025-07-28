package com.softcafe.core.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

@SuppressWarnings("serial")
@Entity
@Table(name = "T_ADDRESS", uniqueConstraints = @UniqueConstraint(columnNames = { "lng_addr_ref_key", "tx_addr_for",
		"tx_addr_type" }))
public class Address extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ADDRESS_SEQ") // for oracle
	@SequenceGenerator(sequenceName = "ADDRESS_SEQ", allocationSize = 1, name = "ADDRESS_SEQ") // for oracle
	@Column(name = "id_addr_key")
	private Long addrId;
	@Column(name = "id_addr_ver")
	private Integer addrVer;
	/**
	 * this key refer to address referance. like student, user
	 */
	@Column(name = "lng_addr_ref_key")
	private Long addrRefId;
	/**
	 * address type. present address, permanent address
	 */
	@Column(name = "tx_addr_type")
	private String addrType;
	/**
	 * This column contain indication of address party. like , student, teacher
	 */
	@Column(name = "tx_addr_for")
	private String addrFor;

	@Column(name = "tx_addr_line_1")
	private String addrLine1;

	@Column(name = "tx_addr_line_2")
	private String addrLine2;

	@Column(name = "tx_village_name")
	private String villageName;

	@Column(name = "tx_union_name")
	private String unionName;

	@Column(name = "tx_zip_code")
	private String zipCode;

	@Column(name = "id_police_station_key")
	private Long policeStationId;

	@Transient
	private String policeStationName;

	@Column(name = "id_sub_district_key")
	private Long subDistrictId;

	@Transient
	private String subDistrictName;

	@Column(name = "id_district_key")
	private Long districtId;

	@Transient
	private String districtName;

	@Column(name = "id_divison_key")
	private Long divisionId;

	@Transient
	private String divisionName;

	@Column(name = "id_country_key")
	private Long countryId;

	@Transient
	private String countryName;

	@Column(name = "id_continent_key")
	private Long continentId;

	@Transient
	private String continentName;

	@Column(name = "tx_comments")
	private Long comments;

	public Long getAddrId() {
		return addrId;
	}

	public void setAddrId(Long addrId) {
		this.addrId = addrId;
	}

	public Integer getAddrVer() {
		return addrVer;
	}

	public void setAddrVer(Integer addrVer) {
		this.addrVer = addrVer;
	}

	public Long getAddrRefId() {
		return addrRefId;
	}

	public void setAddrRefId(Long addrRefId) {
		this.addrRefId = addrRefId;
	}

	public String getAddrType() {
		return addrType;
	}

	public void setAddrType(String addrType) {
		this.addrType = addrType;
	}

	public String getAddrLine1() {
		return addrLine1;
	}

	public void setAddrLine1(String addrLine1) {
		this.addrLine1 = addrLine1;
	}

	public String getAddrLine2() {
		return addrLine2;
	}

	public void setAddrLine2(String addrLine2) {
		this.addrLine2 = addrLine2;
	}

	public String getVillageName() {
		return villageName;
	}

	public void setVillageName(String villageName) {
		this.villageName = villageName;
	}

	public String getUnionName() {
		return unionName;
	}

	public void setUnionName(String unionName) {
		this.unionName = unionName;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public Long getPoliceStationId() {
		return policeStationId;
	}

	public void setPoliceStationId(Long policeStationId) {
		this.policeStationId = policeStationId;
	}

	public String getPoliceStationName() {
		return policeStationName;
	}

	public void setPoliceStationName(String policeStationName) {
		this.policeStationName = policeStationName;
	}

	public Long getSubDistrictId() {
		return subDistrictId;
	}

	public void setSubDistrictId(Long subDistrictId) {
		this.subDistrictId = subDistrictId;
	}

	public String getSubDistrictName() {
		return subDistrictName;
	}

	public void setSubDistrictName(String subDistrictName) {
		this.subDistrictName = subDistrictName;
	}

	public Long getDistrictId() {
		return districtId;
	}

	public void setDistrictId(Long districtId) {
		this.districtId = districtId;
	}

	public String getDistrictName() {
		return districtName;
	}

	public void setDistrictName(String districtName) {
		this.districtName = districtName;
	}

	public Long getCountryId() {
		return countryId;
	}

	public void setCountryId(Long countryId) {
		this.countryId = countryId;
	}

	public String getCountryName() {
		return countryName;
	}

	public void setCountryName(String countryName) {
		this.countryName = countryName;
	}

	public Long getContinentId() {
		return continentId;
	}

	public void setContinentId(Long continentId) {
		this.continentId = continentId;
	}

	public String getContinentName() {
		return continentName;
	}

	public void setContinentName(String continentName) {
		this.continentName = continentName;
	}

	public Long getComments() {
		return comments;
	}

	public void setComments(Long comments) {
		this.comments = comments;
	}

	public String getAddrFor() {
		return addrFor;
	}

	public void setAddrFor(String addrFor) {
		this.addrFor = addrFor;
	}

	public Long getDivisionId() {
		return divisionId;
	}

	public void setDivisionId(Long divisionId) {
		this.divisionId = divisionId;
	}

	public String getDivisionName() {
		return divisionName;
	}

	public void setDivisionName(String divisionName) {
		this.divisionName = divisionName;
	}

}
