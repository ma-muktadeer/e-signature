package com.softcafe.esignature.report;

import java.util.List;

import com.softcafe.esignature.view.PrintDownloadReport;

public class PrintDownloadResponse {

	List<PrintDownloadReport> items;
	long totalItem;
	
	public List<PrintDownloadReport> getItems() {
		return items;
	}
	public void setItems(List<PrintDownloadReport> items) {
		this.items = items;
	}
	public long getTotalItem() {
		return totalItem;
	}
	public void setTotalItem(long totalItem) {
		this.totalItem = totalItem;
	}
}
