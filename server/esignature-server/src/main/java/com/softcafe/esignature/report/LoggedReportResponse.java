package com.softcafe.esignature.report;

import java.util.List;

import com.softcafe.esignature.view.LoggedReportView;

public class LoggedReportResponse {
	
	List<LoggedReportView> items;
	long totalItem;
	
	public List<LoggedReportView> getItems() {
		return items;
	}
	public void setItems(List<LoggedReportView> items) {
		this.items = items;
	}
	public long getTotalItem() {
		return totalItem;
	}
	public void setTotalItem(long totalItem) {
		this.totalItem = totalItem;
	}
	
	

}
