package com.softcafe.core.repo;

import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import com.softcafe.core.model.User;
import com.softcafe.esignature.entity.Institution;

@Transactional
public interface UserRepo
		extends JpaRepository<User, Long>, JpaSpecificationExecutor<User>, QueryByExampleExecutor<User> {
	User findByUserIdAndActive(Long userId, Integer active);

	User findByLoginNameAndEmailAndActive(String loginName, String email, Integer active);

	User findByLoginNameAndActive(String loginName, Integer active);

	User findByPhoneNumberAndActive(String phoneNumber, Integer active);

	User findByEmailAndActive(String email, Integer active);

	User findByLoginNameAndEmailAndVerificationCodeAndActive(String loginName, String email, String verificationCode,
			Integer active);

	User findByLoginNameAndPasswordAndVerificationCodeAndActive(String loginName, String email, String verificationCode,
			Integer active);

	@Transactional
	@Modifying
	@Query(value = "UPDATE User U " + "SET U.allowLogin= :allowLogin" + ", U.userVer = U.userVer+1 "
			+ ", U.userModId = :userModId " + ", U.modDate = :modDate " + "WHERE U.userId = :userId")
	void toggleActivation(@Param("allowLogin") Integer allowLogin, @Param("userId") Long userId,
			@Param("userModId") Long userModId, @Param("modDate") Date modDate);

	@Query(value = "select u " + " from User u " + " where u.loginName = :loginName" + " and u.password = :password "
			+ " and u.active =1")
	User login(@Param("loginName") String loginName, @Param("password") String password);

	@Transactional
	@Modifying
	@Query(value = "UPDATE User U " + "SET U.twoFactorAuth= :twoFactorAuth" + ", U.userVer = U.userVer+1 "
			+ ", U.userModId = :userModId " + ", U.modDate = :modDate " + "WHERE U.userId = :userId")
	void toggle2Fa(@Param("twoFactorAuth") Integer twoFactorAuth, @Param("userId") Long userId,
			@Param("userModId") Long userModId, @Param("modDate") Date modDate);

	@Transactional
	@Modifying
	@Query(value = "UPDATE User U " + "SET U.active= 0" + ", U.userVer = U.userVer+1 " + ", U.userModId = :userModId "
			+ ", U.modDate = :modDate " + "WHERE U.userId = :userId")
	void delete(@Param("userId") Long userId, @Param("userModId") Long userModId, @Param("modDate") Date modDate);

//	@Query(value="SELECT  U FROM User U where active = 1")
//	Page<User> findAll(Pageable pageable);

	@Query("SELECT T FROM User T WHERE T.userId in :userIdList and active = 1")
	List<User> findByUserIds(@Param("userIdList") Set<Long> userIdList);

	@Query("SELECT T FROM User T WHERE T.userId not in :userIdList and active = 1")
	List<User> findByNotUserIds(@Param("userIdList") Set<Long> userIdList);

	@Query(value = "SELECT U.*" + "	FROM T_USER U" + "	JOIN T_GENERIC_MAP G " + "		ON U.ID_USER_KEY = G.LNG_TO_ID "
			+ "		AND G.TX_STATUS = :status " + "		AND G.TX_TO_TYPE_NAME = :toTypeName"
			+ "		AND G.IS_ACTIVE = 1" + "	JOIN T_APP_PERMISSION P "
			+ "		ON P.TX_PERMISSION_NAME = :permissionName"
			+ "		AND P.ID_PERMISSION_KEY = G.LNG_FROM_ID", nativeQuery = true)
	List<User> findByPermissionNameAndToTypeNameAndStatus(@Param("permissionName") String permissionName,
			@Param("toTypeName") String toTypeName, @Param("status") String status);

	@Query(value = "SELECT U.* " + "	FROM T_USER U" + "	JOIN T_GENERIC_MAP G "
			+ "		ON U.ID_USER_KEY = G.LNG_FROM_ID" + "		AND G.TX_FROM_TYPE_NAME = 'USER'"
			+ "		AND G.TX_TO_TYPE_NAME = 'ROLE' " + "		AND G.TX_STATUS = :status"
			+ "		AND G.IS_ACTIVE = 1 " + "	JOIN T_ROLE R " + "		ON R.ID_ROLE_KEY = G.LNG_TO_ID"
			+ "		AND R.TX_STATUS = G.TX_STATUS " + "		AND R.TX_ROLE_NAME = :roleName"
			+ "		AND U.IS_ACTIVE = 1", nativeQuery = true)
	List<User> findUserByRoleNameAndStatus(@Param("roleName") String roleName, @Param("status") String status);

	User findByLoginName(String loginName);

	boolean existsByEmailAndActive(String email, int active);

	boolean existsByNidAndActive(String email, int active);

	boolean existsByPhoneNumberAndActive(String phoneNumber, int i);

	boolean existsByLoginNameAndActive(String loginName, int i);

	boolean existsByInstitutionIdAndEmpId(Long institutionId, String empId);

	User findByUserIdAndFirstLoginAndUserStatusAndActive(Long userId, int i, String userStatus, int j);

	List<User> findAllByUserTypeAndActive(String externalUser, int i);

	List<User> findAllByInstitutionIdAndIsMasterUserAndActive(Long institutionId, int i, int j);

	Page<User> findAllByActive(int i, Pageable pageable);

//	@Query("SELECT u FROM User u WHERE u.active = :active "
//			+ "AND (:institutionId IS NULL OR u.institutionId = :institutionId) "
//			+ "AND (:email IS NULL OR u.email = :email) " 
//			+ "AND (:loginName IS NULL OR u.loginName = :loginName)")
//	Page<User> findAllByActiveAndFilters(@Param("active") int active, @Param("institutionId") Long institutionId,
//			@Param("email") String email, @Param("loginName") String loginName, Pageable pageable);

//	@Query("SELECT u FROM User u WHERE u.active = :active "
//			+ " AND (:institutionId IS NULL OR u.institutionId = :institutionId) "
//			+ " AND (:email IS NULL OR u.email = :email) " 
//			+ " AND (:loginName IS NULL OR u.loginName = :loginName)"
//			+ " AND userStatus IN ('PEND_ACTIVE', 'PEND_APPROVE', 'PEND_INACTIVE', 'PEND_DELETE')")
//	Page<User> findAllPendByActiveAndFilters(@Param("active") int active, @Param("institutionId") Long institutionId,
//			@Param("email") String email, @Param("loginName") String loginName, Pageable pageable);

	User findByLoginNameAndFirstLoginAndActive(String loginName, int i, int j);

	User findByUserIdAndFirstLoginAndUserTypeAndActive(Long userId, int i, String externalUser, int j);

	List<User> findAllByUserTypeAndAllowLoginAndActive(String externalUser, int i, int j);

	User findByLoginNameAndFirstLoginAndActiveAndUserBlockCauseNotIn(String loginName, int i, int j,
			List<String> excludedBlockCauses);

	User findByLoginNameAndFirstLogin(String loginName, int i);

	List<User> findAllByActive(int i);

	User findByLoginNameAndUserBlockCauseNotAndUserTypeAndActive(String loginName, String adminBlockUser, String userType, int i);

	User findByEmailAndNidAndActive(String email, String nid, int i);
	
	
	List<User> findByUserTypeAndActive(String userType ,int active);

}