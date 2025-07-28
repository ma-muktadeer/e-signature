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
@Table(name = "T_GROUP")
public class Group extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GROUP_MAP_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "GROUP_MAP_SEQ", allocationSize = 1, name = "GROUP_MAP_SEQ") //for oracle
	@Column(name = "id_group_key")
	private Long groupId;
	
	@Column(name = "tx_name")
	private String name;
	
	@Column(name = "tx_type")
	private String type;
	
	@Column(name = "tx_status")
	private String status;
	
	@Column(name = "tx_definition")
	private String definition;
	
	@Column(name = "tx_constant_name")
	private String constantName;
	
	
	@Transient
	private Long toId;
	
	
	
	@Transient
	List<User> contactList;
	
	@Transient
	List<User> emailList;
	
	@Transient
	List<User> mapList;
	
	@Transient
	Long customerId;

	public Long getGroupId() {
		return groupId;
	}

	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<User> getContactList() {
		return contactList;
	}

	public void setContactList(List<User> contactList) {
		this.contactList = contactList;
	}

	public List<User> getEmailList() {
		return emailList;
	}

	public void setEmailList(List<User> emailList) {
		this.emailList = emailList;
	}

	public List<User> getMapList() {
		return mapList;
	}

	public void setMapList(List<User> mapList) {
		this.mapList = mapList;
	}

	public Long getToId() {
		return toId;
	}

	public void setToId(Long toId) {
		this.toId = toId;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getDefinition() {
		return definition;
	}

	public void setDefinition(String definition) {
		this.definition = definition;
	}

	public String getConstantName() {
		return constantName;
	}

	public void setConstantName(String constantName) {
		this.constantName = constantName;
	}

	
	
	
}
