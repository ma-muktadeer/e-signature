package com.softcafe.mapper;

import java.util.LinkedHashMap;
import java.util.Map;

public class RoleDbBeanMap {
	
	private static Map<String, String> bean2SqlMap = null;
	private static Map<String, String> rs2BeanMap = null;
	
	public static final Map<String, String> getBean2SqlMap() {

		if (bean2SqlMap == null) {
			bean2SqlMap = new LinkedHashMap<String, String>();
			bean2SqlMap.putAll(BaseDbBeanMap.getBaseBean2SqlMap());
			bean2SqlMap.put("@id_role_key", "roleId");
			bean2SqlMap.put("@id_role_ver", "roleVer");
			
			bean2SqlMap.put("@tx_role_name", "roleName");
			bean2SqlMap.put("@tx_role_type", "roleType");
			bean2SqlMap.put("@tx_role_group", "roleGroup");
			bean2SqlMap.put("@tx_desc", "desc");
		}
		return bean2SqlMap;
	} 

	
	public static final Map<String, String> getRs2BeanMap() {

		if (rs2BeanMap == null) {
			rs2BeanMap = new LinkedHashMap<String, String>();
			rs2BeanMap.putAll(BaseDbBeanMap.getBaseRs2BeanMap());
			
			rs2BeanMap.put("id_role_key", "roleId");
			rs2BeanMap.put("id_role_ver", "roleVer");
			
			rs2BeanMap.put("tx_role_name", "roleName");
			rs2BeanMap.put("tx_role_type", "roleType");
			rs2BeanMap.put("tx_role_group", "roleGroup");
			rs2BeanMap.put("tx_desc", "desc");
			rs2BeanMap.put("is_assign", "assign");
		
		}
		
		return rs2BeanMap;
	}


}
