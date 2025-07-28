package com.softcafe.esignature.view;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ViewUserAuditRepo extends JpaRepository<ViewUserAudit, Long> {
	
	List<ViewUserAudit> findByUserIdOrderByAuditUserIdDesc(Long userId);
	
	
	/*@Query("SELECT u FROM UserListView u WHERE u.active = :active "
			+ "AND (:institutionId IS NULL OR u.institutionId = :institutionId) "
			+ "AND (:email IS NULL OR u.email = :email) " 
			+ "AND (:loginName IS NULL OR u.loginName = :loginName) "
			+ "AND (:userType IS NULL OR u.userType = :userType)")
	Page<ViewUserAudit> userAuditData(@Param("active") int active, @Param("institutionId") Long institutionId,
			@Param("email") String email, @Param("loginName") String loginName, @Param("userType") String userType, Pageable pageable);
	*/

}
