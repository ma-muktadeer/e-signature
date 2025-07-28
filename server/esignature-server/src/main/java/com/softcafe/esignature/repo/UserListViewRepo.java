package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.core.model.User;
import com.softcafe.esignature.view.UserListView;

public interface UserListViewRepo extends JpaRepository<UserListView, Long>{
	@Query(value = "SELECT U.* " + "	FROM VW_USER_LIST U" + "	JOIN T_GENERIC_MAP G "
			+ "		ON U.ID_USER_KEY = G.LNG_FROM_ID" + "		AND G.TX_FROM_TYPE_NAME = 'USER'"
			+ "		AND G.TX_TO_TYPE_NAME = 'ROLE' " + "		AND G.TX_STATUS = :status"
			+ "		AND G.IS_ACTIVE = 1 " + "	JOIN T_ROLE R " + "		ON R.ID_ROLE_KEY = G.LNG_TO_ID"
			+ "		AND R.TX_STATUS = G.TX_STATUS " + "		AND R.TX_ROLE_NAME = :roleName"
			+ "		AND U.IS_ACTIVE = 1", nativeQuery = true)
	List<UserListView> findUserByRoleNameAndStatus(@Param("roleName") String roleName, @Param("status") String status);
	
	@Query("SELECT u FROM UserListView u WHERE u.active = :active "
			+ "AND (:institutionId IS NULL OR u.institutionId = :institutionId) "
			+ "AND (:email IS NULL OR u.email = :email) " 
			+ "AND (:loginName IS NULL OR u.loginName = :loginName) "
	        + "AND (:fullName IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) "
			+ "AND (:userType IS NULL OR u.userType = :userType)")
	Page<UserListView> findAllByActiveAndFilters(@Param("active") int active, @Param("institutionId") Long institutionId,
			@Param("email") String email, @Param("loginName") String loginName,@Param("fullName") String fullName, @Param("userType") String userType, Pageable pageable);
	
	@Query("SELECT u FROM UserListView u WHERE u.active = :active "
			+ " AND (:institutionId IS NULL OR u.institutionId = :institutionId) "
			+ " AND (:email IS NULL OR u.email = :email) " 
			+ " AND (:loginName IS NULL OR u.loginName = :loginName)"
	        + "AND (:fullName IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) "
			+ " AND (:userType IS NULL OR u.userType = :userType)"
			+ " AND userStatus IN ('PEND_ACTIVE', 'PEND_APPROVE', 'PEND_INACTIVE', 'PEND_DELETE', 'PEND_CLOSE')")
	Page<UserListView> findAllPendByActiveAndFilters(@Param("active") int active, @Param("institutionId") Long institutionId,
			@Param("email") String email, @Param("loginName") String loginName,@Param("fullName") String fullName, @Param("userType") String userType, Pageable pageable);
}
