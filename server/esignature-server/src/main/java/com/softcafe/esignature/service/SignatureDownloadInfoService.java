package com.softcafe.esignature.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.softcafe.core.service.DocumentFilesService;
import com.softcafe.esignature.entity.SignatureDownloadInfo;
import com.softcafe.esignature.report.SignatureDownloadInfoRepo;

@Service
public class SignatureDownloadInfoService {
	private static final Logger log = LoggerFactory.getLogger(SignatureDownloadInfoService.class);


	@Autowired
	private SignatureDownloadInfoRepo downloadInfoRepo;

	@Autowired
	private DocumentFilesService documentFilesService;
	
	
	public SignatureDownloadInfo saveInformation(SignatureDownloadInfo sgInfo) throws Exception {
		log.info("try to save information");
		List<MultipartFile> mf = sgInfo.getFile();
		SignatureDownloadInfo sInfo = downloadInfoRepo.save(sgInfo);
		if(sInfo != null) {
			if(mf!=null && mf.size()>0) {
				for (MultipartFile multipartFile : mf) {
					documentFilesService.saveFile(sInfo.getSignatureDownId(), multipartFile, "SignatureDownloadInfo", sgInfo.getDownloadBy(), null, null);
				}
			}
		}
		return sInfo;
		
		
	}

}
