package com.softcafe.core.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name ="T_LOCATION")
public class Location{
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LOCATION_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "LOCATION_SEQ", allocationSize = 1, name = "LOCATION_SEQ") //for oracle
	@Column(name = "lng_location_key")
	private Long locationId;
	@Column(name = "lng_location_ver")
	private Long locationVer;
	
	@Column(name = "tx_location_name")
	private String locationName;
	@Column(name = "tx_location_type")
	private String locationType;
	@Column(name = "tx_parent_key")
	private Long parentId;
	@Column(name = "tx_parent_name")
	private String parentName;
	@Column(name = "tx_currency_code")
	private String currencyCode;
	@Column(name = "dec_latitude")
	private Double latitude;
	@Column(name = "tx_longitude")
	private Double longitude;
	@Column(name ="tx_desc")
	private String desc;
	@Column(name = "tx_short_name")
	private String shortName;
	
	//---------- END TABLE  COLUMN -----------------------
	
	@Transient
	private List<Location> locationList;
	@Transient
	private List<Location> countryList;
	@Transient
	private List<Location> divisionList; 
	@Transient
	private List<Location> districtList;
	@Transient
	private List<Location> thanaList;
	public Long getLocationId() {
		return locationId;
	}
	public void setLocationId(Long locationId) {
		this.locationId = locationId;
	}
	public Long getLocationVer() {
		return locationVer;
	}
	public void setLocationVer(Long locationVer) {
		this.locationVer = locationVer;
	}
	public String getLocationName() {
		return locationName;
	}
	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}
	public String getLocationType() {
		return locationType;
	}
	public void setLocationType(String locationType) {
		this.locationType = locationType;
	}
	public Long getParentId() {
		return parentId;
	}
	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}
	public String getParentName() {
		return parentName;
	}
	public void setParentName(String parentName) {
		this.parentName = parentName;
	}
	public String getCurrencyCode() {
		return currencyCode;
	}
	public void setCurrencyCode(String currencyCode) {
		this.currencyCode = currencyCode;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getShortName() {
		return shortName;
	}
	public void setShortName(String shortName) {
		this.shortName = shortName;
	}
	public List<Location> getLocationList() {
		return locationList;
	}
	public void setLocationList(List<Location> locationList) {
		this.locationList = locationList;
	}
	public List<Location> getCountryList() {
		return countryList;
	}
	public void setCountryList(List<Location> countryList) {
		this.countryList = countryList;
	}
	public List<Location> getDivisionList() {
		return divisionList;
	}
	public void setDivisionList(List<Location> divisionList) {
		this.divisionList = divisionList;
	}
	public List<Location> getDistrictList() {
		return districtList;
	}
	public void setDistrictList(List<Location> districtList) {
		this.districtList = districtList;
	}
	public List<Location> getThanaList() {
		return thanaList;
	}
	public void setThanaList(List<Location> thanaList) {
		this.thanaList = thanaList;
	}
	
	
	
	
	
	
	

	
	

}
