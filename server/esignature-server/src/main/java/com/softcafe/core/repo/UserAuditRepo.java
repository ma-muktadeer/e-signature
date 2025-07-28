package com.softcafe.core.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.core.model.UserAudit;

public interface UserAuditRepo extends JpaRepository<UserAudit, Long> {

}
