package com.softcafe.esignature.view;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PrintDownloadReportRepo extends JpaRepository<PrintDownloadReport, Long>{

	@Query(value = "    select * from VW_RPT_SINGATURE_DOWNLOAD r  " + 
			"where r.DTT_ACTIVITY >= nvl(:fromDate, r.DTT_ACTIVITY)  " + 
			"and r.DTT_ACTIVITY <= nvl(:toDate, r.DTT_ACTIVITY)  " 
			
			+ " ", 
			
			countQuery = "    select count(1) from VW_RPT_SINGATURE_DOWNLOAD r  " + 
					"where r.DTT_ACTIVITY >= nvl(:fromDate, r.DTT_ACTIVITY)  " + 
					"and r.DTT_ACTIVITY <= nvl(:toDate, r.DTT_ACTIVITY)  " 
					
					+ " ",
			nativeQuery = true)
	Page<PrintDownloadReport> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);

}
