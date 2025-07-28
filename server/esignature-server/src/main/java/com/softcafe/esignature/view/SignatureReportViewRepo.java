package com.softcafe.esignature.view;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SignatureReportViewRepo extends JpaRepository<SignatureReportView, Long>{
		
	@Query(value = "    select * from VW_RPT_SINGATURE r  " + 
			"where r.DTT_SIGNATURE_AUTH >= nvl(:fromDate, r.DTT_SIGNATURE_AUTH)  " + 
			"and r.DTT_SIGNATURE_AUTH <= nvl(:toDate, r.DTT_SIGNATURE_AUTH)  " 
			
			+ " ", 
			
			countQuery = "    select count(1) from VW_RPT_SINGATURE r  " + 
					"where r.DTT_SIGNATURE_AUTH >= nvl(:fromDate, r.DTT_SIGNATURE_AUTH)  " + 
					"and r.DTT_SIGNATURE_AUTH <= nvl(:toDate, r.DTT_SIGNATURE_AUTH)  " 
					
					+ " ",
			nativeQuery = true)
	Page<SignatureReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);
}