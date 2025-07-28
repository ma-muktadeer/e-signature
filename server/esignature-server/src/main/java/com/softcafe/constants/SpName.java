package com.softcafe.constants;

public enum SpName {
	
	SP_ACT_USER("ACT_user"),
	
	SP_ACT_GROUP("ACT_group"),
	INS_USER("INS_user"),
	SEL_USER("SEL_user"),
	
	ACT_or_data("ACT_or_data"),
	ACT_ammo_type("ACT_ammo_type"),
	ACT_search("ACT_search"),
	Act_search_ammunation("Act_search_ammunation"),
	Act_search_ammunation_pdf("Act_search_ammunation_pdf"),
	ACT_trip("ACT_trip"),
	ACT_client("ACT_client"),
	ACT_product("ACT_product"),
	ACT_port("ACT_port"),
	ACT_value_config("ACT_value_config"),
	ACT_dashboard("ACT_dashboard"),
	
	ACT_head("ACT_head"),
	ACT_victim_info("ACT_victim_info"),
	
	ACT_trip_point("ACT_trip_point"),
	ACT_fusion_config("ACT_fusion_config"),
	ACT_catagory("ACT_catagory"),
	ACT_file_name("ACT_file_name"),
	ACT_configured_overview("ACT_configured_overview"),
	
	
	ACT_CONTACT_GROUP_MAPPING("ACT_contact_group_mapping"),
	SP_ACT_INCIDENT("ACT_incident"),
	SP_SEL_DASHBOARD("SEL_dashboard"),
	SP_SEL_NUMBER_OF_INCIDENT("SEL_numberof_incident"),
	SP_SEL_INCIDENT_OVERVIEW("SEL_incident_overview"),
	SEL_LOCATION("SEL_location"),
	ACT_LOCATION("ACT_location"),
	SEL_DROP_DOWN("SEL_drop_down"),
	ACT_GENERIC_MAP("ACT_generic_map"),
	SEL_UNPQ("SEL_unpq"),
	ACT_UNPQ("ACT_unpq"),
	Act_search_load_table("Act_search_load_table"),
	SEL_swift_search_back("SEL_swift_search_back"),
	ACT_MAIL_TRACKER("ACT_MAIL_TRACKER"),
	ACT_SMS_TRACKER("ACT_SMS_TRACKER"),
	ACT_business_exception("ACT_business_exception"),
	SEL_swift_search_back_out("SEL_swift_search_back_out"),
	
	
	
	
	;
	
	private final String spName;

	private SpName(String spName) {
		this.spName = spName;
	}
	
	@Override
	public String toString() {
		return spName;
	}

}
