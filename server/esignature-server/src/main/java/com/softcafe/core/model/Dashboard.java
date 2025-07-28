package com.softcafe.core.model;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Dashboard {
	
	private int numberOfMesg;
	private int outBound;
	private int inBound;
	private String  stateName;
	private String  direction;
	private String  legalEntName;
	private String  msgType;
	
	private Integer branchId;
	
	
	List<Dashboard> totalInOutList;
	List<Dashboard> branchOutList;
	List<Dashboard> branchInList;
	List<Dashboard> stateList ;
	List<Dashboard> branchList;
	List<Dashboard> mtWiseMsgCountList;
	

	
	
	
	public static Map<String, String> bean2SqlMap = null;
	public static Map<String, String> rs2BeanMap = null;
	
	public static final Map<String, String> getBean2SqlMap() {

		if (bean2SqlMap == null) {
			bean2SqlMap = new LinkedHashMap<String, String>();
			
			bean2SqlMap.put("@nmb_of_cnt", "numberOfMesg");
			bean2SqlMap.put("@out_bound", "outBound");
			
			bean2SqlMap.put("@in_bound", "inBound");
			bean2SqlMap.put("@tx_direction", "direction");
			bean2SqlMap.put("@tx_state_name", "stateName");
			bean2SqlMap.put("@tx_legal_entity_name", "legalEntName");
			bean2SqlMap.put("@id_legal_entity_key", "branchId");
			
			
		}
		return bean2SqlMap;
	} 
	
	public static Map<String, String> getRs2BeanMap() {
		if (rs2BeanMap == null) {
			rs2BeanMap = new LinkedHashMap<String, String>();

			rs2BeanMap.put("nmb_of_cnt", "numberOfMesg");
			rs2BeanMap.put("out_bound", "outBound");
			
			rs2BeanMap.put("in_bound", "inBound");
			rs2BeanMap.put("tx_direction", "direction");
			rs2BeanMap.put("tx_state_name", "stateName");
			rs2BeanMap.put("tx_legal_entity_name", "legalEntName");
			rs2BeanMap.put("tx_msg_type", "msgType");
			
		}
		return rs2BeanMap;
	}

	
	
	public int getNumberOfMesg() {
		return numberOfMesg;
	}
	public void setNumberOfMesg(int numberOfMesg) {
		this.numberOfMesg = numberOfMesg;
	}
	public int getOutBound() {
		return outBound;
	}
	public void setOutBound(int outBound) {
		this.outBound = outBound;
	}
	public int getInBound() {
		return inBound;
	}
	public void setInBound(int inBound) {
		this.inBound = inBound;
	}

	public String getStateName() {
		return stateName;
	}

	public void setStateName(String stateName) {
		this.stateName = stateName;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}

	public String getLegalEntName() {
		return legalEntName;
	}

	public void setLegalEntName(String legalEntName) {
		this.legalEntName = legalEntName;
	}

	public List<Dashboard> getTotalInOutList() {
		return totalInOutList;
	}

	public void setTotalInOutList(List<Dashboard> totalInOutList) {
		this.totalInOutList = totalInOutList;
	}

	public List<Dashboard> getStateList() {
		return stateList;
	}

	public void setStateList(List<Dashboard> stateList) {
		this.stateList = stateList;
	}

	

	public List<Dashboard> getBranchList() {
		return branchList;
	}

	public void setBranchList(List<Dashboard> branchList) {
		this.branchList = branchList;
	}

	public Integer getBranchId() {
		return branchId;
	}

	public void setBranchId(Integer branchId) {
		this.branchId = branchId;
	}

	
	public List<Dashboard> getBranchOutList() {
		return branchOutList;
	}

	public void setBranchOutList(List<Dashboard> branchOutList) {
		this.branchOutList = branchOutList;
	}

	public List<Dashboard> getBranchInList() {
		return branchInList;
	}

	public void setBranchInList(List<Dashboard> branchInList) {
		this.branchInList = branchInList;
	}

	public String getMsgType() {
		return msgType;
	}

	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}

	public List<Dashboard> getMtWiseMsgCountList() {
		return mtWiseMsgCountList;
	}

	public void setMtWiseMsgCountList(List<Dashboard> mtWiseMsgCountList) {
		this.mtWiseMsgCountList = mtWiseMsgCountList;
	}

	
	
 

}
