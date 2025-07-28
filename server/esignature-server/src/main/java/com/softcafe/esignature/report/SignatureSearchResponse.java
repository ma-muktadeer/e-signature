package com.softcafe.esignature.report;

import java.util.List;

import com.softcafe.esignature.entity.SignatureInfo;
import com.softcafe.esignature.model.ViewRequest;
import com.softcafe.esignature.view.DocumentReportView;
import com.softcafe.esignature.view.DownloadReportView;
import com.softcafe.esignature.view.ExceptionReportView;
import com.softcafe.esignature.view.HrModuleReportView;
import com.softcafe.esignature.view.NewsFeedOthersReportView;
import com.softcafe.esignature.view.PaSearchReportView;
import com.softcafe.esignature.view.PasswordReportView;
import com.softcafe.esignature.view.SignatureHistoryReportView;
import com.softcafe.esignature.view.SignatureReportView;
import com.softcafe.esignature.view.SignatureSearchView;
import com.softcafe.esignature.view.UserReportView;

public class SignatureSearchResponse {
	
	List<SignatureSearchView> items;
	
	List<UserReportView> itemsUserReport;
	
	List<DownloadReportView> itemsDownloadReport;
	
	List<PasswordReportView> itemsPasswordReport;
	
	List<SignatureReportView> itemsSignatureReport;
	
	List<PaSearchReportView> itemsPaSearchReport;
	List<HrModuleReportView> itemsHrModuleReport;

	
	List<NewsFeedOthersReportView> itemsNewsFeedReport;
	List<SignatureInfo> itemsBankReport;
	
	List<SignatureHistoryReportView> itemsSignHistryReport;
	
	List<DocumentReportView> documentReportViews;
	
	List<ExceptionReportView> itemsExceptionReportViews;
	
	List<ViewRequest> itemsRequestView;

	long totalItem;
	
	 private String commonExcelFilePath;
	
	
	public List<SignatureSearchView> getItems() {
		return items;
	}
	public void setItems(List<SignatureSearchView> items) {
		this.items = items;
	}
	public long getTotalItem() {
		return totalItem;
	}
	public void setTotalItem(long totalItem) {
		this.totalItem = totalItem;
	}
	public List<UserReportView> getItemsUserReport() {
		return itemsUserReport;
	}
	public void setItemsUserReport(List<UserReportView> itemsUserReport) {
		this.itemsUserReport = itemsUserReport;
	}
	public List<PasswordReportView> getItemsPasswordReport() {
		return itemsPasswordReport;
	}
	public void setItemsPasswordReport(List<PasswordReportView> itemsPasswordReport) {
		this.itemsPasswordReport = itemsPasswordReport;
	}

	public List<NewsFeedOthersReportView> getItemsNewsFeedReport() {
		return itemsNewsFeedReport;
	}
	public void setItemsNewsFeedReport(List<NewsFeedOthersReportView> itemsNewsFeedReport) {
		this.itemsNewsFeedReport = itemsNewsFeedReport;
	}
	public List<PaSearchReportView> getItemsPaSearchReport() {
		return itemsPaSearchReport;
	}
	public void setItemsPaSearchReport(List<PaSearchReportView> itemsPaSearchReport) {
		this.itemsPaSearchReport = itemsPaSearchReport;
	}
	public List<SignatureInfo> getItemsBankReport() {
		return itemsBankReport;
	}
	public void setItemsBankReport(List<SignatureInfo> itemsBankReport) {
		this.itemsBankReport = itemsBankReport;
	}
	public List<SignatureReportView> getItemsSignatureReport() {
		return itemsSignatureReport;
	}
	public void setItemsSignatureReport(List<SignatureReportView> itemsSignatureReport) {
		this.itemsSignatureReport = itemsSignatureReport;
	}
	public List<DownloadReportView> getItemsDownloadReport() {
		return itemsDownloadReport;
	}
	public void setItemsDownloadReport(List<DownloadReportView> itemsDownloadReport) {
		this.itemsDownloadReport = itemsDownloadReport;
	}
	public List<HrModuleReportView> getItemsHrModuleReport() {
		return itemsHrModuleReport;
	}
	public void setItemsHrModuleReport(List<HrModuleReportView> itemsHrModuleReport) {
		this.itemsHrModuleReport = itemsHrModuleReport;
	}
	public List<SignatureHistoryReportView> getItemsSignHistryReport() {
		return itemsSignHistryReport;
	}
	public void setItemsSignHistryReport(List<SignatureHistoryReportView> itemsSignHistryReport) {
		this.itemsSignHistryReport = itemsSignHistryReport;
	}
	public List<DocumentReportView> getDocumentReportViews() {
		return documentReportViews;
	}
	public void setDocumentReportViews(List<DocumentReportView> documentReportViews) {
		this.documentReportViews = documentReportViews;
	}
	public List<ExceptionReportView> getItemsExceptionReportViews() {
		return itemsExceptionReportViews;
	}
	public void setItemsExceptionReportViews(List<ExceptionReportView> itemsExceptionReportViews) {
		this.itemsExceptionReportViews = itemsExceptionReportViews;
	}
	public String getCommonExcelFilePath() {
		return commonExcelFilePath;
	}
	public void setCommonExcelFilePath(String commonExcelFilePath) {
		this.commonExcelFilePath = commonExcelFilePath;
	}
	public List<ViewRequest> getItemsRequestView() {
		return itemsRequestView;
	}
	public void setItemsRequestView(List<ViewRequest> itemsRequestView) {
		this.itemsRequestView = itemsRequestView;
	}

	
	
	
	
	
}
