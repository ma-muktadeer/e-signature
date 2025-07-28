package com.softcafe.mapper;

import java.util.LinkedHashMap;
import java.util.Map;

public class LocationDbBeanMap {
	
	
	private static Map<String, String> bean2SqlMap = null;
	private static Map<String, String> rs2BeanMap = null;
	// when we send parameter our font end to db 
	public static final Map<String, String> getBean2SqlMap() {

		if (bean2SqlMap == null) {
			bean2SqlMap = new LinkedHashMap<String, String>();
			bean2SqlMap.putAll(BaseDbBeanMap.getBaseBean2SqlMap());
			
			bean2SqlMap.put("@id_location_key", "locationId");
			bean2SqlMap.put("@id_location_ver", "locationVer");
			bean2SqlMap.put("@tx_loc_name", "locationName");
			bean2SqlMap.put("@tx_loc_type", "locationType");
			bean2SqlMap.put("@id_parent_key", "parentId");
			bean2SqlMap.put("@tx_parent_name", "parentName");
			bean2SqlMap.put("@tx_currency", "currencyCode");
			bean2SqlMap.put("@dec_latitude", "latitude");
			bean2SqlMap.put("@dec_longitude", "longitude");
			bean2SqlMap.put("@tx_desc", "desc");
			
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
			rs2BeanMap.put("tx_loc_name", "locationName");
			rs2BeanMap.put("tx_loc_type", "locationType");
			rs2BeanMap.put("id_parent_key", "parentId");
			rs2BeanMap.put("tx_parent_name", "parentName");
			rs2BeanMap.put("tx_currency", "currencyCode");
			rs2BeanMap.put("dec_latitude", "latitude");
			rs2BeanMap.put("dec_longitude", "longitude");
			rs2BeanMap.put("tx_desc", "desc");
			rs2BeanMap.put("tx_short_name", "shortName");
		
		}
	
		return rs2BeanMap;
	}

}
