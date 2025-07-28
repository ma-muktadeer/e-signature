package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.ViewUserPermission;

public interface ViewUserPermissionRepo extends JpaRepository<ViewUserPermission, Long>{
	
	List<ViewUserPermission> findByUserId(Long userId);
	
	
	boolean existsByUserIdAndPermissionName(Long userId, String permissionName);

}
