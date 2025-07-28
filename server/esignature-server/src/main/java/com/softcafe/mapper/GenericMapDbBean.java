package com.softcafe.mapper;

import java.util.LinkedHashMap;
import java.util.Map;

public class GenericMapDbBean {
	
	private static Map<String, String> bean2SqlMap = null;
	private static Map<String, String> rs2BeanMap = null;
	// when we send parameter our font end to db 
	public static final Map<String, String> getBean2SqlMap() {

		if (bean2SqlMap == null) {
			bean2SqlMap = new LinkedHashMap<String, String>();
			bean2SqlMap.putAll(BaseDbBeanMap.getBaseBean2SqlMap());
			
			bean2SqlMap.put("@id_location_key", "locationId");
			bean2SqlMap.put("@id_location_ver", "locationVer");
			
			bean2SqlMap.put("@tx_from_type", "fromTypeName");
			bean2SqlMap.put("@id_from_key", "fromId");
			bean2SqlMap.put("@id_to_key", "toId");
			bean2SqlMap.put("@tx_to_type", "toTypeName");
			
		}
		return bean2SqlMap;
	} 

	// when we get parameter from db to java 
	public static final Map<String, String> getRs2BeanMap() {

		if (rs2BeanMap == null) {
			rs2BeanMap = new LinkedHashMap<String, String>();
			rs2BeanMap.putAll(BaseDbBeanMap.getBaseRs2BeanMap());
			
			rs2BeanMap.put("id_location_key", "locationId");
			rs2BeanMap.put("id_location_ver", "locationVer");
			
			rs2BeanMap.put("tx_from_type", "fromTypeName");
			rs2BeanMap.put("id_from_key", "fromId");
			rs2BeanMap.put("id_to_key", "toId");
			rs2BeanMap.put("tx_to_type", "toTypeName");
		
		}
	
		return rs2BeanMap;
	}

}
