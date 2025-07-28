package com.softcafe.core.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


@Entity
@Table(name = "T_LOGIN")

public class Login {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LOGIN_SEQ2") //for oracle
    @SequenceGenerator(sequenceName = "LOGIN_SEQ2", allocationSize = 1, name = "LOGIN_SEQ2") //for oracle
	@Column(name = "id_login_key")
	private Long loginId;
	
	@Column(name = "id_user_key")
	private Long userId;
	
	@Column(name = "dtt_login_time")
	private Date loginTime;
	
	@Column(name = "dtt_logout_time")
	private Date logoutTime;
	
	@LastModifiedDate
	@Column(name = "dtt_mod_time")
	private Date modTime;
	
	@CreatedDate
	@Column(name = "dtt_entry", updatable = false)
	private Date entryTime = new Date();
	
	@Column(name = "tx_ip_addr")
	private String ipAddr;
	
	@Column(name = "tx_gateway")
	private String gateway;
	
	@Column(name = "int_login")
	private Integer login;
	
	//if login success for a attempt
	@Column(name = "int_attempt_status")
	private Integer attemptStatus;
	
	//when success then mark all fail attempt as resolved=1
	@Column(name = "int_fail_resolved")
	private Integer failResolved;
	
	//when success then mark all fail attempt as resolved=1
	@Column(name = "tx_login_name")
	private String loginName;
	
	@Column(name = "dtt_gen_notice")
	private Date genNoticeTime;
	
	@Column(name = "dtt_md_notice")
	private Date mdNoticeTime;
	
	
	
	
	public Long getLoginId() {
		return loginId;
	}
	public void setLoginId(Long loginId) {
		this.loginId = loginId;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public Date getLoginTime() {
		return loginTime;
	}
	public void setLoginTime(Date loginTime) {
		this.loginTime = loginTime;
	}
	public Date getLogoutTime() {
		return logoutTime;
	}
	public void setLogoutTime(Date logoutTime) {
		this.logoutTime = logoutTime;
	}
	public String getIpAddr() {
		return ipAddr;
	}
	public void setIpAddr(String ipAddr) {
		this.ipAddr = ipAddr;
	}
	public String getGateway() {
		return gateway;
	}
	public void setGateway(String gateway) {
		this.gateway = gateway;
	}
	public Integer getLogin() {
		return login;
	}
	public void setLogin(Integer login) {
		this.login = login;
	}
	public Integer getAttemptStatus() {
		return attemptStatus;
	}
	public void setAttemptStatus(Integer attemptStatus) {
		this.attemptStatus = attemptStatus;
	}
	public Integer getFailResolved() {
		return failResolved;
	}
	public void setFailResolved(Integer failResolved) {
		this.failResolved = failResolved;
	}
	
	
	
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public Date getModTime() {
		return modTime;
	}
	public void setModTime(Date modTime) {
		this.modTime = modTime;
	}
	public Date getEntryTime() {
		return entryTime;
	}
	public void setEntryTime(Date entryTime) {
		this.entryTime = entryTime;
	}
	public Date getGenNoticeTime() {
		return genNoticeTime;
	}
	public void setGenNoticeTime(Date genNoticeTime) {
		this.genNoticeTime = genNoticeTime;
	}
	public Date getMdNoticeTime() {
		return mdNoticeTime;
	}
	public void setMdNoticeTime(Date mdNoticeTime) {
		this.mdNoticeTime = mdNoticeTime;
	}
	
	
	
	
}
