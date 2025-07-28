package com.softcafe.esignature.repo;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.esignature.model.ViewActivityLog;

public interface ViewActivityLogRepo extends JpaRepository<ViewActivityLog, Long> {	
	@Query(value = "SELECT * FROM VIEW_ACTIVITY_LOG al " +
            "WHERE al.dtt_activity >= NVL(:fromDate, al.dtt_activity) " +
            "AND al.dtt_activity <= NVL(:toDate, al.dtt_activity) " +
            "AND (:email IS NULL OR al.tx_user_email = :email)"+
//            "AND (:name IS NULL OR al.TX_NAME = :name)",
"AND (:name IS NULL OR LOWER(al.TX_NAME) LIKE LOWER('%' || :name || '%'))",
    countQuery = "SELECT COUNT(1) FROM VIEW_ACTIVITY_LOG al " +
                 "WHERE al.dtt_activity >= NVL(:fromDate, al.dtt_activity) " +
                 "AND al.dtt_activity <= NVL(:toDate, al.dtt_activity) " +
                 "AND (:email IS NULL OR al.tx_user_email = :email)"+
//                 "AND (:name IS NULL OR al.TX_NAME = :name)"
"AND (:name IS NULL OR LOWER(al.TX_NAME) LIKE LOWER('%' || :name || '%'))",
             
    nativeQuery = true)
Page<ViewActivityLog> getLogs(@Param("fromDate") Date fromDate,
                           @Param("toDate") Date toDate,
                           @Param("email") String email,
                           @Param("name") String name,
                           Pageable pageable);
	
}
