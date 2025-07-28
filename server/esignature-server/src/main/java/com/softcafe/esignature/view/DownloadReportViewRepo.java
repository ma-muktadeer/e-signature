package com.softcafe.esignature.view;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DownloadReportViewRepo extends JpaRepository<DownloadReportView, Long>{
	
	@Query(value = "    select * from VIEW_DOWNLOAD_SIGNATURE r  " + 
			"where r.DT_DOWNLOAD >= nvl(:fromDate, r.DT_DOWNLOAD)  " + 
			"and r.DT_DOWNLOAD <= nvl(:toDate, r.DT_DOWNLOAD)  " 
			
			+ " ", 
			
			countQuery = "    select count(1) from VIEW_DOWNLOAD_SIGNATURE r  " + 
					"where r.DT_DOWNLOAD >= nvl(:fromDate, r.DT_DOWNLOAD)  " + 
					"and r.DT_DOWNLOAD <= nvl(:toDate, r.DT_DOWNLOAD)  " 
					
					+ " ",
			nativeQuery = true)
	Page<DownloadReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);


}
