package com.softcafe.esignature.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.core.model.User;
import com.softcafe.core.repo.UserRepo;
import com.softcafe.esignature.entity.SignatureInfo;
import com.softcafe.esignature.model.ViewRequest;
import com.softcafe.esignature.repo.SignatureInfoRepo;
import com.softcafe.esignature.repo.ViewRequestRepo;
import com.softcafe.esignature.report.LoggedReportResponse;
import com.softcafe.esignature.report.ReportSearch;
import com.softcafe.esignature.report.SignatureSearchResponse;
import com.softcafe.esignature.view.DocumentReportRepo;
import com.softcafe.esignature.view.DocumentReportView;
import com.softcafe.esignature.view.DownloadReportView;
import com.softcafe.esignature.view.DownloadReportViewRepo;
import com.softcafe.esignature.view.ExceptionReportView;
import com.softcafe.esignature.view.ExceptionReportViewRepo;
import com.softcafe.esignature.view.HrModuleReportView;
import com.softcafe.esignature.view.HrModuleReportViewRepo;
import com.softcafe.esignature.view.LoggedReportView;
import com.softcafe.esignature.view.LoggedReportViewRepo;
import com.softcafe.esignature.view.NewsFeedOthersRepo;
import com.softcafe.esignature.view.NewsFeedOthersReportView;
import com.softcafe.esignature.view.PaReportViewRepo;
import com.softcafe.esignature.view.PaSearchReportView;
import com.softcafe.esignature.view.PasswordReportView;
import com.softcafe.esignature.view.PasswordReportViewRepo;
import com.softcafe.esignature.view.SignatureHistoryReportRepo;
import com.softcafe.esignature.view.SignatureHistoryReportView;
import com.softcafe.esignature.view.SignatureReportView;
import com.softcafe.esignature.view.SignatureReportViewRepo;
import com.softcafe.esignature.view.SignatureSearchView;
import com.softcafe.esignature.view.SignatureSearchViewRepo;
import com.softcafe.esignature.view.UserReportView;
import com.softcafe.esignature.view.UserReportViewRepo;

@Service
public class ReportSearchService extends AbstractService<ReportSearch> {
	private static final Logger log = LoggerFactory.getLogger(ReportSearchService.class);

	private static final DateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
	
	
	@Value("${excel.user.file.path}")
	String excelCommonFilePath;
	
	@Value("${excel.logged.file.path}")
	String excelCommonFilePathu;

	@Autowired
	LoggedReportViewRepo loggedReportViewRepo;

	@Autowired
	PaReportViewRepo paReportViewRepo;

	@Autowired
	NewsFeedOthersRepo feedOthersRepo;

	@Autowired
	HrModuleReportViewRepo hrModuleReportViewRepo;

	@Autowired
	SignatureSearchViewRepo signatureSearchViewRepo;

	@Autowired
	SignatureReportViewRepo signatureReportViewRepo;

	@Autowired
	SignatureInfoRepo signatureInfoRepo;

	@Autowired
	UserReportViewRepo userRepViewRepo;

	@Autowired
	PasswordReportViewRepo passwordReportViewRepo;

	@Autowired
	DownloadReportViewRepo downloadReportViewRepo;

	@Autowired
	UserRepo userRepo;
	
	@Autowired
	SignatureHistoryReportRepo sighistoryReportRepo;
	
	@Autowired
	DocumentReportRepo documentReportRepo;
	
	@Autowired
	ExceptionReportViewRepo exceptionReportViewRepo;
	
	@Autowired
	ViewRequestRepo requestRepo;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;
		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

			if (actionType.equals(ActionType.ACTION_LOGON_REPORT.toString())) {
				LoggedReportResponse obj = loggedReport(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SIG_SEARCH_REPORT.toString())) {
				SignatureSearchResponse obj = sigSearchReport(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_HR_MODULE_SEARCH_REPORT.toString())) {
				SignatureSearchResponse obj = searchHrModuleReport(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SIG_SEARCH_REPORT2.toString())) {
				SignatureSearchResponse obj = sigSearchReport2(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_DOWNLOAD_REPORT.toString())) {
				SignatureSearchResponse obj = searchDownloadReport(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_PA_SEARCH_REPORT.toString())) {
				SignatureSearchResponse obj = paSearchReport(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_BANK_SEARCH_REPORT.toString())) {
				SignatureSearchResponse obj = bankSearchReport(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_USER_SEARCH_REPORT.toString())) {
				SignatureSearchResponse obj = sigUserReport(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_PASSWORD_SEARCH_REPORT.toString())) {
				SignatureSearchResponse obj = passSearchReport(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} 
			else if (actionType.equals(ActionType.ACTION_SIG_HISTORY.toString())) {
				SignatureSearchResponse obj = searchSigHistory(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.ACTION_DOC_REPORT.toString())) {
				SignatureSearchResponse obj = searchDocReport(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<User> obj = selectUser(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_NEWS_FEED_OTHERS_REPORT.toString())) {
				SignatureSearchResponse obj = searchNewsFeedOthers(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.ACTION_REQUEST_REPORT.toString())) {
				SignatureSearchResponse obj = searchRequestReport(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			 else if (actionType.equals(ActionType.ACTION_EXCEPTION_REPORT.toString())) {
					SignatureSearchResponse obj = searchExceptionReport(requestMessage, actionType);
					msgResponse = ResponseBuilder.buildResponse(header, obj);
				}else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	

	private SignatureSearchResponse searchDocReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		String institutionId = r.getInstitutionId() == null ? "null" : Long.toString(r.getInstitutionId());

		Page<DocumentReportView> page = documentReportRepo.search(fromDate, toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();

		res.setDocumentReportViews(page.getContent());
		res.setTotalItem(page.getTotalElements());
		return res;
	}
	
	private SignatureSearchResponse searchRequestReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		String institutionId = r.getInstitutionId() == null ? "null" : Long.toString(r.getInstitutionId());

		Page<ViewRequest> page = requestRepo.search(fromDate, toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();

		res.setItemsRequestView(page.getContent());
		res.setTotalItem(page.getTotalElements());
		return res;
	}



	private List<User> selectUser(Message<List<User>> requestMessage, String actionType) {
//		return getAllInstitution();
		return userRepo.findAllByActive(1, null).getContent();
	}

	private SignatureSearchResponse searchHrModuleReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		String institutionId = r.getInstitutionId() == null ? "null" : Long.toString(r.getInstitutionId());

		Page<HrModuleReportView> page = hrModuleReportViewRepo.search(fromDate, toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();

		res.setItemsHrModuleReport(page.getContent());
		res.setTotalItem(page.getTotalElements());

		return res;
	}

	private SignatureSearchResponse searchDownloadReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		String institutionId = r.getInstitutionId() == null ? "null" : Long.toString(r.getInstitutionId());

		Page<DownloadReportView> page = downloadReportViewRepo.search(fromDate, toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();

		res.setItemsDownloadReport(page.getContent());
		res.setTotalItem(page.getTotalElements());
		return res;
	}

	private SignatureSearchResponse sigSearchReport2(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		String institutionId = r.getInstitutionId() == null ? "null" : Long.toString(r.getInstitutionId());

		Page<SignatureSearchView> page = signatureSearchViewRepo.search(fromDate, toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();

		res.setItems(page.getContent());
		res.setTotalItem(page.getTotalElements());
		return res;
	}

	private SignatureSearchResponse bankSearchReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = r.getFromDate() == null ? null : yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		Long institutionId = r.getInstitutionId() != null ? Long.valueOf(r.getInstitutionId()) : null;
		String s = r.getFromDate() == null ? "" : r.getFromDate().toString();
		Page<SignatureInfo> page = signatureInfoRepo.search(fromDate, toDate, institutionId, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();
		res.setItemsBankReport(page.getContent());
		res.setTotalItem(page.getTotalElements());

		return res;
	}

	private SignatureSearchResponse paSearchReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		String institutionId = r.getInstitutionId() == null ? "null" : Long.toString(r.getInstitutionId());

		Page<PaSearchReportView> page = paReportViewRepo.search(fromDate, toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();
		res.setItemsPaSearchReport(page.getContent());
		res.setTotalItem(page.getTotalElements());

		return res;
	}

	private SignatureSearchResponse searchExceptionReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());


		Page<ExceptionReportView> page = exceptionReportViewRepo.search(fromDate, toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();

		res.setItemsExceptionReportViews(page.getContent());
		res.setTotalItem(page.getTotalElements());
		return res;
	}

	private SignatureSearchResponse sigUserReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());
		String fullName=r.getFullName();

		Page<UserReportView> page = userRepViewRepo.search(fromDate, toDate, r.getUserType(),r.getFullName(), pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();

		res.setItemsUserReport(page.getContent());
		res.setTotalItem(page.getTotalElements());

		return res;
	}

	private SignatureSearchResponse passSearchReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() > 0 ? r.getPageNumber() - 1 : 0, r.getPageSize());

		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		Long userId = r.getUserId() != null ? Long.valueOf(r.getUserId()) : null;
		String s = r.getFromDate() == null ? "" : r.getFromDate().toString();
		Date fromDate = StringUtils.isBlank(s) ? null : yyyyMMddHHmmss.parse(s);

		Page<PasswordReportView> page = passwordReportViewRepo.findAllByUserIdAndDateTimeBetween(userId, fromDate,
				toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();
		res.setItemsPasswordReport(page.getContent());
		res.setTotalItem(page.getTotalElements());

		return res;
	}

	private LoggedReportResponse loggedReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());
		String fullName=r.getFullName();
		  log.info("Parsed date range: from [{}] to [{}]", fromDate, toDate);
		String institutionId = r.getInstitutionId() == null ? "null" : Long.toString(r.getInstitutionId());
		log.info("Querying loggedReportViewRepo with fromDate: [{}], toDate: [{}], pageable: [{}]", fromDate, toDate, pageable);
		Page<LoggedReportView> page = loggedReportViewRepo.search(fromDate, toDate,fullName, pageable);
		log.info("Query completed. Total records found: [{}]", page.getTotalElements());
		LoggedReportResponse res = new LoggedReportResponse();

		res.setItems(page.getContent());
		res.setTotalItem(page.getTotalElements());
		 log.info("Returning response with [{}] items, total items: [{}]", page.getContent().size(), page.getTotalElements());
		return res;
	}

	private SignatureSearchResponse sigSearchReport(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		String institutionId = r.getInstitutionId() == null ? "null" : Long.toString(r.getInstitutionId());

		Page<SignatureReportView> page = signatureReportViewRepo.search(fromDate, toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();

		res.setItemsSignatureReport(page.getContent());
		res.setTotalItem(page.getTotalElements());

		return res;
	}
	
	private SignatureSearchResponse searchSigHistory(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		String institutionId = r.getInstitutionId() == null ? "null" : Long.toString(r.getInstitutionId());

		Page<SignatureHistoryReportView> page = sighistoryReportRepo.search(fromDate, toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();

		res.setItemsSignHistryReport(page.getContent());
		res.setTotalItem(page.getTotalElements());
		return res;
	}
	
	private SignatureSearchResponse searchNewsFeedOthers(Message<List<ReportSearch>> requestMessage, String actionType)
			throws Exception {
		ReportSearch r = requestMessage.getPayload().get(0);

		Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize());

		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());

		String institutionId = r.getInstitutionId() == null ? "null" : Long.toString(r.getInstitutionId());

		Page<NewsFeedOthersReportView> page = feedOthersRepo.search(fromDate, toDate, pageable);

		SignatureSearchResponse res = new SignatureSearchResponse();

		res.setItemsNewsFeedReport(page.getContent());
		res.setTotalItem(page.getTotalElements());

		return res;
	}
	
	
	public List<UserReportView> selectUserDownloadReport(ReportSearch r )
			throws Exception {
		
		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());
		String fullName=r.getFullName();

		List<UserReportView> list = userRepViewRepo.selectUserDownloadReport(fromDate, toDate, r.getUserType(),r.getFullName());

		//res.setItemsUserReport(list);

		return list;
	}
	public List<LoggedReportView> selectLoggedDownloadReport(ReportSearch r )
			throws Exception {
		
		Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		Date toDate = yyyyMMddHHmmss.parse(r.getToDate());
		String fullName=r.getFullName();

		List<LoggedReportView> list = loggedReportViewRepo.selectLoggedDownloadReport(fromDate, toDate,r.getFullName());

		//res.setItemsUserReport(list);

		return list;
	}
	
	
	public SignatureSearchResponse writeXlsx(List<UserReportView> list) throws IOException {
		
		int existingRows = 0;
		 Row row=null;
		

		Workbook wb = new SXSSFWorkbook();
			Sheet sheet = wb.createSheet("CommonExcel");
			// sheet = workbook.createSheet(stdp1);

			row = sheet.createRow(existingRows);
			Cell cell = row.createCell(0);
			cell.setCellValue("Sl No");
			
			cell = row.createCell(1);
			cell.setCellValue("User Id");
			
			cell = row.createCell(2);
			cell.setCellValue("Employee Id");
			
			cell = row.createCell(3);
			cell.setCellValue("Name");
			
			cell = row.createCell(4);
			cell.setCellValue("Br/Division Name");
			
			cell = row.createCell(5);
			cell.setCellValue("Designation"); 
			
			cell = row.createCell(6);
			cell.setCellValue("Mobile No");
			
			cell = row.createCell(7);
			cell.setCellValue("Last Login Date");
			
			cell = row.createCell(8);
			cell.setCellValue("User Type");
			
			cell = row.createCell(9);
			cell.setCellValue("User Create Date Time");
			
			cell = row.createCell(10);
			cell.setCellValue("Active Date Time");
			
			cell = row.createCell(11);
			cell.setCellValue("Inactive Date Time");
			
			cell = row.createCell(12);
			cell.setCellValue("User Status");
			
			cell = row.createCell(13);
			cell.setCellValue("Amend Date Time");
			
			cell = row.createCell(14);
			cell.setCellValue("Password Reset Date Time");
			
			cell = row.createCell(15);
			cell.setCellValue("Admin User Name");
			
			cell = row.createCell(16);
			cell.setCellValue("Block Reason");
			
			cell = row.createCell(17);
			cell.setCellValue("Admin Reset Date Time");
			
			cell = row.createCell(18);
			cell.setCellValue("Maker Name");
			
			cell = row.createCell(19);
			cell.setCellValue("Authorizer Name");
			
			
			
			existingRows++;
			
			
			if(list==null) return null;
			
			for(UserReportView ur:list){
				row = sheet.createRow(existingRows);
				
				 cell = row.createCell(0);
		         cell.setCellValue(existingRows);
				
	            cell = row.createCell(1);
	            cell.setCellValue(ur.getLoginName());
	            
	            cell = row.createCell(2);
	            cell.setCellValue(ur.getEmpId());
	            
	            cell = row.createCell(3);
	            cell.setCellValue(ur.getFullName());
	            
	            cell = row.createCell(4);
	            cell.setCellValue(ur.getBranch());
	            
	            cell = row.createCell(5);
	            cell.setCellValue(ur.getDesignation());
	            
	            cell = row.createCell(6);
	            cell.setCellValue(ur.getMobileNumber());
	             
	            cell = row.createCell(7);
	            cell.setCellValue(ur.getLastLoginDate());
	           
	            cell = row.createCell(8);
	            cell.setCellValue(ur.getUserType());
	            
	            cell = row.createCell(9);
	            cell.setCellValue(ur.getUserCreateDate());
	            
	            
	            cell = row.createCell(10);
	            cell.setCellValue(ur.getActiveDate());
	            
	            cell = row.createCell(11);
	            cell.setCellValue(ur.getInactiveDate());
	            
	            cell = row.createCell(12);
	            cell.setCellValue(ur.getDbUserStatus());
	            
	            cell = row.createCell(13);
	            cell.setCellValue(ur.getAmendDateSt());
	            
	            cell = row.createCell(14);
	            cell.setCellValue(ur.getPassWordResetDateTime());
	            
	            cell = row.createCell(15);
	            cell.setCellValue(ur.getAdminUser());
	            
	            cell = row.createCell(16);
	            cell.setCellValue(ur.getUserBlockCause());
	            
	            cell = row.createCell(17);
	            cell.setCellValue(ur.getAdminResetDateTime());
	            
	            cell = row.createCell(18);
	            cell.setCellValue(ur.getMaker());
	            
	            cell = row.createCell(19);
	            cell.setCellValue(ur.getAuthorizer());
	            
	            
	            existingRows++;
	         
			};
			SignatureSearchResponse i =new SignatureSearchResponse();
			FileOutputStream out = null;
			makeDir(excelCommonFilePath);

			String filePath=new File(excelCommonFilePath+"//"+yyyyMMddHHmmss.format(new Date())+".xlsx").toString();
			 out = new FileOutputStream(new File(filePath));


			wb.write(out);
			out.close();
			wb.close();

			
			 log.info("file path: "+filePath.replace("\\", "//"));
	        i.setCommonExcelFilePath(filePath.replace("\\", "//"));
	             
		return i;
	}
	
	public <T> void exportToExcel(List<T> dataList, String fileName) {
        if (dataList == null || dataList.isEmpty()) {
            System.out.println("No data to export.");
            return;
        }

        // Create a workbook
        XSSFWorkbook workbook = new XSSFWorkbook();

        // Create a sheet
        XSSFSheet sheet = workbook.createSheet("Data");

        // Use reflection to get field names for the header row
        Class<?> clazz = dataList.get(0).getClass();
        Field[] fields = clazz.getDeclaredFields();

        // Create header row
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < fields.length; i++) {
            fields[i].setAccessible(true); // Allow access to private fields
            Cell headerCell = headerRow.createCell(i);
//            headerCell.setCellValue(fields[i].getName());
            
            if (fields[i].isAnnotationPresent(Column.class)) {
                Column column = fields[i].getAnnotation(Column.class);
                
                headerCell.setCellValue(column.name()); // Use the column name from annotation
            } else {
                headerCell.setCellValue(fields[i].getName()); // Fallback to field name
            }
        }

        // Fill data rows
        int rowIndex = 1;
        for (T data : dataList) {
            Row dataRow = sheet.createRow(rowIndex++);
            for (int i = 0; i < fields.length; i++) {
                fields[i].setAccessible(true);
                try {
                    Object value = fields[i].get(data); // Get the value of the field
                    Cell cell = dataRow.createCell(i);
                    if (value instanceof Number) {
                        cell.setCellValue(((Number) value).doubleValue());
                    } else if (value != null) {
                        cell.setCellValue(value.toString());
                    } else {
                        cell.setCellValue("");
                    }
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }

        // Auto-size columns for readability
        for (int i = 0; i < fields.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Write to file
        try {
        	
        	FileOutputStream out = null;
			makeDir(excelCommonFilePath);

			String filePath=new File(excelCommonFilePath+"//"+yyyyMMddHHmmss.format(new Date())+".xlsx").toString();
			out = new FileOutputStream(new File(filePath));
//
//
//			wb.write(out);
//			out.close();
//			wb.close();

			
			 log.info("file path: "+filePath.replace("\\", "//"));
//	        i.setCommonExcelFilePath(filePath.replace("\\", "//"));
        	
        	
            workbook.write(out);
            System.out.println("Excel file created: " + fileName);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
            	
                workbook.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

	
public SignatureSearchResponse writeXlsxu(List<LoggedReportView> list) throws IOException {
		
		int existingRows = 0;
		 Row row=null;
		

		Workbook wb = new SXSSFWorkbook();
			Sheet sheet = wb.createSheet("CommonExcel");
			// sheet = workbook.createSheet(stdp1);

			row = sheet.createRow(existingRows);
			Cell cell = row.createCell(0);
			cell.setCellValue("Sl No");
			
			cell = row.createCell(1);
			cell.setCellValue("User Name");
			
			cell = row.createCell(2);
			cell.setCellValue("Date & Time");
			
			cell = row.createCell(3);
			cell.setCellValue("Success");
			
			cell = row.createCell(4);
			cell.setCellValue("Action");
			
			cell = row.createCell(5);
			cell.setCellValue("IP");
			
			cell = row.createCell(6);
			cell.setCellValue("Name"); 
			
			cell = row.createCell(7);
			cell.setCellValue("Bank Name");
			
			cell = row.createCell(8);
			cell.setCellValue("Branch/Division");
			
			cell = row.createCell(9);
			cell.setCellValue("Gen Notice Accept Date & Time");
			
			cell = row.createCell(10);
			cell.setCellValue("MD Notice Accept Date & Time");
			
//			cell = row.createCell(10);
//			cell.setCellValue("Active Date Time");
			
			
			
			existingRows++;
			
			
			if(list==null) return null;
			
			for(LoggedReportView ur:list){
				row = sheet.createRow(existingRows);
				
				 cell = row.createCell(0);
		         cell.setCellValue(existingRows);
				
	            cell = row.createCell(1);
	            cell.setCellValue(ur.getLoginName());
	            
	            cell = row.createCell(2);
	            cell.setCellValue(ur.getEntryTime());
	            
	            cell = row.createCell(3);
	            cell.setCellValue(ur.getAttemptStatus());
	            
	            cell = row.createCell(4);
	            cell.setCellValue(ur.getAction());
	            
	            cell = row.createCell(5);
	            cell.setCellValue(ur.getIp());
	            
	            cell = row.createCell(6);
	            cell.setCellValue(ur.getFullName());
	            
	            cell = row.createCell(7);
	            cell.setCellValue(ur.getInstitutionName());
	             
	            cell = row.createCell(8);
	            cell.setCellValue(ur.getBranchName());
	           
	            cell = row.createCell(9);
	            cell.setCellValue(ur.getGenNoticeTime());
	            
	            cell = row.createCell(10);
	            cell.setCellValue(ur.getMdNoticeTime());

	            
	            existingRows++;
	         
			};
			SignatureSearchResponse i =new SignatureSearchResponse();
			FileOutputStream out = null;
			makeDir(excelCommonFilePathu);

			String filePath=new File(excelCommonFilePathu+"//"+yyyyMMddHHmmss.format(new Date())+".xlsx").toString();
			 out = new FileOutputStream(new File(filePath));


			wb.write(out);
			out.close();
			wb.close();

			
			 log.info("file path: "+filePath.replace("\\", "//"));
	        i.setCommonExcelFilePath(filePath.replace("\\", "//"));
	             
		return i;
	}
	
	
	public static void makeDir(String dir) {
		if (null != dir) {
			File d = new File(dir);
			if (!d.exists()) {
				d.mkdirs();
			}
		}
	}

}
