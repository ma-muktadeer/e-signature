package com.softcafe.esignature.view;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PasswordReportViewRepo extends JpaRepository<PasswordReportView, Long> {
//	@Query(value = "SELECT * FROM VW_PASSWORD_REPORT r "
//			+ "WHERE r.ID_USER_KEY = NVL(:userId, r.ID_USER_KEY) "
//			+ "AND r.DT_DATE_TIME >= NVL(TO_DATE(:fromDate, 'YYYYMMDDHH24MISS'), r.DT_DATE_TIME) "
//			+ "AND r.DT_DATE_TIME <= NVL(:toDate, r.DT_DATE_TIME) ", countQuery = "SELECT COUNT(1) FROM VW_PASSWORD_REPORT r "
//					+ "WHERE r.ID_USER_KEY = NVL(:userId, r.ID_USER_KEY) "
//					+ "AND r.DT_DATE_TIME >= NVL(TO_DATE(:fromDate, 'YYYYMMDDHH24MISS'), r.DT_DATE_TIME) "
//					+ "AND r.DT_DATE_TIME <= NVL(:toDate, r.DT_DATE_TIME) ", nativeQuery = true)
//	Page<PasswordReportView> search(@Param("fromDate") String fromDate, @Param("toDate") Date toDate,
//			@Param("userId") Long userId, Pageable page);

	@Query("SELECT r FROM PasswordReportView r " + "WHERE (:userId IS NULL OR r.userId = :userId) "
			+ "AND (:fromDate IS NULL OR r.dateTime >= :fromDate) " + "AND (:toDate IS NULL OR r.dateTime <= :toDate) ")
	Page<PasswordReportView> findAllByUserIdAndDateTimeBetween(@Param("userId") Long userId,
			@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable page);

}
