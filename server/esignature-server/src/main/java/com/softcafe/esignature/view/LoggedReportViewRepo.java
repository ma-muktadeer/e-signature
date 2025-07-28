package com.softcafe.esignature.view;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface LoggedReportViewRepo extends PagingAndSortingRepository<LoggedReportView, Long>{
	
	@Query(value = "    select * from VW_LOGGED_REPORT r  " + 
			"where r.dtt_entry >= nvl(:fromDate, r.dtt_entry)  " + 
			"and r.dtt_entry <= nvl(:toDate, r.dtt_entry)  " 
			
//			+ "and r.TX_ACTION = 'LOGIN'"
			+  "AND (:fullName IS NULL OR LOWER(r.TX_FULL_NAME) LIKE LOWER('%' || :fullName || '%'))",
			
			countQuery = "    select count(1) from VW_LOGGED_REPORT r  " + 
					"where r.dtt_entry >= nvl(:fromDate, r.dtt_entry)  " + 
					"and r.dtt_entry <= nvl(:toDate, r.dtt_entry)  " 
//					+ "and r.TX_ACTION = 'LOGIN'"
					+  "AND (:fullName IS NULL OR LOWER(r.TX_FULL_NAME) LIKE LOWER('%' || :fullName || '%'))",
			nativeQuery = true)
	Page<LoggedReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, @Param("fullName") String fullName, Pageable page);
	
	@Query(value = "  select * from VW_LOGGED_REPORT r  " + 
			"where r.dtt_entry >= nvl(:fromDate, r.dtt_entry)  " + 
			"and r.dtt_entry <= nvl(:toDate, r.dtt_entry) "
			+  "AND (:fullName IS NULL OR LOWER(r.TX_FULL_NAME) LIKE LOWER('%' || :fullName || '%'))"
			,
			nativeQuery = true)
	List<LoggedReportView> selectLoggedDownloadReport(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, @Param("fullName") String fullName);

}
