package com.softcafe.mapper;

import java.util.LinkedHashMap;
import java.util.Map;

public class LegalEntityDbBeanMap {
	private static Map<String, String> bean2SqlMap = null;
	private static Map<String, String> rs2BeanMap = null;
	// when we send parameter our font end to db 
	public static final Map<String, String> getBean2SqlMap() {

		if (bean2SqlMap == null) {
			bean2SqlMap = new LinkedHashMap<String, String>();
			bean2SqlMap.putAll(BaseDbBeanMap.getBaseBean2SqlMap());
			
			
			bean2SqlMap.put("@tx_action_name", "actionName");
			bean2SqlMap.put("@id_legal_entity_key", "branchId");
			bean2SqlMap.put("@tx_legal_entity_name", "branchName");
			bean2SqlMap.put("@tx_cbs_branch_id", "cbsBranchId");
			bean2SqlMap.put("@is_head_office", "headOffice");
			bean2SqlMap.put("@tx_ad_code", "adCode");
			bean2SqlMap.put("@tx_router_number", "routingNumber");
			bean2SqlMap.put("@tx_status", "status");
			
		}
		return bean2SqlMap;
	} 

	// when we get parameter from db to java 
	public static final Map<String, String> getRs2BeanMap() {

		if (rs2BeanMap == null) {
			rs2BeanMap = new LinkedHashMap<String, String>();
			rs2BeanMap.putAll(BaseDbBeanMap.getBaseRs2BeanMap());
			
			rs2BeanMap.put("id_legal_entity_key", "branchId");
			rs2BeanMap.put("tx_legal_entity_name", "branchName");
			rs2BeanMap.put("tx_cbs_branch_id", "cbsBranchId");
			rs2BeanMap.put("is_head_office", "headOffice");
			rs2BeanMap.put("tx_ad_code", "adCode");
			rs2BeanMap.put("tx_router_number", "routingNumber");
			rs2BeanMap.put("tx_status", "status");
			
			
		}
	
		return rs2BeanMap;
	}
}
