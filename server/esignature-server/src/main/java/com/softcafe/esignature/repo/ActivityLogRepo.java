package com.softcafe.esignature.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.ActivityLog;

public interface ActivityLogRepo extends JpaRepository<ActivityLog, Long>{

}
