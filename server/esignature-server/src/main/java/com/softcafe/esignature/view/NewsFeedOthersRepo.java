package com.softcafe.esignature.view;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NewsFeedOthersRepo extends JpaRepository<NewsFeedOthersReportView, Long>{
	
//	@Query(value = " select * from VW_NEWS_FEET_OTHERS r  " + 
//			"where r.DTT_ACTIVITY >= nvl(:fromDate, r.DTT_ACTIVITY)  " + 
//			"and r.DTT_ACTIVITY <= nvl(:toDate, r.DTT_ACTIVITY)  " ,			
//			countQuery = "    select count(1) from VW_NEWS_FEET_OTHERS r  " + 
//					"where r.DTT_ACTIVITY >= nvl(:fromDate, r.DTT_ACTIVITY)  " + 
//					"and r.DTT_ACTIVITY <= nvl(:toDate, r.DTT_ACTIVITY)  ",
//			nativeQuery = true)
//	Page<NewsFeedOthersReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);
//	
//	
//	Page<NewsFeedOthersReportView> findAllByActivityBetween(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);

	
	
	
	
	@Query(value = "    select * from VW_NEWS_FEET_OTHERS r  " + 
			"where r.DTT_ACTIVITY >= nvl(:fromDate, r.DTT_ACTIVITY)  " + 
			"and r.DTT_ACTIVITY <= nvl(:toDate, r.DTT_ACTIVITY)  " +
            "order by r.ID_KEY desc",
			
			countQuery = "    select count(1) from VW_NEWS_FEET_OTHERS r  " + 
					"where r.DTT_ACTIVITY >= nvl(:fromDate, r.DTT_ACTIVITY)  " + 
					"and r.DTT_ACTIVITY <= nvl(:toDate, r.DTT_ACTIVITY)  ",
			nativeQuery = true)
	Page<NewsFeedOthersReportView> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);
}