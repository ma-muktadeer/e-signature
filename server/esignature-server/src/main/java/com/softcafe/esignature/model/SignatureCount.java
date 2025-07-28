package com.softcafe.esignature.model;

public class SignatureCount {

	private long count;
	private String status;
	
	public SignatureCount(String status, long count) {
		this.count = count;
		this.status = status;
	}
	
	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	
}
