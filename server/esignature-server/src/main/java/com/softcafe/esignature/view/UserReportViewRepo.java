package com.softcafe.esignature.view;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserReportViewRepo extends JpaRepository<UserReportView, Long>{
	@Query(value = "    select * from VE_USER_REPORT r  " + 
			"where r.TX_AMEND_DATE >= nvl(:fromDate, r.TX_AMEND_DATE)  " + 
			"and r.TX_AMEND_DATE <= nvl(:toDate, r.TX_AMEND_DATE) "
			+ "and r.TX_USER_TYPE = nvl(:userType, r.TX_USER_TYPE) "
			+  "AND (:fullName IS NULL OR LOWER(r.TX_FULL_NAME) LIKE LOWER('%' || :fullName || '%'))",
			
			countQuery = "    select count(1) from VE_USER_REPORT r  " + 
					"where r.TX_AMEND_DATE >= nvl(:fromDate, r.TX_AMEND_DATE) " + 
					"and r.TX_AMEND_DATE <= nvl(:toDate, r.TX_AMEND_DATE) " 
					+ "and r.TX_USER_TYPE = nvl(:userType, r.TX_USER_TYPE) "
					+  "AND (:fullName IS NULL OR LOWER(r.TX_FULL_NAME) LIKE LOWER('%' || :fullName || '%'))",
			nativeQuery = true)
	Page<UserReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, String userType,@Param("fullName") String fullName, Pageable page);
	
	
	@Query(value = "  select * from VE_USER_REPORT r  " + 
			"where r.TX_AMEND_DATE >= nvl(:fromDate, r.TX_AMEND_DATE)  " + 
			"and r.TX_AMEND_DATE <= nvl(:toDate, r.TX_AMEND_DATE) "
			+ "and r.TX_USER_TYPE = nvl(:userType, r.TX_USER_TYPE) "
			+  "AND (:fullName IS NULL OR LOWER(r.TX_FULL_NAME) LIKE LOWER('%' || :fullName || '%'))",
			nativeQuery = true)
	List<UserReportView> selectUserDownloadReport(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, String userType, @Param("fullName") String fullName);
	
}
