package com.softcafe.core.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

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
import com.softcafe.core.model.Location;
import com.softcafe.core.repo.LocationRepo;
import com.softcafe.core.util.AppUtils;
import com.softcafe.core.util.LocationUtils;
import com.softcafe.mapper.LocationDbBeanMap;
@Service(value="locationService")
public class LocationService extends AbstractService<Location> {
	private static final Logger log = LoggerFactory.getLogger(LocationService.class);
	
	// this six variable cache locaiton. do not use this variable other place
	private static List<Location> coutryList = new LinkedList<>();
	private static List<Location> divisionList = new LinkedList<>();
	private static List<Location> districtList = new LinkedList<>();
	private static List<Location> thanaList = new LinkedList<>();
	private static Location location;
	public static List<Location> locationList = new ArrayList<>();
	public static List<Location> gLocationList = new ArrayList<>();
	
	@Autowired
	private LocationRepo locationRepo;
//---------------------------------------------------------------------------------------------

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;	
		
		try {
			
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			
			
			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<Location> objList = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				List<Location> objList = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				List<Location> objList = update(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				List<Location> objList = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			}
			else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				List<Location> objList = selectAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			}
			else if (actionType.equals(ActionType.ACTION_LOAD_LOCATION.toString())) {
				Location objList = loadLocation(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			}
			else {
				log.info("No action handle [{}]", actionType);
			}
	
			
		} 
		catch (Exception ex) {
			
			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);
			
			log.error("Exception Message **** [{}]", ex.getLocalizedMessage() );
		}
		
		return msgResponse;
	}
	
	private Location loadLocation(Message requestMessage, String actionType) {
		return location;
	}

	public void init(){
		try {
			
			
			JdbcResult jdbcResult = new JdbcResult();
			JdbcStoredProcedure jdbcStoredProcedure = getJdbcService().getJdbcStoredProcedure(SpName.SEL_LOCATION.toString());
			jdbcResult.setFilteredOutputParamMap(jdbcStoredProcedure.getSpOutputParamMap());
			Map<String, Object> spArgsMap =  new HashMap<>();
			
			jdbcResult = getJdbcService().executeSP(ActionType.ACTION_SELECT_ALL.toString(), null, SpName.SEL_LOCATION.toString(), spArgsMap, jdbcResult);
			
			coutryList = JdbcUtils.mapRows(Location.class, LocationDbBeanMap.getRs2BeanMap(), jdbcResult.getRsTypeMap(RsType.RS_TYPE_COUNTRY.toString()));
			divisionList = JdbcUtils.mapRows(Location.class, LocationDbBeanMap.getRs2BeanMap(), jdbcResult.getRsTypeMap(RsType.RS_TYPE_DIVISION.toString()));
			districtList = JdbcUtils.mapRows(Location.class, LocationDbBeanMap.getRs2BeanMap(), jdbcResult.getRsTypeMap(RsType.RS_TYPE_DISTRICT.toString()));
			thanaList = JdbcUtils.mapRows(Location.class, LocationDbBeanMap.getRs2BeanMap(), jdbcResult.getRsTypeMap(RsType.RS_TYPE_THANA.toString()));
			
			if(null == location){
				location = new Location();
			}
			location.setCountryList(coutryList);
			location.setDivisionList(divisionList);
			location.setDistrictList(districtList);
			location.setThanaList(thanaList);
			
			locationList.add(location);
			
		} catch (Exception e) {
			log.error("Exception on initializing location unit {}" , e);
		}
		
	}
	
	@PostConstruct
	public void initLocation(){
		try {
			
			gLocationList = AppUtils.toList(locationRepo.findAll());
			
			coutryList = LocationUtils.getCountryList(gLocationList);
			
			divisionList = LocationUtils.getDivisionList(gLocationList);
			
			districtList = LocationUtils.getDistrictList(gLocationList);
			
			thanaList = LocationUtils.getPoliceStatiionList(gLocationList);
			
			if(null == location){
				location = new Location();
			}
			location.setCountryList(coutryList);
			location.setDivisionList(divisionList);
			location.setDistrictList(districtList);
			location.setThanaList(thanaList);
			
			locationList = gLocationList;
			
		} catch (Exception e) {
			log.error("Exception on initializing location unit {}" , e);
		}
		
	}
	
	private List<Location> selectAll(Message<List<Location>> message , String action)throws Exception{
		
		if(locationList.size() > 0){
			return locationList;
		}
		init();
		return locationList;
	}
	
	private List<Location> select(Message<List<Location>> message , String action)throws Exception{
		return executeAction(message, action);
	}
	
	private List<Location> insert(Message<List<Location>> message , String action)throws Exception{
		return executeAction(message, action);
	}
	
	private List<Location> update(Message<List<Location>> message, String action) throws Exception {
		return executeAction(message, action);
	}

	private List<Location> delete(Message<List<Location>> message, String action) throws Exception {
		return executeAction(message, action);
	}
	
	private List<Location> executeAction(Message<List<Location>> message , String action)throws Exception{
		
		List<Location> locationUnitList = null;
		Location location = null;
		JdbcResult jdbcResult = new JdbcResult();
		
		try {
			
			JdbcStoredProcedure jdbcStoredProcedure = getJdbcService().getJdbcStoredProcedure(SpName.ACT_LOCATION.toString());
			
			jdbcResult.setFilteredOutputParamMap(jdbcStoredProcedure.getSpOutputParamMap());
			
			jdbcResult.setProcessWarnings(false);
				
			location =  message.getPayload().get(0);
			
			Map<String, Object> spArgsMap =  JdbcUtils.createSqlMap(location, LocationDbBeanMap.getBean2SqlMap());
			
			jdbcResult = getJdbcService().executeSP(action, null, SpName.ACT_LOCATION.toString(), spArgsMap, jdbcResult);
			
			locationUnitList = JdbcUtils.mapRows(Location.class, LocationDbBeanMap.getRs2BeanMap(), jdbcResult.getRsTypeMap(RsType.RS_TYPE_INCIDENT.toString()));
			

		} catch (Exception e) {
			
			log.error("Exception on processing [{}] [{}]" ,action, e.getLocalizedMessage());
			throw new Exception(e);
			
		}
		return locationUnitList;
	}

}
