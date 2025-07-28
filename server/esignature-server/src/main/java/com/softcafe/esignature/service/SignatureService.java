package com.softcafe.esignature.service;

import java.awt.image.RenderedImage;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.esignature.entity.Signature;
import com.softcafe.esignature.model.FileUploadErrMsg;
import com.softcafe.esignature.model.SignatureCount;
import com.softcafe.esignature.repo.SignatureRepo;
import com.softcafe.esignature.utils.ActivityType;
import com.softcafe.esignature.utils.Str;
import com.softcafe.esignature.utils.Utils;

@Service
public class SignatureService extends AbstractService<List<Signature>> {
	private static final Logger log = LoggerFactory.getLogger(SignatureService.class);

	@Autowired
	private SignatureRepo signatureRepo;

	@Autowired
	private SignatureInfoService signatureInfoService;
	
	@Autowired
	private ActivityLogService activityLogService;

	@Autowired
	private SignatoryService signatoryService;

	@Autowired
	private InstitutionService institutionService;

	@Value("${signature.file.base.path}")
	private String basePath;

	@Value("${file.image.base.path}")
	private String fileImagePath;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;
		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

			if (actionType.equals(ActionType.ACTION_SELECT_1.toString())) {
				String obj = select1(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			}
//			else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
//				Signature obj = selectAll(requestMessage, actionType);
//				msgResponse = ResponseBuilder.buildResponse(header, obj);
//
//			}
//			else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
//				Signature obj = update(requestMessage, actionType);
//				msgResponse = ResponseBuilder.buildResponse(header, obj);
//
//			}
//			else if (actionType.equals(ActionType.SEARCH_PA.toString())) {
//				List<String> obj = searchPa(requestMessage, actionType);
//				msgResponse = ResponseBuilder.buildResponse(header, obj);
//
//			}
//			else if (actionType.equals(ActionType.SEARCH_NAME.toString())) {
//				List<String> obj = searchName(requestMessage, actionType);
//				msgResponse = ResponseBuilder.buildResponse(header, obj);
//
//			}
//			else if (actionType.equals(ActionType.SEARCH_NAME.toString())) {
//				List<Signature> obj = searchName(requestMessage, actionType);
//				msgResponse = ResponseBuilder.buildResponse(header, obj);
//
//			}
			else if (actionType.equals(ActionType.PBL_DASHBOARD.toString())) {
				List<SignatureCount> obj = pblDashbord(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	private String select1(Message requestMessage, String actionType) {
		String jsn = "[{" + "\"name\"" + ":" + "\"E-Signature AD\"" + "," + "\"email\"" + ":"
				+ "\"E-Signature@softcafe.com\"" + "," + "\"number\"" + ":" + "\"01234567890\"" + "}]";
		return jsn;
	}

	private List<SignatureCount> pblDashbord(Message requestMessage, String actionType) {

		return signatureRepo.countByActiveAndGroupByStatus();
	}

//	private List<String> searchPa(Message<List<Signature>> requestMessage, String actionType) {
//		Signature sg = requestMessage.getPayload().get(0);
//
//		List<Signature> paList = signatureRepo.findAllByPaContainingIgnoreCaseAndStatusAndActive(sg.getPa(),
//				Str.APPROVED, 1);
//
//		log.info("Getting employe. search By : size is:[{}, {}]", sg.getPa(), paList.size());
//		return paList.parallelStream().map(Signature::getPa).collect(Collectors.toList());
//	}

//	private List<String> searchName(Message<List<Signature>> requestMessage, String actionType) {
//		Signature sg = requestMessage.getPayload().get(0);
//
//		List<Signature> nameList = signatureRepo.findAllByNameContainingIgnoreCaseAndStatusAndActive(sg.getName(),
//				Str.APPROVED, 1);
//
//		log.info("Getting employe. search By : size is:[{}, {}]", sg.getPa(), nameList.size());
//		return nameList.parallelStream().map(Signature::getName).collect(Collectors.toList());
//	}

//	private List<Signature> searchName(Message<List<Signature>> requestMessage, String actionType) {
//		Signature sg = requestMessage.getPayload().get(0);
//
//		List<Signature> nameList = signatureRepo.findAllByNameContainingIgnoreCaseAndStatusAndActive(sg.getName(),
//				Str.APPROVED, 1);
//
//		log.info("Getting employe. search By : size is:[{}, {}]", sg.getPa(), nameList.size());
//		return nameList;
//	}

//	private Signature update(Message<List<Signature>> requestMessage, String actionType) {
//		Signature s = requestMessage.getPayload().get(0);
//		List<Signature> sgList = s.getUpdateSignature();
//		Long userId = Long.valueOf(requestMessage.getHeader().getUserId());
//		
//		log.info("Update signature.......");
//		sgList.forEach((sg) -> {
//			if (sg.getSignatureKey() != null) {
//				Signature dbSg = signatureRepo.findById(sg.getSignatureKey()).get();
//
//				dbSg.setSignatureStatus(sg.getSignatureStatus());
//				dbSg.setModDate(new Date());
//				dbSg.setUserModId(Long.valueOf(requestMessage.getHeader().getUserId()));
//				dbSg.setDesignation(sg.getDesignation());
//				dbSg.setName(sg.getName());
//				dbSg.setEmail(sg.getEmail());
//				dbSg.setRejectionCause(s.getRejectionCause());
//				dbSg.setEffictiveDate(sg.getEffictiveDate());
//
//				dbSg.setStatus(s.getStatus());
//				if(sg.getSignatureStatus() != null && sg.getSignatureStatus().equals("CANCEL") && s.getStatus().equals("NEW")) {
//					dbSg.setCancelTime(new Date());
//					dbSg.setCalcelCause(sg.getCalcelCause());
//				}
//				
//				dbSg.setModDate(new Date());
//				dbSg.setUserModId(userId);
//
//				signatureRepo.save(dbSg);
//			}
//		});
//
//		return buildReturn(sgList);
//	}

//	private Signature selectAll(Message<List<Signature>> requestMessage, String actionType) {
//		log.info("trying to getting all signature.");
//
//		return buildReturn(null);
//	}
//
//	private Signature buildReturn(List<Signature> updateSignature) {
//		Signature sg = new Signature();
//		sg.setUpdateSignature(updateSignature);
//		sg.setAllSignature(signatureRepo.findAllByActive(1));
//		return sg;
//	}

//	private Signature search(Message<List<Signature>> requestMessage, String actionType) {
//		Signature sg = requestMessage.getPayload().get(0);
//		Signature dbSg = null;
//		try {
//			if(!StringUtils.isBlank(sg.getPa())) {
//				log.info("search signature by signatory id: [{}]", sg.getPa());
////				Signature s = signatureRepo.findByPaAndStatusAndActive(sg.getPa(), Str.APPROVED, 1);
//				dbSg = signatureRepo.findByPaAndStatusAndActive(sg.getPa(), Str.APPROVED, 1);
//			}else {
//				log.info("search signature by signatory name: [{}]", sg.getName());
//				dbSg = signatureRepo.findByNameAndStatusAndActive(sg.getName(), Str.APPROVED, 1);
//			}
//			
//			if (dbSg != null) {
//				dbSg.setBase64Image(Utils.file2Base64(dbSg.getSignaturePath()));
//			} else {
//				log.info("getting null value");
//				throw new PathNotFoundException("Active Signature Not found.");
//			}
//		} catch (Exception e) {
//			log.info("getting error: ", e);
//			throw new RuntimeException(e.getMessage());
//		}
////        log.info(sg.getBase64Image());
//		return dbSg;
//	}

	public List<Signature> signatureUploadHandel(MultipartFile[] files, Signature entity, Long userId, String senderSourceIPAddress, String senderGatewayIPAddress)
			throws Exception {
//        File destFile = null;
//		String destPath = null;
		try {
			Date cDate = new SimpleDateFormat("yyy-MM-dd").parse(entity.getEffictiveDateString());
			 HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
			Signature dbSig = signatureRepo.findBySignatoryIdAndActive(entity.getSignatoryId(), 1);

			if (dbSig == null) {
				// saving multiple file
				int T = files.length;
				List<Signature> sgList = new ArrayList<Signature>();
				while (T-- > 0) {
					log.info("try to save signature: signature number: {}", T);
					Signature sg = buildSignature(entity);

//					String destPath = saveSignature2Dir(files[T]); /// saving only 1st file

					String destPath = Utils.saveFile2Dir(files[T], basePath); /// saving only 1st file

					if (files.length == 1) {
						sg.setIsMainSignature(1);
					} else {
						sg.setIsMainSignature(files[T].getOriginalFilename().equals(entity.getMainSignature()) ? 1 : 0);
					}
					sg.setEffictiveDate(cDate);

					sg.setSignaturePath(destPath);

//					signatureSave(entity, userId);
					sg.setCreatorId(userId);
					sg.setCreateDate(new Date());
					sg.setIpAddr(request.getRemoteAddr());
					sg.setIpGateway(request.getHeader("X-Forwarded-For"));
					
					
					signatureRepo.save(sg);
					
					
					activityLogService.save(userId, sg.getSignatoryId(), ActivityType.SAVE_SIGNATURE,
							senderSourceIPAddress, senderGatewayIPAddress);
//					sgList.add(sg);
				}

//				signatureRepo.saveAll(sgList);
				
				

			} else {
				throw new RuntimeException("Singnature is already exist.");
			}

		} catch (Exception e) {
			log.info("error found as {}", e.getMessage());
			throw new Exception(e.getMessage());
		}
		return signatureRepo.findAllByActive(1);
	}

	private Signature buildSignature(Signature entity) {
		Signature sg = new Signature();
//		sg.setStatus(Str.PEND_APPROVE);
		sg.setStatus(entity.getStatus());
		sg.setSignatoryId(entity.getSignatoryId());
		sg.setSignatureType(entity.getSignatureType());
		sg.setSignatureStatus(entity.getSignatureStatus());

		return sg;
	}

	private void signatureSave(Signature entity, Long userId) {

		if (entity.getSignatoryId() == null) {
			entity = save2Singnatory(entity, userId);
		}
		entity.setCreatorId(userId);
		entity.setCreateDate(new Date());
		entity.setStatus(Str.NEW);
		if (entity.getSignatureStatus().equals(Str.CANCEL)) {
			entity.setCancelTime(entity.getCancelTime() == null ? new Date() : entity.getCancelTime());
		}
		signatureRepo.save(entity);
		log.info("signature is saved successfully. \nsignature:signatory is are: [{},{}]", entity.getSignatureId(),
				entity.getSignatoryId());

	}

	private Signature save2Singnatory(Signature entity, Long userId) {
		return signatoryService.updateOrSaveSignature(entity, userId);
	}

//	private String saveSignature2Dir(MultipartFile file) throws Exception {
//		Utils.makDir(basePath);
//		log.info("base path is successfully created: [{}]", basePath);
//		String fileName = file.getOriginalFilename();
//
//		fileName = UUID.randomUUID().toString().replaceAll("-", "") + fileName.substring(fileName.lastIndexOf("."));
//
//		String destPath = basePath + File.separator + fileName;
//		File destFile = new File(destPath);
//		file.transferTo(destFile);
//		log.info("file is successfully save. to filePath \n[{}, {}, {}]", destPath);
//
////		String destPath = copyImage2Application(fileName);
//
//		return destPath;
//	}

	private String copyImage2Application(String imageName) throws Exception {

		try {
//			File file = new File(fileImagePath + File.separator + imageName);
//			String destPath = basePath + File.separator + UUID.randomUUID().toString()+imageName.substring(imageName.lastIndexOf("."));
//			log.info("creating unice file path and Name: [{}]", destPath);
//			File destFile = new File(destPath);

			File file = new File(fileImagePath + File.separator + imageName);
			RenderedImage in = ImageIO.read(file);
			String fileEx = imageName.substring(imageName.lastIndexOf(".") + 1);
			String destPath = basePath + File.separator + UUID.randomUUID().toString() + "." + fileEx;
			log.info("creating unice file path and Name: [{}]", destPath);
			File destFile = new File(destPath);
//			OutputStream ot = new FileOutputStream(destFile);

			ImageIO.write(in, fileEx, destFile);
//			in.transferTo(ot);

//			fiile.transferTo(destFile);
			log.info("file is successfully save. to filePath \n[{}, {}, {}]", destPath, imageName);
			return destPath;
		} catch (Exception e) {
			log.info("getting error 2 save image. image name [{}]", imageName);
			throw new Exception("File Exaption. File Name:" + imageName);
		}

	}

	public Signature fileUploadHandel(MultipartFile[] files, Long userId, Long institutionId) throws Exception {

		List<Signature> readingValue = readFile(files[0]);

		Signature resSignature = checkValidation(readingValue, institutionId);

		if (resSignature.getFileUploadMsg().size() > 0) {
			return resSignature;
		} else {

			if (saveNewSignature(readingValue, userId, institutionId)) {
				resSignature.setUploadFileCount(readingValue.size());
			} else {
				resSignature.setUploadFileCount(0);
			}
			return resSignature;
		}
	}

	private List<Signature> readFile(MultipartFile file) throws Exception {
		List<Signature> readingValue = new ArrayList<Signature>();
		int[] i = { 0 };
		try (XSSFWorkbook wb = new XSSFWorkbook(file.getInputStream())) {
//			XSSFWorkbook wb = new XSSFWorkbook(file.getInputStream());

			XSSFSheet hs = wb.getSheetAt(0);

//			Signature newSignature = new Signature();
//			int[] i = { 0 }; // Using an array to hold the index value
			hs.forEach(e -> {
				Signature newSignature = new Signature();
				if (i[0] > 0) {
					log.info("Converting the java object of rowNum: {}", i[0]);
					newSignature = readSignature(e, newSignature);
					readingValue.add(newSignature);
				} else {
					i[0]++;
					return; // Skip the first element
				}
				i[0]++;
			});

//			for (Row row : hs) {
//				Signature newSignature = new Signature();
//				if (i == 0) {
//					i++;
//					continue;
//				} else {
//					i++;
//					log.info("converting the java object of rowNum:{}", i);
//					newSignature = readSignature(row, newSignature);
	//
//				}
//				readingValue.add(newSignature);
	//
//			}
			wb.close();
			return readingValue;
		} catch (Exception e) {
			log.info("geting error to read file. row number:{}", i[0]);
			throw new RuntimeException("Faild to reading EXCEL. Exception Occurs In Row number "+i[0]);
		}
		

	}

	private boolean saveNewSignature(List<Signature> readingValue, Long userId, Long institutionId) throws Exception {
		log.info("saving file information. size:[{}]", readingValue.size());
		try {
			for (Signature entity : readingValue) {
				entity.setInstitutionId(institutionId);
				String path = copyImage2Application(entity.getCoreSignaturePath());
				entity.setSignaturePath(path);
				signatureSave(entity, userId);
			}
			return true;
		} catch (Exception e) {
			log.info("get error to save Signature");
			return false;
		}

	}

	private Signature checkValidation(List<Signature> readingValue, Long institutionId) {

		List<String> paList = readingValue.stream().map(Signature::getPa).collect(Collectors.toList());
		List<String> epmIds = readingValue.stream().map(Signature::getEmployeeId).collect(Collectors.toList());

//		FileUploadErrMsg msg = null;
		List<FileUploadErrMsg> errorMsgList = new ArrayList<FileUploadErrMsg>();

		Signature sg = new Signature();

//		int i = 1;
//		for (Signature signature : readingValue) {
//			FileUploadErrMsg msg = checkSingleSignatureValidation(paList, signature, i);
//			if (msg != null && msg.getMsg().size() > 0) {
//				errorMsgList.add(msg);
//			}
//			i++;
//		}

		int[] i = { 1 };
		readingValue.forEach(r -> {
			FileUploadErrMsg msg = checkSingleSignatureValidation(paList, epmIds, r, i[0], institutionId);
			if (msg != null && msg.getMsg().size() > 0) {
				errorMsgList.add(msg);
			}
			i[0]++;
		});

		sg.setFileUploadMsg(errorMsgList);
		return sg;
	}

	private Signature readSignature(Row row, Signature newSignature) {
//		newSignature.setPa(row.getCell(0) != null ? row.getCell(0).toString() : "");
//		newSignature.setName(row.getCell(1) != null ? row.getCell(1).toString() : "");
//		newSignature.setDesignation(row.getCell(2) != null ? row.getCell(2).toString() : "");
//		newSignature.setEmail(row.getCell(3) != null ? row.getCell(3).toString() : "");
//		newSignature.setEffictiveDate(row.getCell(4) != null ? row.getCell(4).getDateCellValue() : null);
//
//		newSignature.setSignatureStatus(row.getCell(5) != null ? row.getCell(5).toString() : "");

//		newSignature.setCoreSignaturePath(row.getCell(6) != null ? row.getCell(6).toString() : "");

		newSignature.setEmployeeId(checkNull(row.getCell(1).getCellType().equals(CellType.NUMERIC)
				? String.format("%.0f", row.getCell(1).getNumericCellValue())
				: ""));
		newSignature.setName(checkNull(row.getCell(2)));
		String pa = checkNull(row.getCell(3));
		newSignature.setPa(StringUtils.isBlank(pa) ? "" : pa.contains(".")? pa.substring(0, pa.indexOf(".")): pa);

//		column name pa status. need to know is it signature status?
		newSignature.setSignatureStatus(checkNull(row.getCell(4)));
		newSignature.setPaStatus(newSignature.getSignatureStatus());
		newSignature.setDesignation(checkNull(row.getCell(5)));
		newSignature.setBaranchName(checkNull(row.getCell(6)));
		newSignature.setDepartmentName(checkNull(row.getCell(7)));
		newSignature.setBirthday(row.getCell(8) != null && row.getCell(8).getCellType().equals(CellType.NUMERIC)
				? row.getCell(8).getDateCellValue()
				: null);
		newSignature.setIssueDate(row.getCell(9) != null && row.getCell(9).getCellType().equals(CellType.NUMERIC)
				? row.getCell(9).getDateCellValue()
				: null);
		newSignature.setEffictiveDate(row.getCell(10) != null && row.getCell(10).getCellType().equals(CellType.NUMERIC)
				? row.getCell(10).getDateCellValue()
				: null);
		newSignature.setCancelTime(row.getCell(11) != null && row.getCell(11).getCellType().equals(CellType.NUMERIC)
				? row.getCell(11).getDateCellValue()
				: null);
		newSignature.setContactNumber(checkNull(row.getCell(12)));
		newSignature.setEmail(checkNull(row.getCell(13)));

		newSignature.setCoreSignaturePath(checkNull(row.getCell(14).getStringCellValue()));
		newSignature.setIsMainSignature(1);

		return newSignature;
	}

	private <T> String checkNull(T cell) {
		if (cell == null || StringUtils.isBlank(cell.toString())) {
			return "";
		}
		return cell.toString();
	}

	private FileUploadErrMsg checkSingleSignatureValidation(List<String> paList, List<String> epmIds,
			Signature signature, int i, Long institutionId) {

		FileUploadErrMsg errMsg = checkSingleSignature(paList, epmIds, signature, i, institutionId);
//		sg.setFileUploadMsg(errMsg);
		return errMsg;
	}

	private FileUploadErrMsg checkSingleSignature(List<String> paList, List<String> epmIds, Signature signature, int i,
			Long institutionId) {
		FileUploadErrMsg msg = new FileUploadErrMsg();
		List<Map<String, String>> lMap = new ArrayList<Map<String, String>>();

		boolean isOwnInstitution = institutionService.findOwnInstitution(institutionId);
		log.info("validate for prime bank=[{}], institution id:{}", isOwnInstitution, institutionId);

		msg.setRowNum(i);

		if (isBlank(signature.getEmployeeId())) {
			lMap = setErrorMsg("Employee ID", "Employee ID number is empty.", lMap);
		} else {
			if (!isValid(epmIds, signature.getEmployeeId())) {
				lMap = setErrorMsg("Employee ID", "Duplicate Employee ID number.", lMap);
			} else if (checkEmployeeIdInDb(signature.getEmployeeId())) {
				log.info("find Employee ID in database. EmployeeId:[{}]", signature.getEmployeeId());
				lMap = setErrorMsg("Employee ID", "Employee ID number is already exit.", lMap);
			}
		}

		if (isOwnInstitution) {
			if (isBlank(signature.getPa())) {
				lMap = setErrorMsg("PA", "PA number is empty.", lMap);
			} else {
				if (!isValid(paList, signature.getPa())) {
					lMap = setErrorMsg("PA", "Duplicate PA number.", lMap);
				} else if (checkPaInDb(signature.getPa())) {
					log.info("find PA in database. PA:[{}]", signature.getPa());
					lMap = setErrorMsg("PA", "PA number is already exit.", lMap);
				}
			}
		}

		if (isBlank(signature.getName())) {
			lMap = setErrorMsg("Name", "Name is empty.", lMap);
		}

		lMap = checkEmailValidation(signature.getEmail(), lMap);

		if (signature.getEffictiveDate() == null) {
			lMap = setErrorMsg("Effective Date", "Effective Date is Empty.", lMap);
		}
		if (isBlank(signature.getSignatureStatus())) {
			lMap = setErrorMsg("Signature status", "Signature Startus is Empty.", lMap);
		}
		if (isBlank(signature.getCoreSignaturePath())) {
			lMap = setErrorMsg("Image", "Image name is Empty.", lMap);
		} else {
			if (!isValidImage(signature.getCoreSignaturePath())) {
				lMap = setErrorMsg("Image Path", "Signature Image not found.", lMap);
			}
		}
		msg.setMsg(lMap);

		return msg;
	}

	private boolean checkPaInDb(String pa) {
		return signatureInfoService.isHaveActiveSignatureBypa(pa);
//		return signatureRepo.existsByPa(pa);
//		return false;
	}

	private boolean checkEmployeeIdInDb(String empId) {
		return signatureInfoService.isHaveActiveSignatureByEmployeeId(empId);
	}

	private boolean isValidImage(String imageName) {

		log.info("Upload file image base file: imageNAME: [{}:{}]", fileImagePath, imageName);
		try {
			File f = new File(fileImagePath + File.separator + imageName);
			if (f.exists()) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			log.info("Image file not found. image name: basePath [{},{}]", imageName, fileImagePath);
			return false;
		}

	}

	private boolean isValidEffectiveDate(Row row) {
		return row.getCell(4).getDateCellValue() != null;
	}

	private List<Map<String, String>> checkEmailValidation(String email, List<Map<String, String>> lMap) {
		log.info("getting email : [{}]", email);
		boolean res = StringUtils.isBlank(email);
		if (res) {
			lMap = setErrorMsg("Email", "Email is Empty.", lMap);
		} else if (!isValidEmail(email)) {
			lMap = setErrorMsg("Email", "Invalid Email.", lMap);
		}
		return lMap;
	}

	private boolean isValidEmail(String email) {
		String prtn = "^[a-zA-Z0-9_.-]+@[a-zA-Z.]+\\.[a-zA-Z]{2,}$";
		return Pattern.compile(prtn, Pattern.CASE_INSENSITIVE).matcher(email).matches();
	}

	private List<Map<String, String>> setErrorMsg(String sellName, String msg, List<Map<String, String>> lMap) {
		Map<String, String> map = new HashedMap();
		map.put(sellName, msg);
		lMap.add(map);
		return lMap;
	}

	private boolean isBlank(String testingValue) {
		return testingValue == null || StringUtils.isBlank(testingValue);
	}

	private boolean isValid(List<String> list, String pa) {

		boolean res = list.stream().filter(e -> e.equals(pa)).collect(Collectors.toList()).size() > 1;

		return !res;
	}

	public List<Signature> getAllActiveSignature() {
		return signatureRepo.findAllByActive(1);
	}

	public Signature findSignatureById(Long signatureId) {

		return signatureRepo.findBySignatureIdAndActive(signatureId, 1);
	}

	public void saveSignature(Signature dbSg) {
		signatureRepo.save(dbSg);
	}

	public List<Signature> finAllBySignatoryId(Long signatoryId) {

		return signatureRepo.findAllBySignatoryIdAndActive(signatoryId, 1);
	}

	public List<Signature> findWithOutMasterSignatureInfo(Long signatoryId) {

		return signatureRepo.findAllBySignatoryIdAndIsMainSignatureAndActive(signatoryId, 0, 1);
	}

}
