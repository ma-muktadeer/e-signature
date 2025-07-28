package com.softcafe.esignature.utils;

public class PassValidationRes {
	private String msg;
	private String type;
	private String userType;
	
	public PassValidationRes(String msg, String type, String userType) {
		this.msg = msg;
		this.type = type;
		this.userType = userType;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	
	

}
