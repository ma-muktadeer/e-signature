package com.softcafe.core.model;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

@Entity
@Table(name = "t_role_group")
public class RoleGroup extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ROLE_GROUP_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "ROLE_GROUP_SEQ", allocationSize = 1, name = "ROLE_GROUP_SEQ") //for oracle
	@Column(name ="id_role_group_key")
	private Long roleGroupId;
	
	@Column(name = "tx_group_name", unique = true)
	private String roleGroupName;
	
	//APPROVED
	@Column(name = "tx_status")
	private String status;
	
	
	
	@Transient
	private List<Role> roleList;// role assign for this user
	@Transient
	private List<Role> unassignRoleList;// role than are not assign for this user
	

	public Long getRoleGroupId() {
		return roleGroupId;
	}

	public void setRoleGroupId(Long roleGroupId) {
		this.roleGroupId = roleGroupId;
	}

	

	public String getRoleGroupName() {
		return roleGroupName;
	}

	public void setRoleGroupName(String roleGroupName) {
		this.roleGroupName = roleGroupName;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public List<Role> getRoleList() {
		return roleList;
	}

	public void setRoleList(List<Role> roleList) {
		this.roleList = roleList;
	}

	public List<Role> getUnassignRoleList() {
		return unassignRoleList;
	}

	public void setUnassignRoleList(List<Role> unassignRoleList) {
		this.unassignRoleList = unassignRoleList;
	}

	public Long getCreatorId() {
		return creatorId;
	}

	public void setCreatorId(Long creatorId) {
		this.creatorId = creatorId;
	}

	
	
	

}
