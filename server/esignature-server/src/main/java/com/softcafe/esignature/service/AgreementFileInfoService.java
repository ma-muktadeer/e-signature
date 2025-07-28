package com.softcafe.esignature.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.softcafe.core.model.SConfiguration;
import com.softcafe.core.service.DocumentFilesService;
import com.softcafe.core.service.SConfigurationService;
import com.softcafe.esignature.entity.AgreementFileInfo;
import com.softcafe.esignature.repo.AgreementFileInfoRepo;
import com.softcafe.esignature.utils.Str;

@Service
public class AgreementFileInfoService {

	private static final Logger log = LoggerFactory.getLogger(AgreementFileInfoService.class);

	@Autowired
	private AgreementFileInfoRepo agreementFileRepo;

	@Autowired
	private DocumentFilesService documentFilesService;

	@Autowired
	private SConfigurationService sConfigurationService;

	public List<AgreementFileInfo> saveAgreement(AgreementFileInfo entity, Long userId) throws Exception {
		log.info("tring to save agreement file. userId: [{}]", userId);
		try {

			List<String> mList = new ArrayList<String>();

			if (entity.getGeneralNotic() != null) {
				mList.add(Str.GENERAL_NOTIC_FILE);
//				saveAgreementFile(sc, entity.getGeneralNotic(), userId);
			}
			if (entity.getInstruction() != null) {
				mList.add(Str.INSTRUCTION_FILE);

			}

			for (String m : mList) {

				SConfiguration sc = new SConfiguration();
				sc.setCreatorId(userId);
				sc.setCreateDate(new Date());
				sc.setValue4(Str.APPROVED);

				sc.setConfigGroup(Str.AGREEMENT_FILE);

				sc.setConfigSubGroup(m);
				if (m.equals(Str.GENERAL_NOTIC_FILE)) {
					saveAgreementFile(sc, entity.getGeneralNotic(), userId, "General Notice");
				} else {
					saveAgreementFile(sc, entity.getInstruction(), userId, "Instruction");
				}
			}

			return findAllAgreement(Str.AGREEMENT_FILE, Arrays.asList(Str.GENERAL_NOTIC_FILE, Str.INSTRUCTION_FILE));

		} catch (Exception e) {
			log.info("getting error. error messege: [{}]", e.getMessage());
			throw new Exception(e.getMessage());
		}

	}

	private void saveAgreementFile(SConfiguration sf, MultipartFile multipartFile, Long userId, String comeFrom) throws Exception {
		SConfiguration sc = null;

		sc = sConfigurationService.saveConfigForAgreement(sf, comeFrom);

		if (sc.getConfigId() != null) {
//			if (entity.getGeneralNotic() != null) {
			documentFilesService.saveFile(sc.getConfigId(), multipartFile, "SConfiguration", userId, null, null);
//			}
//			if (entity.getInstruction() != null) {
//				documentFilesService.saveFile(sc.getConfigId(), entity.getInstruction(), "SConfiguration", userId);
//			}
		}

	}

	public List<AgreementFileInfo> findAllAgreement(String configGroup, List<String> configSubGroupList) {

		return agreementFileRepo.findAllByConfigGroupAndConfigSubGroupInAndActive(configGroup, configSubGroupList, 1);
	}


	public List<AgreementFileInfo> saveDiclaimer(AgreementFileInfo entity, Long userId) throws Exception {
		log.info("tring to save agreement file. userId: [{}]", userId);
		try {

			List<String> mList = new ArrayList<String>();

			if (entity.getLegalDisclaimer() != null) {
				mList.add(Str.LEGAL_DISCLAIMER);
			}
			
			for (String m : mList) {

				SConfiguration sc = new SConfiguration();
				sc.setCreatorId(userId);
				sc.setCreateDate(new Date());
				sc.setValue4(Str.APPROVED);

				sc.setConfigGroup(Str.DISCLAIMER);

				sc.setConfigSubGroup(m);
				if (m.equals(Str.LEGAL_DISCLAIMER)) {
					saveAgreementFile(sc, entity.getLegalDisclaimer(), userId, "Legal Disclaimer");
				} 
			}

			return findAllAgreement(Str.DISCLAIMER, Arrays.asList(Str.LEGAL_DISCLAIMER));

		} catch (Exception e) {
			log.info("getting error. error messege: [{}]", e.getMessage());
			throw new Exception(e.getMessage());
		}

	}

}
