package com.softcafe.core.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@SuppressWarnings("serial")
@Entity
@Table(name ="T_PREFERENCE")
public class Preference extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PREFERENCE_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "PREFERENCE_SEQ", allocationSize = 1, name = "PREFERENCE_SEQ") //for oracle
	@Column(name ="id_pref_key")
	private Long prefId;
	@Column(name ="id_pref_ver")
	private Long prefVer;
	
	@Column(name ="tx_pref_group")
	private String prefGroup;
	@Column(name ="tx_pref_name")
	private String prefName;
	@Column(name ="tx_pref_value")
	private String prefValue;
	@Column(name ="tx_pref_desc")
	private String prefDesc;
	public Long getPrefId() {
		return prefId;
	}
	public void setPrefId(Long prefId) {
		this.prefId = prefId;
	}
	public Long getPrefVer() {
		return prefVer;
	}
	public void setPrefVer(Long prefVer) {
		this.prefVer = prefVer;
	}
	public String getPrefGroup() {
		return prefGroup;
	}
	public void setPrefGroup(String prefGroup) {
		this.prefGroup = prefGroup;
	}
	public String getPrefName() {
		return prefName;
	}
	public void setPrefName(String prefName) {
		this.prefName = prefName;
	}
	public String getPrefValue() {
		return prefValue;
	}
	public void setPrefValue(String prefValue) {
		this.prefValue = prefValue;
	}
	public String getPrefDesc() {
		return prefDesc;
	}
	public void setPrefDesc(String prefDesc) {
		this.prefDesc = prefDesc;
	}
	
	
	

}
