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
@Table(name="T_GENERIC_MAP")
public class GenericMap extends BaseEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GENERIC_MAP_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "GENERIC_MAP_SEQ", allocationSize = 1, name = "GENERIC_MAP_SEQ") //for oracle
	@Column(name ="id_generic_map_key")
	private Long genericMapId;
	@Column(name ="id_generic_map_ver")
	private Integer genericMapVer;
	
	@Column(name ="tx_from_type_name")
	private String fromTypeName;
	@Column(name ="lng_from_id")
	private Long fromId;
	@Column(name ="tx_to_type_name")
	private String toTypeName;
	@Column(name ="lng_to_id")
	private Long toId;
	@Column(name ="tx_status")
	private String status;
	
	// -------------- end table column-------------------
	
	@Transient
	private List<GenericMap> genericMapList;

	public Long getGenericMapId() {
		return genericMapId;
	}

	public void setGenericMapId(Long genericMapId) {
		this.genericMapId = genericMapId;
	}

	public Integer getGenericMapVer() {
		return genericMapVer;
	}

	public void setGenericMapVer(Integer genericMapVer) {
		this.genericMapVer = genericMapVer;
	}

	public String getFromTypeName() {
		return fromTypeName;
	}

	public void setFromTypeName(String fromTypeName) {
		this.fromTypeName = fromTypeName;
	}

	public Long getFromId() {
		return fromId;
	}

	public void setFromId(Long fromId) {
		this.fromId = fromId;
	}

	public String getToTypeName() {
		return toTypeName;
	}

	public void setToTypeName(String toTypeName) {
		this.toTypeName = toTypeName;
	}

	public Long getToId() {
		return toId;
	}

	public void setToId(Long toId) {
		this.toId = toId;
	}

	public List<GenericMap> getGenericMapList() {
		return genericMapList;
	}

	public void setGenericMapList(List<GenericMap> genericMapList) {
		this.genericMapList = genericMapList;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	
}
