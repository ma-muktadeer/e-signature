package com.softcafe.core.model;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "blacklisted_tokens")
public class BlacklistedToken {

    @Id
    @Column(name = "tx_token", nullable = false, length = 1500)
    private String token;

    @Column(name = "dt_expires_at", nullable = false)
    private Date expiresAt;

    // Default constructor
    public BlacklistedToken() {
    }

    // Constructor with fields
    public BlacklistedToken(String token, Date expiresAt) {
        this.token = token;
        this.expiresAt = expiresAt;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Date expiresAt) {
        this.expiresAt = expiresAt;
    }
}
