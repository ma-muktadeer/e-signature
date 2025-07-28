package com.softcafe.core.repo;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.core.model.BlacklistedToken;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, String> {

    // Check if a token is blacklisted
    @Query("SELECT COUNT(b) > 0 FROM BlacklistedToken b WHERE b.token = :token")
    boolean isBlacklisted(@Param("token") String token);

    // Delete all expired tokens
    void deleteByExpiresAtBefore(Date now);
}
