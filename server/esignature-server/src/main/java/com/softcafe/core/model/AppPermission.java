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
@Table(name="T_APP_PERMISSION")
public class AppPermission extends BaseEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "APP_PERMISSION_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "APP_PERMISSION_SEQ", allocationSize = 1, name = "APP_PERMISSION_SEQ") //for oracle	
	@Column(name = "id_permission_key")
	private Long permissionId;
	
//	@Column(name = "is_active")
//	protected int active = 1;
	
	@Column(name = "tx_group", updatable = false)
	private String group;
	
	@Column(name = "tx_sub_group", updatable = false)
	private String subGroup;
	
	@Column(name = "tx_permission_name", unique = true, updatable = false)
	private String permissionName;
	
	@Column(name = "tx_display_name", unique = true, nullable = false)
	private String displayName;
	
	@Column(name = "tx_desc")
	private String desc;
	
	//APPROVED
	@Column(name = "tx_status")
	private String status;
	
	
	@Transient
	String genericMapStatus;
	
	@Transient
	private List<Role> roleList;
	
	@Transient
	private List<Role> unassignRoleList;
	
	

	public Long getPermissionId() {
		return permissionId;
	}

	public void setPermissionId(Long permissionId) {
		this.permissionId = permissionId;
	}

//	public int getActive() {
//		return active;
//	}
//
//	public void setActive(int active) {
//		this.active = active;
//	}

	public String getPermissionName() {
		return permissionName;
	}

	public void setPermissionName(String permissionName) {
		this.permissionName = permissionName;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public List<Role> getRoleList() {
		return roleList;
	}

	public void setRoleList(List<Role> roleList) {
		this.roleList = roleList;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getSubGroup() {
		return subGroup;
	}

	public void setSubGroup(String subGroup) {
		this.subGroup = subGroup;
	}

	public List<Role> getUnassignRoleList() {
		return unassignRoleList;
	}

	public void setUnassignRoleList(List<Role> unassignRoleList) {
		this.unassignRoleList = unassignRoleList;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getGenericMapStatus() {
		return genericMapStatus;
	}

	public void setGenericMapStatus(String genericMapStatus) {
		this.genericMapStatus = genericMapStatus;
	}
	


}
