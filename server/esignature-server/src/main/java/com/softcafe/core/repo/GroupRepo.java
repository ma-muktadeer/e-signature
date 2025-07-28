package com.softcafe.core.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.core.model.Group;

public interface GroupRepo extends JpaRepository<Group, Long> {
	List<Group> findByActive(int active);
	
	Group findByGroupId(Long groupId);

	Group findByNameAndTypeAndActive(String name, String type, int active);

	List<Group> findByTypeAndActive(String type, int active);
	
	List<Group> findByTypeAndStatusAndActive(String type, String status, int active);

}
