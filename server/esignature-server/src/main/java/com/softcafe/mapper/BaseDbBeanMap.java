package com.softcafe.mapper;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class BaseDbBeanMap {
	
	public static Map<String, String> bean2SqlMap = null;
	public static Map<String, String> rs2BeanMap = null;
	
	public static final Map<String, String> getBaseBean2SqlMap() {

		if (bean2SqlMap == null) {
			bean2SqlMap = new ConcurrentHashMap<String, String>();
			
			bean2SqlMap.put("@is_active", "active");
			bean2SqlMap.put("@id_user_mod_key", "userModId");
			bean2SqlMap.put("@dtt_mod", "modDate");
			bean2SqlMap.put("@tx_create_by", "createBy");
			bean2SqlMap.put("@dtt_create", "createDate");
			bean2SqlMap.put("@tx_mod_by", "modifyBy");
			bean2SqlMap.put("@dtt_from", "fromDate");
			bean2SqlMap.put("@dtt_to", "toDate");
			bean2SqlMap.put("@id_user_create_key", "createorId");
			
		}
		return bean2SqlMap;
	} 

	public static final Map<String, String> getBaseRs2BeanMap() {

		if (rs2BeanMap == null) {
			rs2BeanMap = new ConcurrentHashMap<String, String>();
			
			rs2BeanMap.put("is_active", "active");
			rs2BeanMap.put("id_user_mod_key", "userModId");
			rs2BeanMap.put("dtt_mod", "modDate");
			rs2BeanMap.put("tx_create_by", "createBy");
			rs2BeanMap.put("dtt_create", "createDate");
			rs2BeanMap.put("tx_mod_by", "modifyBy");
			rs2BeanMap.put("dtt_from", "fromDate");
			rs2BeanMap.put("dtt_to", "toDate");
			rs2BeanMap.put("id_user_create_key", "createorId");
			
			
			
		}
		
		return rs2BeanMap;
	}

}
