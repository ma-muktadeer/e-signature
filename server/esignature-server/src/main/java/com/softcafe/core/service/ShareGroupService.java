package com.softcafe.core.service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafe.core.model.Group;
import com.softcafe.core.model.User;
import com.softcafe.core.repo.GroupRepo;
import com.softcafe.core.repo.UserRepo;

@Service
public class ShareGroupService {

	private static final String GROUP = "GROUP";

	@Autowired
	public GroupRepo groupRepo;

	@Autowired
	UserRepo userRepo;
	
	
	@Autowired
	SharedGenericMapService sharedGenericMapService;

	public Group save(Group group, Long userId) throws Exception {
		if (group.getGroupId() > 0) {
			return update(group, userId);
		}
		Group db = groupRepo.findByNameAndTypeAndActive(group.getName(), group.getType(), 1);
		if (db != null) {
			throw new Exception("Duplicate group name");
		}
		group.setCreateDate(new Date());
		group.setCreatorId(userId);
		group.setStatus("PENDING");
		return groupRepo.save(group);
	}

	public Group delete(Group group, Long userId) {
		group.setActive(0);
		fillUpdate(group, userId);
		return groupRepo.save(group);
	}

	
	public Group update(Group group, Long userId) throws Exception {
		Group db = groupRepo.findByGroupId(group.getGroupId());
		
		Group dup = groupRepo.findByNameAndTypeAndActive(group.getName(), group.getType(), 1);
		if (dup != null) {
			throw new Exception("Duplicate group name");
		}

		db.setName(group.getName());
		db.setStatus("MODIFIED");
		fillUpdate(db, userId);
		return groupRepo.save(db);
	}

	public List<Group> select(Group group) {
		return groupRepo.findByActive(1);
	}

	public List<Group> selectByType(Group group) {
		return groupRepo.findByTypeAndActive(group.getType(), 1);
	}
	
	public List<Group> selectByTypeAndStatus(Group group) {
		return groupRepo.findByTypeAndStatusAndActive(group.getType(), group.getStatus(), 1);
	}

	private void fillUpdate(Group group, Long userId) {
		group.setModDate(new Date());
		group.setUserModId(userId);
	}

	public List<User> selectUnmappedGroupUsers(Group group) {
		Set<Long> list = sharedGenericMapService.getToIdSet(group.getGroupId(), GROUP, group.getType());
		if (list.size() > 0) {

			return userRepo.findByNotUserIds(list);
		}
		return userRepo.findAll();
	}
	
	public Group mapNew(Group group, long userId) {
		List<User> mapList = group.getMapList();

		if (mapList == null || mapList.size() == 0) {
			return group;
		}

		List<Long> toIdList = mapList.stream().map(i -> i.getUserId()).collect(Collectors.toList());

		sharedGenericMapService.mapNew(group.getGroupId(), toIdList, GROUP, group.getType(), userId);

		return group;
	}

	public Group unMapAndMap(Group group, long userId) {
		List<User> mapList = group.getMapList();

		if (mapList == null || mapList.size() == 0) {
			return group;
		}

		List<Long> toIdList = mapList.stream().map(i -> i.getUserId()).collect(Collectors.toList());

		sharedGenericMapService.unMapAndMap(group.getGroupId(), toIdList, GROUP, group.getType(), userId);

		return group;
	}

	public List<User> selectGroupUsers(Long groupId, String type) {
		Set<Long> userIdList = sharedGenericMapService.getToIdSet(groupId, GROUP, type);
		if(userIdList.size() == 0) {
			return Collections.emptyList();
		}
		
		return userRepo.findByUserIds(userIdList);
		
	}
	
	public Group unmapOne(Group group, Integer userId) {
		sharedGenericMapService.unMapOne(group.getGroupId(), GROUP, group.getToId(), group.getType(), userId);
		return group;
	}

}
