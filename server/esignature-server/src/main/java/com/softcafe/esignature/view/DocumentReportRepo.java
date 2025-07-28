package com.softcafe.esignature.view;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentReportRepo extends JpaRepository<DocumentReportView, Long>{
	@Query(value = "    select * from VW_DOC_REPORT r  " + 
			"where r.DTT_CREATE >= nvl(:fromDate, r.DTT_CREATE)  " + 
			"and r.DTT_CREATE <= nvl(:toDate, r.DTT_CREATE)  " , 
			
			countQuery = "    select count(1) from VW_DOC_REPORT r  " + 
					"where r.DTT_CREATE >= nvl(:fromDate, r.DTT_CREATE) " + 
					"and r.DTT_CREATE <= nvl(:toDate, r.DTT_CREATE)  " ,
			nativeQuery = true)
	Page<DocumentReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);
	
//	@Query(value = "    select * from VW_DOC_REPORT r  " + 
//			"where r.DTT_APPROVAL_FILE >= nvl(:fromDate, r.DTT_APPROVAL_FILE)  " + 
//			"and r.DTT_APPROVAL_FILE <= nvl(:toDate, r.DTT_APPROVAL_FILE)  " , 
//			
//			countQuery = "    select count(1) from VW_DOC_REPORT r  " + 
//					"where r.DTT_APPROVAL_FILE >= nvl(:fromDate, r.DTT_APPROVAL_FILE) " + 
//					"and r.DTT_APPROVAL_FILE <= nvl(:toDate, r.DTT_APPROVAL_FILE)  " ,
//			nativeQuery = true)
//	Page<DocumentReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);
}
