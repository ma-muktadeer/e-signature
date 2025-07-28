package com.softcafe.esignature.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.GeneratorType;

import com.softcafe.core.model.BaseEntity;


@Entity
@Table(name="T_PASSWORD_LIST")
public class PasswordList extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "PASSWORD_LIST_GEN")
	@SequenceGenerator(name = "PASSWORD_LIST_GEN", sequenceName = "PASSWORD_LIST_SEQ", allocationSize = 1)
	@Column(name="ID_PASSWORD_LIST_KEY")
	private Long passwordListId;
	
	@Column(name = "ID_USER_KEY")
	private Long userId;

	@Column(name = "ID_OBJECT_KEY")
	private Long objectId;
	
	@Column(name = "TX_OLD_PASSWORD")
	private String oldPassword;
	
	@Column(name = "TX_TYPE", length = 56)
	private String type;

	public Long getPasswordListId() {
		return passwordListId;
	}

	public void setPasswordListId(Long passwordListId) {
		this.passwordListId = passwordListId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getOldPassword() {
		return oldPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Long getObjectId() {
		return objectId;
	}

	public void setObjectId(Long objectId) {
		this.objectId = objectId;
	}
	
	
	

}
