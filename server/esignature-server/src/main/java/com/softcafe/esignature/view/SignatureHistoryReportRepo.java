package com.softcafe.esignature.view;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SignatureHistoryReportRepo extends JpaRepository<SignatureHistoryReportView, Long>{
	@Query(value = "    select * from VW_SIGNATURE_HISTORY_REPORT r  " + 
			"where r.DTT_UPDATE >= nvl(:fromDate, r.DTT_UPDATE)  " + 
			"and r.DTT_UPDATE <= nvl(:toDate, r.DTT_UPDATE)  " , 
			
			countQuery = "    select count(1) from VW_SIGNATURE_HISTORY_REPORT r  " + 
					"where r.DTT_UPDATE >= nvl(:fromDate, r.DTT_UPDATE) " + 
					"and r.DTT_UPDATE <= nvl(:toDate, r.DTT_UPDATE)  " ,
			nativeQuery = true)
	Page<SignatureHistoryReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);
}
