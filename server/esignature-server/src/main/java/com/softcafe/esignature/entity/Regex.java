package com.softcafe.esignature.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name="T_REGEX")
public class Regex {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "REGEX_GEN")
    @SequenceGenerator(sequenceName = "REGEX_SEQ", allocationSize = 1, name = "REGEX_GEN" )
	@Column(name = "id_regex_key")
	private Long regexId;
	
	@Column(name = "tx_name", length = 20)
	private String name;
	
	@Column(name = "tx_regex", length = 100)
	private String regex;

	public Long getRegexId() {
		return regexId;
	}

	public void setRegexId(Long regexId) {
		this.regexId = regexId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRegex() {
		return regex;
	}

	public void setRegex(String regex) {
		this.regex = regex;
	}
	
	
}
