package com.softcafe.esignature.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.MailTracker;

public interface MailTrackerRepo extends JpaRepository<MailTracker, Long> {

}
