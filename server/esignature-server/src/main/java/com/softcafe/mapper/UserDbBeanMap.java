package com.softcafe.mapper;

import java.util.LinkedHashMap;
import java.util.Map;

public class UserDbBeanMap {
	
	private static Map<String, String> bean2SqlMap = null;
	private static Map<String, String> rs2BeanMap = null;
	
	public static final Map<String, String> getBean2SqlMap() {

		if (bean2SqlMap == null) {
			bean2SqlMap = new LinkedHashMap<String, String>();
			bean2SqlMap.putAll(BaseDbBeanMap.getBaseBean2SqlMap());
			bean2SqlMap.put("@id_user_key", "userId");
			bean2SqlMap.put("@id_user_ver", "userVer");
			
			bean2SqlMap.put("@tx_first_name", "firstName");
			bean2SqlMap.put("@tx_middle_name", "middleName");
			bean2SqlMap.put("@tx_last_name", "lastName");
			bean2SqlMap.put("@tx_gender", "gender");
			bean2SqlMap.put("@tx_religion", "religion");
			
			bean2SqlMap.put("@dtt_dob", "dob");
			bean2SqlMap.put("@tx_present_adr", "presentAddress");
			bean2SqlMap.put("@tx_permanent_adr", "permanentAddress");
			
			
			bean2SqlMap.put("@tx_country", "country");
			bean2SqlMap.put("@tx_phn_number", "phoneNumber");
			bean2SqlMap.put("@tx_email", "email");
			bean2SqlMap.put("@tx_login_name", "loginName");
			bean2SqlMap.put("@tx_pass", "password");
			bean2SqlMap.put("@tx_new_pass", "newPass");
			bean2SqlMap.put("@tx_tmp_pass", "tmpPass");
		}
		return bean2SqlMap;
	} 

	
	public static final Map<String, String> getRs2BeanMap() {

		if (rs2BeanMap == null) {
			rs2BeanMap = new LinkedHashMap<String, String>();
			rs2BeanMap.putAll(BaseDbBeanMap.getBaseRs2BeanMap());
			
			rs2BeanMap.put("id_user_key", "userId");
			rs2BeanMap.put("id_user_ver", "userVer");
			
			rs2BeanMap.put("tx_first_name", "firstName");
			rs2BeanMap.put("tx_middle_name", "middleName");
			rs2BeanMap.put("tx_last_name", "lastName");
			rs2BeanMap.put("tx_gender", "gender");
			rs2BeanMap.put("tx_religion", "religion");
			
			rs2BeanMap.put("dtt_dob", "dob");
			rs2BeanMap.put("tx_present_adr", "presentAddress");
			rs2BeanMap.put("tx_permanent_adr", "permanentAddress");
			
			
			rs2BeanMap.put("tx_country", "country");
			rs2BeanMap.put("tx_phn_number", "phoneNumber");
			rs2BeanMap.put("tx_email", "email");
			rs2BeanMap.put("tx_login_name", "loginName");
			rs2BeanMap.put("tx_pass", "password");
			rs2BeanMap.put("tx_tmp_pass", "tmpPass");
		
		}
		
		return rs2BeanMap;
	} 

}
