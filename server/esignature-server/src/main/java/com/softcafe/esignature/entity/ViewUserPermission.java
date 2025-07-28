package com.softcafe.esignature.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="VW_USER_PERMISSION")
public class ViewUserPermission {
	
	@Id
	@Column(name = "ID")
	private Long Id;
	
	
	@Column(name = "ID_PERMISSION_KEY")
	private Long permissionId;
	
	@Column(name = "TX_PERMISSION_NAME")
	private String permissionName;
	
	@Column(name = "PERMISSION_DIS_NAME")
	private String permissionDisplayName;
	
	
	
	@Column(name = "ID_USER_KEY")
	private Long userId;
	
	@Column(name = "TX_LOGIN_NAME")
	private String loginName;
	
	@Column(name = "ID_ROLE_KEY")
	private Long roleId;
	
	@Column(name = "TX_ROLE_NAME")
	private String roleName;
	
	@Column(name = "RL_DIS_NAME")
	private String roleDiplayName;

	public Long getId() {
		return Id;
	}

	public void setId(Long id) {
		Id = id;
	}

	public Long getPermissionId() {
		return permissionId;
	}

	public void setPermissionId(Long permissionId) {
		this.permissionId = permissionId;
	}

	public String getPermissionName() {
		return permissionName;
	}

	public void setPermissionName(String permissionName) {
		this.permissionName = permissionName;
	}

	public String getPermissionDisplayName() {
		return permissionDisplayName;
	}

	public void setPermissionDisplayName(String permissionDisplayName) {
		this.permissionDisplayName = permissionDisplayName;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getRoleDiplayName() {
		return roleDiplayName;
	}

	public void setRoleDiplayName(String roleDiplayName) {
		this.roleDiplayName = roleDiplayName;
	}
	
	
	
	
}
