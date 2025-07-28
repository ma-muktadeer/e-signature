package com.softcafe.core.service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.constants.AppStatus;
import com.softcafe.core.model.AppPermission;
import com.softcafe.core.model.Role;
import com.softcafe.core.repo.AppPermissionRepo;
import com.softcafe.core.repo.GenericMapRepo;
import com.softcafe.core.util.AppUtils;

@Service
public class AppPermissionService extends AbstractService<List<AppPermission>> {

	private static final Logger log = LogManager.getLogger();
	@Autowired
	AppPermissionRepo permissionRepo;

	
	@Autowired
	SharedGenericMapService sharedGenericMapService;
	
	@Autowired
	RoleService roleService;
	
	@Autowired
	private GenericMapRepo genericMapRepo;
	
	
	private static final String APP_PERMISSION = "APP_PERMISSION";
	private static final String ROLE = "ROLE";

	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<AppPermission> objList = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				List<AppPermission> objList = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				AppPermission objList = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				List<AppPermission> objList = update(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.SELECT_PERMISSION_ROLE.toString())) {
				AppPermission objList = selectPermissionRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.MANAGE_APP_PERMISSION.toString())) {
				AppPermission objList = managePermissionRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.LOAD_PERMISSION.toString())) {
				List<AppPermission> objList = loadPermission(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				List<AppPermission> objList = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			}
			else if (actionType.equals(ActionType.APPROVE.toString())) {
				AppPermission objList = approve(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			}
			else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
		}

		return msgResponse;
	}
	
	
	
	
	private AppPermission approve(Message<List<AppPermission>> message, String action) {
		AppPermission ap = message.getPayload().get(0);
		AppPermission db = permissionRepo.findById(ap.getPermissionId()).get();
		
		db.setStatus(AppStatus.APPROVED);
		db.setApproveById(Long.valueOf(message.getHeader().getUserId()));
		db.setApproveTime(new Date());
		db.setModDate(new Date());
		db.setUserModId(Long.valueOf(message.getHeader().getUserId()));

		return permissionRepo.save(db);
	}

	private AppPermission save(Message<List<AppPermission>> message, String action) {
		AppPermission st = message.getPayload().get(0);
		
		
		AppPermission db = permissionRepo.findById(st.getPermissionId()).get();
		db.setDisplayName(st.getDisplayName());
		db.setDesc(st.getDesc());
		return permissionRepo.save(db);
	}

	private AppPermission selectPermissionRole(Message<List<AppPermission>> message, String action) {
		AppPermission st = message.getPayload().get(0);

		List<Role> roleList = roleService.selectAssignedRole(st.getPermissionId(), APP_PERMISSION);
		st.setRoleList(roleList);

		List<Role> unassignRoleList = roleService.selectUnassignRoleList(roleList);
		st.setUnassignRoleList(unassignRoleList);
		return st;
	}
	
	private AppPermission managePermissionRole(Message<List<AppPermission>> message, String action) {
		AppPermission rg = message.getPayload().get(0);
		List<Role> roleList = rg.getRoleList();
		
		sharedGenericMapService.unMapAndMap(rg.getPermissionId(), roleList.stream().mapToLong( i -> i.getRoleId()).boxed().collect(Collectors.toList()), APP_PERMISSION, ROLE, Long.valueOf(message.getHeader().getUserId()));

		return rg;
	}


	private List<AppPermission> loadPermission(Message<List<AppPermission>> message, String action) {
		AppPermission pref = message.getPayload().get(0);
		List<AppPermission> permissions = permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
		
		for(AppPermission p : permissions) {
			p.setRoleList(roleService.getPermissionRole(p.getPermissionId()));
		}
		return permissions;
	}

	private List<AppPermission> delete(Message<List<AppPermission>> message, String action) {
		AppPermission pref = message.getPayload().get(0);
		pref.setActive(0);
		permissionRepo.save(pref);
		return AppUtils.toList(permissionRepo.findAll());
	}

	private List<AppPermission> select(Message<List<AppPermission>> message, String action) throws Exception {
		AppPermission pref = message.getPayload().get(0);
		return permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
	}

	private List<AppPermission> insert(Message<List<AppPermission>> message, String action) throws Exception {
		AppPermission pref = message.getPayload().get(0);
		permissionRepo.save(pref);
		return permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
	}
	private void insert(AppPermission pref, String action) throws Exception {
		permissionRepo.save(pref);
	}

	public List<AppPermission> insert(List<AppPermission> AppPermissionList, String action) throws Exception {
		AppPermissionList.parallelStream().forEach( map ->{
			try {
				insert(map, action);
			} catch (Exception e) {
				log.error("Error executing action/id [{}]",action);
			}
		});
		return AppUtils.toList(permissionRepo.findAll());
	}


	private List<AppPermission> update(Message<List<AppPermission>> message, String action) throws Exception {
		AppPermission pref = message.getPayload().get(0);
		permissionRepo.save(pref);
		return permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
	}

	public AppPermission mapRoleToPermission(long permissionId, long roleId, long userId) {
		
		log.info("Adding role to permission [{}]:[{}]", permissionId, roleId);
		sharedGenericMapService.mapNew(permissionId, roleId, APP_PERMISSION, ROLE, userId);
		return permissionRepo.findById(permissionId).get();
	}
	
	public AppPermission mapRoleToPermission(long permissionId, String roleId, long userId) {
		
		log.info("Adding role to permission [{}]:[{}]", permissionId, roleId);
		List<Long> ids = Arrays.asList(roleId.split(",")).stream().map(Long::valueOf).collect(Collectors.toList());
		sharedGenericMapService.mapNew(permissionId, ids, APP_PERMISSION, ROLE, userId);
		return permissionRepo.findById(permissionId).get();
	}

	public AppPermission mapRoleToPermission(String permissionName, String roleName, long userId) {
		AppPermission p =permissionRepo.findByPermissionName(permissionName);
		Role r = roleService.roleRepo.findByRoleName(roleName);
		
		if(p != null && r != null) {
			return mapRoleToPermission(p.getPermissionId(), r.getRoleId(), userId);
		}
		log.info("Role or permission not found");
		return null;
	}




	public AppPermission findPermissionByPermissionName(String permissionName) {
		
		return permissionRepo.findByPermissionName(permissionName);
	}

}
