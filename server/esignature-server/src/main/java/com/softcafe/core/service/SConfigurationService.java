package com.softcafe.core.service;

import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.servlet.http.HttpServletRequest;

import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.jasypt.exceptions.EncryptionOperationNotPossibleException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.constants.AppStatus;
import com.softcafe.core.model.SConfiguration;
import com.softcafe.core.repo.SConfigurationRepo;
import com.softcafe.esignature.utils.Str;

@Service
public class SConfigurationService extends AbstractService<List<SConfiguration>> {
	private static final Logger log = LoggerFactory.getLogger(SConfigurationService.class);

	private static final String NEW = "NEW";
	private static final String MODIFIED = "MODIFIED";
	private static final String APPROVED = "APPROVED";
	private static final String PEND_DELETE = "PEND_DELETE";
	private static final String APPROVED_PEND_DELETE = "APPROVED_PEND_DELETE";

	@Autowired
	private SConfigurationRepo config;

	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {

			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<SConfiguration> userLIst = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_SELECT_1.toString())) {
				List<SConfiguration> obj = select1(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_2.toString())) {
				List<SConfiguration> obj = select2(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_2_EXPLOSIVE_TYPE.toString())) {
				List<SConfiguration> obj = select2(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_2_ROUND_TYPE.toString())) {
				List<SConfiguration> obj = select2(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_3.toString())) {
				List<SConfiguration> obj = select3(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_APPROVE.toString())) {
				List<SConfiguration> obj = selectApprove(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				SConfiguration obj = update(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				SConfiguration obj = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				SConfiguration obj = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.SAVE_APPLICATION_SETUP.toString())) {
				List<SConfiguration> obj = saveApplicationSetup(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.SELECT_2_TYPE_OF_AMMUNITION_SAFETY_DISTANCE.toString())) {
				List<SConfiguration> obj = select2(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.APPROVE.toString())) {
				SConfiguration obj = approve(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.SAVE_QUESTION_ANS.toString())) {
				SConfiguration obj = saveQuestionAns(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				SConfiguration obj = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.SELECT_ALL_ANS.toString())) {
				List<SConfiguration> obj = selectAllAns(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.SAVE_SIG_VIEW_SETUP.toString())) {
				List<SConfiguration> obj = sigViewSetup(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.SELECT_ALL_VIEW_SETUP.toString())) {
				List<SConfiguration> obj = selectAllViewSetup(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.SELECT_VIEW_SETUP.toString())) {
				List<SConfiguration> obj = selectViewSetup(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.SAVE_APP_CONFIG.toString())) {
				List<SConfiguration> obj = saveAppConfg(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.SELECT_ALL_APP_CONFIG.toString())) {
				List<SConfiguration> obj = selectAllAppConfig(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.SELECT_ALL_APP_AD_INFO.toString())) {
				List<SConfiguration> obj = selectAllAppAdInfo(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.SELECT_MAX_LENGTH_INFO.toString())) {
				List<SConfiguration> obj = selectAllMaxLengthInfo(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.SELECT_ALL_LAST_USER_CONFIG.toString())) {
				List<SConfiguration> obj = selectAllLastUserConfig(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.SELECT_ALL_CONTACT_INFO.toString())) {
				List<SConfiguration> obj = selectAllContactInfo(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.SELECT_ALL_CHARACTER_MAX_LENGTH.toString())) {
				List<SConfiguration> obj = selectAllMaxLengthConfig(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}else if (actionType.equals(ActionType.PASSWORD_ENCREPT.toString())) {
				SConfiguration obj = encPassword(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	


private List<SConfiguration> selectAllMaxLengthInfo(Message<List<SConfiguration>> requestMessage, String actionType) {
		SConfiguration sc = requestMessage.getPayload().get(0);
//		List<String> vlue5List = Arrays.asList("branchName","cbsBranchId"); 
	    List<String> vlue5List = Arrays.asList(
	            "displayName", "desc", "empId", "name2", "designation", 
	            "approval", "address", "department", "nid", "phone", 
	            "firstName", "lastName", "phoneNumber", "branch", 
	            "designationU", "nidU", "securityQuestion", "securityQuestionAnswer", 
	            "institutionName", "domain", "cbsBranchId", "branchName", 
	            "adCode", "routingNumber","numberUser","numberGenUser","displayNameP","descP","remarks"
	        );
		return config.findAllByConfigGroupAndValue5InAndActive(sc.getConfigGroup(), vlue5List, 1);
	}


	private List<SConfiguration> selectAllMaxLengthConfig(Message<List<SConfiguration>> requestMessage, String actionType) {
	    List<SConfiguration> payload = requestMessage.getPayload();
	    if (payload != null && !payload.isEmpty()) {
	        SConfiguration sc = payload.get(0);
	        List<SConfiguration> configurations = config.findAllByConfigSubGroupAndActive(sc.getConfigSubGroup(), 1);
	        if (configurations.size()!=0 ) {
	            System.out.println("Configurations found: " + configurations);
	        } else {
	            System.out.println("No configurations found for config group: " + sc.getConfigSubGroup());
	        }

	        return configurations;  
	    }
	    System.out.println("No valid payload found.");
	    return null;
	}
	
	
	private SConfiguration encPassword(Message<List<SConfiguration>> requestMessage, String actionType) {

		String password="";
	    SConfiguration payload = requestMessage.getPayload().get(0);
        log.info("Flag:password [{},{}]",payload.getEncDecFlag(),payload.getPassword());
		try {
			PooledPBEStringEncryptor encriptor=new PooledPBEStringEncryptor();
			SimpleStringPBEConfig config=new SimpleStringPBEConfig();
			config.setPassword("softcafe");
			config.setAlgorithm("PBEWithMD5AndDES");
			config.setKeyObtentionIterations(100);
			config.setPoolSize("1");
			config.setProviderName("SunJCE");
			config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
			config.setStringOutputType("base64");
			encriptor.setConfig(config);
			
			//password=encriptor.encrypt(payload.getPassword());
			//log.info("decrypt pass: {}",encriptor.decrypt(password));
			password=payload.getEncDecFlag().equals("Encrypt") ? encriptor.encrypt(payload.getPassword()) : encriptor.decrypt(payload.getPassword());

			log.info("upPassword:generatedPassword: [{},{}] ",payload.getPassword(),password);
			payload.setPassword(password);

			
			
		} catch (EncryptionOperationNotPossibleException e) {
			log.error("error generation from password encrepiton {}",e);
			payload.setPassword("Encrypt value is wrong.");
		}
		catch (Exception e) {
			log.error("error generation from password encrepiton {}",e);
			payload.setPassword("Getting error for execute this action. Please try again.");
		}
		
		return payload;
	}



	private List<SConfiguration> selectAllLastUserConfig(Message<List<SConfiguration>> requestMessage, String actionType) {
		SConfiguration sc = requestMessage.getPayload().get(0);
		List<String> vlue5List = Arrays.asList("LAST_LOGIN", "LAST_CHANGE_PASS"); 
		return config.findAllByConfigGroupAndConfigSubGroupAndValue5InAndActive(sc.getConfigGroup(), sc.getConfigSubGroup(), vlue5List, 1);
	}
	private List<SConfiguration> selectAllContactInfo(Message<List<SConfiguration>> requestMessage, String actionType) {
		SConfiguration sc = requestMessage.getPayload().get(0);
//		List<String> vlue5List = Arrays.asList("LAST_LOGIN", "LAST_CHANGE_PASS"); 
		return config.findAllByConfigGroupAndConfigSubGroupAndActive(sc.getConfigGroup(), sc.getConfigSubGroup(), 1);
	}

	private List<SConfiguration> selectAllAppAdInfo(Message<List<SConfiguration>> requestMessage, String actionType) {
		SConfiguration sc = requestMessage.getPayload().get(0);
		List<String> vlue5List = Arrays.asList("NAME", "EMAIL", "NUMBER"); 
		return config.findAllByConfigGroupAndConfigSubGroupAndValue5InAndActive(sc.getConfigGroup(), sc.getConfigSubGroup(), vlue5List, 1);
	}

	private List<SConfiguration> selectAllAppConfig(Message<List<SConfiguration>> requestMessage, String actionType) {
		SConfiguration sc = requestMessage.getPayload().get(0);

		return config.findByConfigGroupAndConfigSubGroupAndActiveOrderByConfigVerAsc(sc.getConfigGroup(),
				sc.getConfigSubGroup(), 1);
	}

	private List<SConfiguration> saveAppConfg(Message<List<SConfiguration>> requestMessage, String actionType) {
		List<SConfiguration> scList = requestMessage.getPayload().get(0).getRequestData();
		Long userId = requestMessage.getHeader().getUserId().longValue();

		try {
			for (SConfiguration sConfiguration : scList) {
				

				List<SConfiguration> sl = config.findAllByConfigGroupAndConfigSubGroupAndValue5AndActive(
						sConfiguration.getConfigGroup(), sConfiguration.getConfigSubGroup(), sConfiguration.getValue5(),
						1);

				if(sl.size() > 0) {
					sConfiguration = updateAppConfig(sConfiguration, sl.get(0), userId);
				}
				else {
					saveNewAppConfig(sConfiguration, userId);
				}
				
				config.save(sConfiguration);
			}
		} catch (Exception e) {
			log.info("getting error {}", e.getMessage());
		}

		return scList;
	}

	private void saveNewAppConfig(SConfiguration sConfiguration, Long userId) {
		sConfiguration.setCreatorId(userId);
		sConfiguration.setCreateDate(new Date());
	}

	private SConfiguration updateAppConfig(SConfiguration sc, SConfiguration dbSc, Long modId) {
		
		dbSc.setValue1(sc.getValue1());
		dbSc.setModDate(new Date());
		dbSc.setUserModId(modId);
		return dbSc;
	}

	private List<SConfiguration> selectAllViewSetup(Message<List<SConfiguration>> requestMessage, String actionType) {
		return config.findByConfigGroupAndConfigSubGroupAndActiveOrderByConfigVerAsc(Str.SIG_VIEW_SETUP,
				Str.SIG_VIEW_SUBGROUP, 1);
	}
	private List<SConfiguration> selectViewSetup(Message<List<SConfiguration>> requestMessage, String actionType) {
		return config.findByConfigGroupAndConfigSubGroupAndValue5AndActiveOrderByConfigVerAsc(Str.SIG_VIEW_SETUP,
				Str.SIG_VIEW_SUBGROUP, requestMessage.getPayload().get(0).getValue5(), 1);
	}

	private List<SConfiguration> sigViewSetup(Message<List<SConfiguration>> requestMessage, String actionType) {

		SConfiguration sc = requestMessage.getPayload().get(0);
		if (sc.getConfigNameList() == null || sc.getConfigNameList().size() <= 0) {
			return null;
		}
		List<String> configNameList = sc.getConfigNameList();

		log.info("try to save signature view setup configuration");
		return saveSigViewSetup(configNameList, sc.getValue5(), requestMessage.getHeader().getUserId().longValue());
	}

	private List<SConfiguration> saveSigViewSetup(List<String> configNameList, String value5, long userId) {

		// first remove the configuration
		List<SConfiguration> scList = config.findAllByConfigGroupAndConfigSubGroupAndValue5AndActive(Str.SIG_VIEW_SETUP,
				Str.SIG_VIEW_SUBGROUP, value5, 1);

		if (scList != null) {
			deleteExtConfig(scList, userId);
		}

		int configLevle = 1;
		for (String value : configNameList) {
			SConfiguration sc = new SConfiguration();
			sc.setConfigGroup(Str.SIG_VIEW_SETUP);
			sc.setConfigSubGroup(Str.SIG_VIEW_SUBGROUP);
			sc.setValue1(value);
			sc.setConfigVer(Long.valueOf(configLevle));
			sc.setCreatorId(userId);
			sc.setCreateDate(new Date());
			sc.setValue5(value5);
			config.save(sc);

			configLevle++;

		}

		return config.findByConfigGroupAndConfigSubGroupAndActiveOrderByConfigVerAsc(Str.SIG_VIEW_SETUP,
				Str.SIG_VIEW_SUBGROUP, 1);
	}

	private void deleteExtConfig(List<SConfiguration> scList, long userId) {

		for (SConfiguration sConfiguration : scList) {
			delete(sConfiguration, userId);
		}

	}

	private List<SConfiguration> selectAllAns(Message<List<SConfiguration>> requestMessage, String actionType) {
		SConfiguration sc = requestMessage.getPayload().get(0);
		log.info("Getting all answer");
		return config.findByConfigGroupAndConfigSubGroupAndActive(sc.getConfigGroup(), sc.getConfigSubGroup(), 1);
	}

	private SConfiguration saveQuestionAns(Message<List<SConfiguration>> requestMessage, String actionType) {
		SConfiguration sc = requestMessage.getPayload().get(0);
		SConfiguration dbSc = null;
		if (sc.getConfigId() != null) {
			log.info("[{}] config id found. try to save new.", sc.getConfigId());

			dbSc = config.findByConfigIdAndActive(sc.getConfigId(), 1);
			if (dbSc != null) {
				log.info("[{}] active confin element found. try to update new.", sc.getConfigId());

				dbSc.setValue1(sc.getValue1());
				sc.setValue5(String.valueOf(sc.getSecurityQuestionId()));
				dbSc.setUserModId(Long.valueOf(requestMessage.getHeader().getUserId()));
				dbSc.setModDate(new Date());
				config.save(dbSc);
			} else {
				log.info("active config not found. try to save new. for config id:{}", sc.getConfigId());
				dbSc = saveNewQuestinAns(sc, Long.valueOf(requestMessage.getHeader().getUserId()));
			}
		} else {
			log.info("config id not found. try to save new.");
			dbSc = saveNewQuestinAns(sc, Long.valueOf(requestMessage.getHeader().getUserId()));
		}

		return dbSc;
	}
	private SConfiguration delete(Message<List<SConfiguration>> requestMessage, String actionType) {
		SConfiguration sc = requestMessage.getPayload().get(0);
		SConfiguration dbSc = null;
		if (sc.getConfigId() != null) {
			log.info("[{}] config id found. try to save new.", sc.getConfigId());

			dbSc = config.findByConfigIdAndActive(sc.getConfigId(), 1);
			if (dbSc != null) {
				log.info("[{}] active confin element found. try to update new.", sc.getConfigId());

				dbSc.setActive(0);
				dbSc.setUserModId(requestMessage.getHeader().getUserId().longValue());
				dbSc.setModDate(new Date());
				config.save(dbSc);
			} else {
				log.info("active config not found. try to save new. for config id:{}", sc.getConfigId());
				dbSc = saveNewQuestinAns(sc, Long.valueOf(requestMessage.getHeader().getUserId()));
			}
		} else {
			log.info("config id not found. try to save new.");
//			dbSc = saveNewQuestinAns(sc, Long.valueOf(requestMessage.getHeader().getUserId()));
		}

		return dbSc;
	}

	private SConfiguration saveNewQuestinAns(SConfiguration sc, Long creatorId) {
		 HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		sc.setCreateDate(new Date());
		sc.setValue5(String.valueOf(sc.getSecurityQuestionId()));
		sc.setCreatorId(creatorId);
		sc.setIpAddr(request.getRemoteAddr());
		sc.setIpGateway(request.getHeader("X-Forwarded-For"));
		return config.save(sc);
	}

	private List<SConfiguration> selectApprove(Message<List<SConfiguration>> msg, String actionType) throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);
		List<SConfiguration> sc = config.findByConfigGroupAndConfigSubGroupAndValue5AndActive(sConfig.getConfigGroup(),
				sConfig.getConfigSubGroup(), sConfig.getValue5(), 1);
		return sc;
	}

	private SConfiguration approve(Message<List<SConfiguration>> msg, String actionType) throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);

		SConfiguration d = config.findById(sConfig.getConfigId()).get();

		d.setValue5(AppStatus.APPROVED);
		d.setApproveById(Long.valueOf(msg.getHeader().getUserId()));
		d.setApproveTime(new Date());
		d.setModDate(new Date());
		d.setUserModId(Long.valueOf(msg.getHeader().getUserId()));

		return config.save(d);
	}

	private List<SConfiguration> saveApplicationSetup(Message<List<SConfiguration>> msg, String actionType)
			throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);

		List<SConfiguration> requestData = sConfig.getRequestData();

		if (requestData.size() > 0) {
			try {
				for (Iterator iterator = requestData.iterator(); iterator.hasNext();) {
					SConfiguration sConfiguration = (SConfiguration) iterator.next();

					SConfiguration db = config.findByConfigGroupAndConfigSubGroupAndConfigNameAndActive(
							sConfiguration.getConfigGroup(), sConfiguration.getConfigSubGroup(),
							sConfiguration.getConfigName(), 1);

					if (db == null) {
						sConfiguration.setActive(1);
						sConfiguration.setCreateDate(new Date());
						sConfiguration.setCreatorId(Long.valueOf(msg.getHeader().getUserId()));
//						return insertApplicationSetup(msg, actionType);
						config.save(sConfiguration);
					}

					else {
						db.setValue1(sConfiguration.getValue1());
						db.setModDate(new Date());
						db.setUserModId(Long.valueOf(msg.getHeader().getUserId()));

						config.save(db);
					}

				}
			} catch (Exception e) {
				log.info("getting error to save application setup value: [{}]", e.getLocalizedMessage());
			}
		}
		return requestData;

	}

	private void insertApplicationSetup(SConfiguration sConfig) throws Exception {
//		SConfiguration sConfig = msg.getPayload().get(0);
		SConfiguration duplicate = config.duplicate(sConfig.getConfigGroup(), sConfig.getConfigSubGroup(),
				sConfig.getValue1());
		if (duplicate != null) {
			throw new Exception("Duplicate configuration [" + sConfig.getValue1() + "]");
		}

		else {
			config.save(sConfig);
		}
	}

	private SConfiguration save(Message<List<SConfiguration>> msg, String actionType) throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);

		if (sConfig.getConfigId() == null) {
			sConfig.setActive(1);
			sConfig.setCreateDate(new Date());
			sConfig.setCreatorId(Long.valueOf(msg.getHeader().getUserId()));
			sConfig.setValue5(NEW);
			return insert(msg, actionType);
		}
		return update(msg, actionType);
	}

	private SConfiguration insert(Message<List<SConfiguration>> msg, String actionType) throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);

		return saveConfig(sConfig);

	}

	public SConfiguration saveConfig(SConfiguration sConfig) throws Exception {
		SConfiguration duplicate = config.duplicate(sConfig.getConfigGroup(), sConfig.getConfigSubGroup(),
				sConfig.getValue1());
		if (duplicate != null) {
			throw new Exception("Duplicate configuration [" + sConfig.getValue1() + "]");
		}

		return config.save(sConfig);
	}

	public SConfiguration saveConfigForAgreement(SConfiguration sConfig, String comeFrom) throws Exception {
		boolean duplicate = config.existsByConfigGroupAndConfigSubGroupAndActive(sConfig.getConfigGroup(),
				sConfig.getConfigSubGroup(), 1);
		if (duplicate) {
			throw new Exception("Duplicate " + comeFrom + " File");
		}

		return config.save(sConfig);
	}

	private SConfiguration update(Message<List<SConfiguration>> msg, String actionType) throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);
		Optional<SConfiguration> present = config.findById(sConfig.getConfigId());
		if (!present.isPresent()) {
			throw new Exception("configuration not present [" + sConfig.getConfigName() + "]");
		}

		SConfiguration duplicate = config.duplicate(sConfig.getConfigGroup(), sConfig.getConfigSubGroup(),
				sConfig.getValue1());
		if (duplicate != null) {
			throw new Exception("Duplicate configuration [" + sConfig.getValue1() + "]");
		}
		sConfig.setModDate(new Date());
		sConfig.setUserModId(Long.valueOf(msg.getHeader().getUserId()));
		sConfig.setValue5(MODIFIED);
		return config.save(sConfig);
	}

	private List<SConfiguration> select(Message<List<SConfiguration>> msg, String actionType) {
		return StreamSupport.stream(config.findAll().spliterator(), false).collect(Collectors.toList());
	}

	private List<SConfiguration> select1(Message<List<SConfiguration>> msg, String actionType) {
		SConfiguration sConfig = msg.getPayload().get(0);
		return select1(sConfig);
	}

	public List<SConfiguration> select1(SConfiguration sConfig) {
		return config.findByConfigGroupAndActive(sConfig.getConfigGroup(), 1);
	}

	private List<SConfiguration> select2(Message<List<SConfiguration>> msg, String actionType) {
		SConfiguration sConfig = msg.getPayload().get(0);
		return select2(sConfig);
	}

	public List<SConfiguration> select2(SConfiguration sConfig) {
		return config.findByConfigGroupAndConfigSubGroupAndActive(sConfig.getConfigGroup(), sConfig.getConfigSubGroup(),
				1);
	}

	private List<SConfiguration> select3(Message<List<SConfiguration>> msg, String actionType) {
		SConfiguration sConfig = msg.getPayload().get(0);
		return select3(sConfig);
	}

	public List<SConfiguration> select3(SConfiguration sConfig) {
		return config.findByConfigGroupAndConfigSubGroupAndConfigNameInAndActive(sConfig.getConfigGroup(),
				sConfig.getConfigSubGroup(), sConfig.getConfigNameList(), 1);
	}

	public SConfiguration select3(String groupName, String subGroupName, String configName) {
		return config.findByConfigGroupAndConfigSubGroupAndConfigNameAndActive(groupName, subGroupName, configName, 1);
	}

	private List<SConfiguration> select4(Message<List<SConfiguration>> msg, String actionType) {
		SConfiguration sConfig = msg.getPayload().get(0);
		return select4(sConfig);
	}

	public List<SConfiguration> select4(SConfiguration sConfig) {
		return config.findByConfigGroupAndConfigSubGroupAndConfigNameAndActiveOrderByValue1Asc(sConfig.getConfigGroup(),
				sConfig.getConfigSubGroup(), sConfig.getConfigName(), 1);
	}

	public void deleteConfig(Long configId, long userId) {

		log.info("try to delete config. configId:{}", configId);
		SConfiguration sc = config.findByConfigIdAndActive(configId, 1);
		if (sc == null) {
			log.info("Can not find active config value for configId:{}", configId);
//			throw new Exception("");

		} else {
			delete(sc, userId);

		}
	}

	private void delete(SConfiguration sc, long userId) {
		sc.setActive(0);
		sc.setUserModId(userId);
		config.save(sc);

	}

	public List<SConfiguration> findAllAns4QuestionId(Long questionId) {
		// TODO Auto-generated method stub
		return config.findByConfigGroupAndConfigSubGroupAndValue5AndActive(Str.QUESTION, Str.QUESTION_ANS,
				questionId.toString(), 1);
	}

	public List<SConfiguration> findConfigValueByGroupSubGroupValue5(String group, String subgroup,
			String value5) {
		return config.findAllByConfigGroupAndConfigSubGroupAndValue5AndActive(group, subgroup, value5, 1);
	}

}
