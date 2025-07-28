package com.softcafe.core.repo;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.core.model.UserApp;

public interface UserAppRepo extends JpaRepository<UserApp, Long>{
	
	@Query("SELECT T FROM UserApp T WHERE T.userAppId in :appIdList")
	Set<UserApp> findByAppIds(@Param("appIdList")Set<Long> appIdList);
	
	@Query("SELECT T FROM UserApp T WHERE T.userAppId not in :appIdList")
	Set<UserApp> findByAppIdsNotIn(@Param("appIdList")Set<Long> appIdList);
	
}
