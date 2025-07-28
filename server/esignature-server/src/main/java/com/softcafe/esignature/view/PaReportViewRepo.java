package com.softcafe.esignature.view;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaReportViewRepo extends JpaRepository<PaSearchReportView, Long>{
	
	@Query(value = "    select * from VW_PA_REPORT_VIEWER r  " + 
			"where r.DTT_UPDATE >= nvl(:fromDate, r.DTT_UPDATE)  " + 
			"and r.DTT_UPDATE <= nvl(:toDate, r.DTT_UPDATE)  " , 
			
			countQuery = "    select count(1) from VW_PA_REPORT_VIEWER r  " + 
					"where r.DTT_UPDATE >= nvl(:fromDate, r.DTT_UPDATE)  " + 
					"and r.DTT_UPDATE <= nvl(:toDate, r.DTT_UPDATE)  ",
			nativeQuery = true)
	Page<PaSearchReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);


}
