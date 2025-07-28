package com.softcafe.esignature.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class FileUploadErrMsg {
	
	private int rowNum;
//	private String colValue;
//	private String msg;
	
	List<Map<String, String>> msg = new ArrayList<Map<String,String>>();

	public final int getRowNum() {
		return rowNum;
	}

	public final void setRowNum(int rowNum) {
		this.rowNum = rowNum;
	}

	public final List<Map<String, String>> getMsg() {
		return msg;
	}

	public final void setMsg(List<Map<String, String>> msg) {
		this.msg = msg;
	}

	
}
