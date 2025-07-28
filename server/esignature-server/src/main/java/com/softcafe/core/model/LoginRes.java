package com.softcafe.core.model;

import java.util.Date;
import java.util.List;

import com.delfian.core.message.interfaces.Message;
import com.softcafe.esignature.entity.ViewUserPermission;


public class LoginRes {
	
	User user;
	String token;
	boolean authenticated;
	Date issuedAt;
	Date expireAt;
	Message<?> res;
	List<ViewUserPermission> permission;
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public boolean isAuthenticated() {
		return authenticated;
	}
	public void setAuthenticated(boolean authenticated) {
		this.authenticated = authenticated;
	}
	public Date getIssuedAt() {
		return issuedAt;
	}
	public void setIssuedAt(Date issuedAt) {
		this.issuedAt = issuedAt;
	}
	public Date getExpireAt() {
		return expireAt;
	}
	public void setExpireAt(Date expireAt) {
		this.expireAt = expireAt;
	}
	public Message<?> getRes() {
		return res;
	}
	public void setRes(Message<?> res) {
		this.res = res;
	}
	public List<ViewUserPermission> getPermission() {
		return permission;
	}
	public void setPermission(List<ViewUserPermission> permission) {
		this.permission = permission;
	}
	
	

}
