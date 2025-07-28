package com.softcafe.core.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafe.core.constant.AppConstants;
import com.softcafe.core.model.GenericMap;
import com.softcafe.core.model.User;
import com.softcafe.core.model.UserApp;
import com.softcafe.core.repo.GenericMapRepo;
import com.softcafe.core.repo.UserAppRepo;

@Service
public class UserAppService {
	
	
	@Autowired
	private GenericMapRepo gm;
	@Autowired
	UserAppRepo userAppRepo;
	
	public List<UserApp> all() {
		return userAppRepo.findAll();
	}


	public List<UserApp> unassignApp(List<UserApp> assignRoleList) {

		if (null == assignRoleList || assignRoleList.size() == 0) {
			Iterable<UserApp> roleList = userAppRepo.findAll();
			return StreamSupport.stream(roleList.spliterator(), false).collect(Collectors.toList());
		}

		Set<Long> toIdList = assignRoleList.parallelStream().mapToLong(i -> i.getUserAppId()).boxed()
				.collect(Collectors.toSet());

		Set<UserApp> roleList = userAppRepo.findByAppIdsNotIn(toIdList);
		return new ArrayList<>(roleList);

	}


	public List<UserApp> assignApp(User user) {

		// first select map roleush
		// than select role

		List<GenericMap> mapList = gm.findByFromIdAndFromTypeNameAndActive(user.getUserId(), AppConstants.STR_USER, 1);
		if (mapList.size() > 0) {
			Set<Long> toIdList = mapList.parallelStream().mapToLong(i -> i.getToId()).boxed()
					.collect(Collectors.toSet());

			Set<UserApp> roleList = userAppRepo.findByAppIds(toIdList);
			return new ArrayList<>(roleList);
		}
		return Collections.emptyList();
	}

}
