package com.softcafe.esignature.view;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HrModuleReportViewRepo extends JpaRepository<HrModuleReportView, Long>{
	
	@Query(value = "    select * from VW_RPT_HR_MODULE r  " + 
			"where r.DT_PA_CREATE >= nvl(:fromDate, r.DT_PA_CREATE)  " + 
			"and r.DT_PA_CREATE <= nvl(:toDate, r.DT_PA_CREATE)  " 
			
			+ " ", 
			
			countQuery = "    select count(1) from VW_RPT_HR_MODULE r  " + 
					"where r.DT_PA_CREATE >= nvl(:fromDate, r.DT_PA_CREATE)  " + 
					"and r.DT_PA_CREATE <= nvl(:toDate, r.DT_PA_CREATE)  " 
					
					+ " ",
			nativeQuery = true)
	Page<HrModuleReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);


}
