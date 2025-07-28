package com.softcafe.core.repo;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.core.model.Login;

@Transactional
public interface LoginRepo extends JpaRepository<Login, Long>{

	List<Login> findByLoginNameAndFailResolvedAndLogin(String loginName, Integer failResolved, Integer login);
	
	
	@Transactional
	@Modifying(clearAutomatically = true)
	@Query(value="  update Login l "
			+ "  set l.failResolved = 1 , "
			+ "  l.modTime = :modTime  "
			+ "  where l.failResolved = 0 "
			+ "  and l.loginName = :loginName  ")
	void resolvedFailAttempt(@Param("modTime") Date modTime, @Param("loginName") String loginName);


	Login findFirstByUserIdAndLoginTimeNotNull(Long userId, Sort sort);


//	Login findFirstByUserIdAndLoginTimeNotNull(Long userId, Sort descending);

	
	//List<Login> findByFailResolvedAndLoginName(int failResolved, String loginName);
	
}
