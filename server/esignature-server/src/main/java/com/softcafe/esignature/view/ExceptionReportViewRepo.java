package com.softcafe.esignature.view;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExceptionReportViewRepo extends JpaRepository<ExceptionReportView, Long>{

	
	@Query(value = "    select * from VW_EXCEPTION_REPORT r  " + 
			"where r.TX_ATTEMPT_LOGIN >= nvl(:fromDate, r.TX_ATTEMPT_LOGIN)  " + 
			"and r.TX_ATTEMPT_LOGIN <= nvl(:toDate, r.TX_ATTEMPT_LOGIN)  ", 
			
			countQuery = "    select count(1) from VW_EXCEPTION_REPORT r  " + 
					"where r.TX_ATTEMPT_LOGIN >= nvl(:fromDate, r.TX_ATTEMPT_LOGIN)  " + 
					"and r.TX_ATTEMPT_LOGIN <= nvl(:toDate, r.TX_ATTEMPT_LOGIN)  ",
			nativeQuery = true)
	Page<ExceptionReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);
}