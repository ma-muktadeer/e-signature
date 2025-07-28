package com.softcafe.core.repo;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.core.model.AppPermission;

public interface AppPermissionRepo extends JpaRepository<AppPermission, Long>{
	
	List<AppPermission> findByActive(int active, Sort sort);
	
	AppPermission findByPermissionName(String permissionName);
	
	
	@Query("SELECT T FROM AppPermission T WHERE T.permissionId in :permissionIdList and active = 1 ORDER BY T.displayName ASC")
	List<AppPermission> findByRoleIds(@Param("permissionIdList")Set<Long> permissionIdList);
	
	@Query("SELECT T FROM AppPermission T WHERE T.permissionId not in :permissionIdList and active = 1 ORDER BY T.displayName ASC")
	List<AppPermission> findByRoleIdsNotIn(@Param("permissionIdList")Set<Long> permissionIdList);

}
