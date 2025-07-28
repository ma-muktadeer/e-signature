package com.softcafe.esignature.repo;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.esignature.model.ViewRequest;
import com.softcafe.esignature.view.DocumentReportView;

public interface ViewRequestRepo extends JpaRepository<ViewRequest, Long> {

//	@Query(value = "SELECT * FROM VW_EXTERNAL_USER_REQUEST R "
//			+ " WHERE R.ID_INSTITUTION_KEY = :institutionId", nativeQuery = true)
	Page<ViewRequest> findAllByInstitutionId(Long institutionId, Pageable pageable);

	ViewRequest findAllByExternalUserRequestId(Long requestId);
	
	@Query(value = "    select * from VW_REQUEST r  " + 
			"where r.DTT_MOD >= nvl(:fromDate, r.DTT_MOD)  " + 
			"and r.DTT_MOD <= nvl(:toDate, r.DTT_MOD)  " , 
			
			countQuery = "    select count(1) from VW_REQUEST r  " + 
					"where r.DTT_MOD >= nvl(:fromDate, r.DTT_MOD) " + 
					"and r.DTT_MOD <= nvl(:toDate, r.DTT_MOD)  " ,
			nativeQuery = true)
	Page<ViewRequest> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);

}
