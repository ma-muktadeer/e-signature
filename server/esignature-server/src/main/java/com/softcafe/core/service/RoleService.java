package com.softcafe.core.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.management.relation.InvalidRoleInfoException;
import javax.management.relation.RoleNotFoundException;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.constants.AppConst;
import com.softcafe.constants.AppStatus;
import com.softcafe.core.constant.AppConstants;
import com.softcafe.core.model.AppPermission;
import com.softcafe.core.model.GenericMap;
import com.softcafe.core.model.Role;
import com.softcafe.core.model.User;
import com.softcafe.core.repo.AppPermissionRepo;
import com.softcafe.core.repo.GenericMapRepo;
import com.softcafe.core.repo.RoleGroupRepo;
import com.softcafe.core.repo.RoleRepo;
import com.softcafe.core.util.CF;
import com.softcafe.esignature.utils.Str;

@Service(value = "roleService")
public class RoleService extends AbstractService<List<Role>> {

	private static final Logger log = LoggerFactory.getLogger(RoleService.class);
	private static final String APP_PERMISSION = "APP_PERMISSION";
	private static final String ROLE = "ROLE";

	@Autowired
	public RoleRepo roleRepo;
	
	@Autowired
	private RoleGroupRepo roleGroupRepo;
	
	@Autowired
	AppPermissionService appPermissionService;
	
	
	@Autowired
	AppPermissionRepo permissionRepo;
	
	@Autowired
	private GenericMapRepo gm;
	
	@Autowired
	SharedGenericMapService sharedGenericMapService;

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {

			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<Role> roleLIst = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			} 
			else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				Role roleLIst = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}
			else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				Role roleLIst = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}
			else if (actionType.equals(ActionType.SELECT_ROLE_WITH_PERMISSION.toString())) {
				Role roleLIst = selectRoleWithPermission(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}
			else if (actionType.equals(ActionType.MANAGE_ROLE_PERMISSION.toString())) {
				Role roleLIst = manageRolePermission(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}
			else if (actionType.equals(ActionType.APPROVE.toString())) {
				Role roleLIst = approve(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}else if(actionType.equals(ActionType.APPROVE_PERMISSION.toString())) {
				Role roleLIst = approvePermission(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}else if(actionType.equals(ActionType.APPROVE_DEASSIGN_PERMISSION.toString())) {
				Role roleLIst = approveDeAssignPermission(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
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
	
	private Role delete(Message<List<Role>> requestMessage, String actionType) throws InvalidRoleInfoException, RoleNotFoundException {
		Role rl = requestMessage.getPayload().get(0);
		if(rl.getRoleId() != null) {
			log.info("getting role id for delete role is: [{}]", rl.getRoleId());
			rl = roleRepo.findAllByRoleIdAndActive(rl.getRoleId(), 1)
					.orElseThrow(()-> new RoleNotFoundException("Active Role Not found"));
//			rl.setActive(0);
			rl.setStatus(Str.PEND_DELETE);
			rl.setUserModId(requestMessage.getHeader().getUserId().longValue());
			rl.setModDate(new Date());
			return roleRepo.save(rl);
		}else {
			log.info("role id not found for delete role");
			throw new InvalidRoleInfoException("Invalid Action");
		}
	}

	public boolean checkPermission(){
		return true;
	}

	
	private Role approvePermission(Message<List<Role>> message, String actionType) {
		
		try {
			Role role = message.getPayload().get(0);

			AppPermission permission = role.getAppPermissionList().get(0);
			
			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(permission.getPermissionId(), APP_PERMISSION,
					role.getRoleId(), ROLE, 1);
			if (map != null) {
				map.setStatus(Str.APPROVED);
				map.setApproveById(Long.valueOf(message.getHeader().getUserId()));
				map.setApproveTime(new Date());
				gm.save(map);
			}

			return role;
			
		} catch (Exception e) {
			e.printStackTrace();
			log.info("Error! [{}]", e);
			return null;
		}
		
	}
	
	private Role approveDeAssignPermission(Message<List<Role>> message, String actionType) {
		
		try {
			Role role = message.getPayload().get(0);

			AppPermission permission = role.getAppPermissionList().get(0);
			
			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(permission.getPermissionId(), APP_PERMISSION,
					role.getRoleId(), ROLE, 1);
				if (map != null) {
					map.setStatus(null);
					map.setActive(0);
					gm.save(map);
				}

			return role;
			
		} catch (Exception e) {
			e.printStackTrace();
			log.info("Error! [{}]", e);
			return null;
		}
		
	}

	private Role approve(Message<List<Role>> message, String action) throws Exception {
		Role r = message.getPayload().get(0);
		
		
		//now check if any permission with this role or not. if not then block approve
		
		

		List<GenericMap> list = gm.findByToIdAndToTypeNameAndFromTypeNameAndActive(r.getRoleId(), "ROLE", AppConst.APP_PERMISSION, 1);
		
		if(list.size() == 0) {
			throw new Exception("No permission assign with this role. Please assign permission and then approve this role.");
		}
		
		
		Role d = roleRepo.findById(r.getRoleId()).get();
		if(StringUtils.equals(d.getStatus(), Str.PEND_DELETE)) {
			d.setActive(0);
		}
		d.setStatus(AppStatus.APPROVED);
		d.setApproveById(Long.valueOf(message.getHeader().getUserId()));
		d.setApproveTime(new Date());
		d.setModDate(new Date());
		d.setUserModId(Long.valueOf(message.getHeader().getUserId()));
		
		
		return roleRepo.save(d);
	}
	
	
	public String[] securityRoles() {
		List<Role> roles = roleRepo.findAll();
		
		List<String> rList = roles.stream().map(i -> i.getRoleName()).collect(Collectors.toList());
		return rList.toArray(new String[rList.size()]);
	}
	
	

	private Role selectRoleWithPermission(Message<List<Role>> message, String action) {
		Role r = message.getPayload().get(0);
		
		List<GenericMap> list = gm.findByToIdAndToTypeNameAndFromTypeNameAndActive(r.getRoleId(), "ROLE", AppConst.APP_PERMISSION, 1);
		
		if(list.size() > 0) {
			Set<Long> toIdList = list.parallelStream().mapToLong(i -> i.getFromId()).boxed()
					.collect(Collectors.toSet());
			
			List<AppPermission> assigned = permissionRepo.findByRoleIds(toIdList);
			
			for(AppPermission p : assigned) {
				GenericMap g = list.stream().filter( x -> x.getFromId().longValue() == p.getPermissionId().longValue()).findFirst().get();
				
				p.setGenericMapStatus(g.getStatus());
			}
			
			r.setPermissionList(assigned);
			
			
			Set<Long> unto = assigned.parallelStream().mapToLong(i -> i.getPermissionId()).boxed()
					.collect(Collectors.toSet());
			
			r.setUnassignedPermissionList(permissionRepo.findByRoleIdsNotIn(unto));
		}
		else {
			r.setPermissionList(new ArrayList<>());
			r.setUnassignedPermissionList(permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName")));
		}
		
		return r;
	}

	private Role manageRolePermission(Message<List<Role>> message, String action) {
		Role r = message.getPayload().get(0);
		
		List<AppPermission> lList = r.getPermissionList();

		List<AppPermission> ulList = r.getUnassignedPermissionList();
		
		long userId = Long.valueOf(message.getHeader().getUserId());
		for(AppPermission p : lList) {
			GenericMap map = gm.findByToIdAndToTypeNameAndFromIdAndFromTypeNameAndActive(r.getRoleId(), ROLE, p.getPermissionId(), AppConst.APP_PERMISSION, 1);
			if(map == null) {
				map = gm.findByToIdAndToTypeNameAndFromIdAndFromTypeNameAndActive(r.getRoleId(), ROLE, p.getPermissionId(), AppConst.APP_PERMISSION, 0);
				
				if(map == null) {
					map = sharedGenericMapService.buildGenericMap(p.getPermissionId(), AppConst.APP_PERMISSION, r.getRoleId(), ROLE, userId);
					
					map.setStatus(Str.PEND_ASSIGN);
					gm.save(map);
				}
				else {
					map.setActive(1);
					map.setGenericMapVer(map.getGenericMapVer() + 1);
					map.setModDate(new Date());
					map.setUserModId(Long.valueOf(message.getHeader().getUserId()));
					map.setCreateDate(new Date());
					map.setCreatorId(Long.valueOf(message.getHeader().getUserId()));
					map.setStatus(Str.PEND_ASSIGN);
					gm.save(map);
				}
				
			
			}
			else if(map.getActive().intValue() == 0) {
				map.setActive(1);
				map.setGenericMapVer(map.getGenericMapVer() + 1);
				map.setModDate(new Date());
				map.setUserModId(Long.valueOf(message.getHeader().getUserId()));
				map.setStatus(Str.PEND_ASSIGN);
				gm.save(map);
			}
		
		}
		for(AppPermission p : ulList) {
			GenericMap map = gm.findByToIdAndToTypeNameAndFromIdAndFromTypeNameAndActive(r.getRoleId(), ROLE, p.getPermissionId(), AppConst.APP_PERMISSION, 1);
			
			if(map != null) {
				map.setActive(1);
				map.setGenericMapVer(map.getGenericMapVer() + 1);
				map.setModDate(new Date());
				map.setUserModId(Long.valueOf(message.getHeader().getUserId()));
				map.setStatus(Str.PEND_DEASSINED);
				gm.save(map);
			}
			
			
		}
		
		
		/*
		 * sharedGenericMapService.unmapAllByTo(r.getRoleId(), "ROLE",
		 * AppConst.APP_PERMISSION, Long.valueOf(message.getHeader().getUserId()));
		 * 
		 * lList.forEach( i -> {
		 * appPermissionService.mapRoleToPermission(i.getPermissionId(), r.getRoleId(),
		 * Long.valueOf(message.getHeader().getUserId())); });
		 */
		
		
		return r;
	}

	private Role save(Message<List<Role>> message, String action) throws Exception{
		Role r = message.getPayload().get(0);
		if (r.getRoleId() == null) {
			
			String roleName = r.getDisplayName().replace(" ", "_").toUpperCase();
			r.setRoleName(roleName);
			CF.fillInsert(r);
			r.setCreateDate(new Date());
			r.setRoleType(r.getRoleType());
			r.setCreatorId(Long.valueOf(message.getHeader().getUserId()));
			return roleRepo.save(r);
		} else {
			Role db = roleRepo.findById(r.getRoleId()).get();
			db.setDisplayName(r.getDisplayName());
			db.setDesc(r.getDesc());
			db.setModDate(new Date());
			db.setRoleType(r.getRoleType());
			db.setUserModId(Long.valueOf(message.getHeader().getUserId()));
			return roleRepo.save(db);
		}
		
	}

	private List<Role> select(Message<List<Role>> message, String action) throws Exception {
//		return roleRepo.findAllByActive(1);
		return roleRepo.findAllByActiveOrderByDisplayNameAsc(1);
	}

	private List<Role> selectAll(Message requestMessage, String actionType) {
		return StreamSupport.stream(roleRepo.findAll().spliterator(), false).collect(Collectors.toList());
	}

	public void mapRole(Long userId, List<Role> roleList) {
		// map role
		if (null != roleList && roleList.size() > 0) {
			for (Role role : roleList) {
				GenericMap g = new GenericMap();
				g.setFromId(userId);
				g.setFromTypeName(AppConstants.STR_USER);
				g.setToId(role.getRoleId());
				g.setToTypeName(AppConstants.STR_ROLE);
				gm.save(g);
			}
		}
	}

	public List<Role> selectUserRoleByRoleGroup(User user) {
		return roleRepo.selectUserAssignedRoleByRoleGroup(user.getUserId());
	}
	
	
	
	public List<Role> selectAssignedRole(Long fromId, String fromName) {

		// first select map roleush
		// than select role

		List<GenericMap> mapList = gm.findByFromIdAndFromTypeNameAndToTypeNameAndActive(fromId, fromName, "ROLE", 1);
		if (mapList.size() > 0) {
			Set<Long> toIdList = mapList.parallelStream().mapToLong(i -> i.getToId()).boxed()
					.collect(Collectors.toSet());

			return roleRepo.findByRoleIds(toIdList);
		}
		return Collections.emptyList();
	}
	
	
	public List<Role> selectUserActiveRole(User user) {

		//List<GenericMap> mapList = gm.findByFromIdAndFromTypeNameAndToTypeNameAndActive(user.getUserId(), AppConstants.STR_USER, "ROLE", 1);
		
		Set<String> st = new HashSet<>();
		st.add("APPROVED");
		st.add("PEND_DEASSIGN");
		List<GenericMap> mapList = gm.getToIdItemByStatus(user.getUserId(), AppConstants.STR_USER, "ROLE", st );
		
		
		if (mapList.size() > 0) {
			Set<Long> toIdList = mapList.parallelStream().mapToLong(i -> i.getToId()).boxed()
					.collect(Collectors.toSet());
			
			List<Role> roleList = roleRepo.findByRoleIds(toIdList);
			
			for (Role role : roleList) {
				GenericMap g = mapList.stream().filter(m -> m.getToId().equals(role.getRoleId())).findAny().orElse(null);
				
				role.setGenericMapStatus(g.getStatus());
			}
			
			return roleList;
		}
		return Collections.emptyList();
	}
	
	

	public List<Role> selectUserRole(User user) {

		List<GenericMap> mapList = gm.findByFromIdAndFromTypeNameAndToTypeNameAndActive(user.getUserId(), AppConstants.STR_USER, "ROLE", 1);
		
		
		if (mapList.size() > 0) {
			Set<Long> toIdList = mapList.parallelStream().mapToLong(i -> i.getToId()).boxed()
					.collect(Collectors.toSet());
			
			List<Role> roleList = roleRepo.findByRoleIds(toIdList);
			
			for (Role role : roleList) {
				GenericMap g = mapList.stream().filter(m -> m.getToId().equals(role.getRoleId())).findAny().orElse(null);
				
				role.setGenericMapStatus(g.getStatus());
			}
			
			return roleList;
		}
		return Collections.emptyList();
	}
	
	
	
	
	public List<Role> selectUnassignRoleList(List<Role> assignRoleList) {
		
		if(null == assignRoleList || assignRoleList.size() == 0) {
//			return roleRepo.findAll();
			return roleRepo.findAllByStatusAndActive(Str.APPROVED, 1);
		}

		Set<Long> toIdList = assignRoleList.parallelStream().mapToLong(i -> i.getRoleId()).boxed()
				.collect(Collectors.toSet());

//		return roleRepo.findByRoleIdsNotIn(toIdList);
		
		return roleRepo.findByRoleIdNotInAndStatusAndActive(toIdList, Str.APPROVED, 1);

	}
	
	
	public List<Role> getPermissionRole(long permissionId){
		return roleRepo.getPermissionList(permissionId);
	}
	
	

}
