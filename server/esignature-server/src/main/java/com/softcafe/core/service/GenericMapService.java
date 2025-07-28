package com.softcafe.core.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delfian.core.jdbc.helper.JdbcResult;
import com.delfian.core.jdbc.helper.JdbcStoredProcedure;
import com.delfian.core.jdbc.utils.JdbcUtils;
import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.constants.RsType;
import com.softcafe.constants.SpName;
import com.softcafe.core.model.GenericMap;
import com.softcafe.core.model.User;
import com.softcafe.core.repo.GenericMapRepo;
import com.softcafe.mapper.GenericMapDbBean;

@Service(value ="GenericMapService")
public class GenericMapService extends AbstractService<GenericMap> {
	private static final Logger log = LoggerFactory.getLogger(GenericMapService.class);
	@Autowired GenericMapRepo genericMapRepo;
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<GenericMap> objList = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				List<GenericMap> objList = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				List<GenericMap> objList = update(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				List<GenericMap> objList = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.IS_ASSIGN_ROLE.toString())) {
				List<GenericMap> objList = isPresentRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
		}

		return msgResponse;
	}

	private List<GenericMap> isPresentRole(Message<List<GenericMap>> message, String actionType) {
		
		GenericMap m=message.getPayload().get(0);
		
		  List<GenericMap> list=genericMapRepo.findByFromIdAndActive(m.getFromId(),1);
		  
		  return list;
	}

	private List<GenericMap> select(Message<List<GenericMap>> message, String action) throws Exception {
		return executeAction(message, action);
	}

	private List<GenericMap> insert(Message<List<GenericMap>> message, String action) throws Exception {
		return executeAction(message, action);
	}

	public void insert(List<GenericMap> genericMapList, String action) throws Exception {
		genericMapList.parallelStream().forEach( map ->{
			try {
				executeAction(map, action);
			} catch (Exception e) {
				log.error("Error executing action/id [{}]",action);
			}
		});
	}
	
	public GenericMap insert(GenericMap genericMap) throws Exception {
		return doInsert(genericMap);
	}


	private List<GenericMap> update(Message<List<GenericMap>> message, String action) throws Exception {
		return executeAction(message, action);
	}
	
	

	private List<GenericMap> delete(Message<List<GenericMap>> message, String action) throws Exception {
		return executeAction(message, action);
	}

	private List<GenericMap> executeAction(Message<List<GenericMap>> message, String action) throws Exception {

		List<GenericMap> genericMapList = null;
		GenericMap genericMap = null;
		JdbcResult jdbcResult = new JdbcResult();
		List<GenericMap> objList = new LinkedList<>();

		try {

			JdbcStoredProcedure jdbcStoredProcedure = getJdbcService()
					.getJdbcStoredProcedure(SpName.ACT_GENERIC_MAP.toString());

			jdbcResult.setFilteredOutputParamMap(jdbcStoredProcedure.getSpOutputParamMap());

			jdbcResult.setProcessWarnings(false);

			genericMap = message.getPayload().get(0);

			Map<String, Object> spArgsMap = JdbcUtils.createSqlMap(genericMap, GenericMapDbBean.getBean2SqlMap());

			jdbcResult = getJdbcService().executeSP(action, null, SpName.ACT_GENERIC_MAP.toString(), spArgsMap,
					jdbcResult);

			genericMapList = JdbcUtils.mapRows(GenericMap.class, GenericMapDbBean.getRs2BeanMap(),
					jdbcResult.getRsTypeMap(RsType.RS_TYPE_GENERIC_MAP.toString()));
			genericMap.setGenericMapList(genericMapList);

			objList.add(genericMap);

		} catch (Exception e) {

			log.error("Exception on processing [{}] [{}]", action, e.getLocalizedMessage());
			throw new Exception(e);

		}
		return objList;
	}
	
	public GenericMap inactiveAll(GenericMap genericMap, String action) throws Exception {
		return doExecuteAction(genericMap, action);
	}

	public GenericMap executeAction(GenericMap genericMap, String action) throws Exception {
		return doExecuteAction(genericMap, action);
	}
	private GenericMap doExecuteAction(GenericMap genericMap, String action) throws Exception {
		JdbcResult jdbcResult = new JdbcResult();
		try {
			JdbcStoredProcedure jdbcStoredProcedure = getJdbcService()
					.getJdbcStoredProcedure(SpName.ACT_GENERIC_MAP.toString());

			jdbcResult.setFilteredOutputParamMap(jdbcStoredProcedure.getSpOutputParamMap());

			jdbcResult.setProcessWarnings(false);

			Map<String, Object> spArgsMap = JdbcUtils.createSqlMap(genericMap, GenericMapDbBean.getBean2SqlMap());

			getJdbcService().executeSP(action, null, SpName.ACT_GENERIC_MAP.toString(), spArgsMap,
					jdbcResult);

		} catch (Exception e) {

			log.error("Exception on processing [{}] [{}]", action, e.getLocalizedMessage());
			throw new Exception(e);

		}
		return genericMap;
	}
	
	private GenericMap doInsert(GenericMap genericMap) throws Exception {
		JdbcResult jdbcResult = new JdbcResult();
		try {
			JdbcStoredProcedure jdbcStoredProcedure = getJdbcService()
					.getJdbcStoredProcedure(SpName.ACT_GENERIC_MAP.toString());

			jdbcResult.setFilteredOutputParamMap(jdbcStoredProcedure.getSpOutputParamMap());

			jdbcResult.setProcessWarnings(false);

			Map<String, Object> spArgsMap = JdbcUtils.createSqlMap(genericMap, GenericMapDbBean.getBean2SqlMap());

			jdbcResult = getJdbcService().executeSP(ActionType.ACTION_NEW.toString(), null, SpName.ACT_GENERIC_MAP.toString(), spArgsMap,
					jdbcResult);
			
			Map<String, Object> outMap = jdbcResult.getOutputParamValueMap();
			if(outMap.containsKey("@id_generic_map_key")){
				Long id = (Long) outMap.get("@id_generic_map_key");
				genericMap.setGenericMapId(id);
			}
			if(outMap.containsKey("@id_generic_map_ver")){
				Integer ver = (Integer) outMap.get("@id_generic_map_ver");
				genericMap.setGenericMapVer(ver);
			}
			

		} catch (Exception e) {

			log.error("Exception on processing [{}] [{}]", e);
			throw new Exception(e);

		}
		return genericMap;
	}

	

}
