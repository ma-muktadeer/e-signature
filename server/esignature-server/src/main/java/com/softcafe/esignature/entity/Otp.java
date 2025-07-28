package com.softcafe.esignature.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.softcafe.core.model.BaseEntity;

@Entity
@Table(name="T_OTP")
public class Otp extends BaseEntity{


	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "OTP_GEN")
	@SequenceGenerator(name = "OTP_GEN", sequenceName = "OTP_SEQ", allocationSize = 1)
	@Column(name = "ID_OTP_KEY")
	private Long otpId;
	
	@Column(name="ID_USER_KEY")
	private Long userId;
	
	@Column(name = "TX_OTP")
	private String otp;
	

	@Column(name = "TX_OTP_TPYE", length = 56)
	private String otpType;
	
	@Column(name = "DT_EXPIRE")
	private Date expireDate;
	
	@Column(name = "TX_STATUS", length = 56)
	private String status;

	public Long getOtpId() {
		return otpId;
	}

	public void setOtpId(Long otpId) {
		this.otpId = otpId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getOtp() {
		return otp;
	}

	public void setOtp(String otp) {
		this.otp = otp;
	}

	public String getOtpType() {
		return otpType;
	}

	public void setOtpType(String otpType) {
		this.otpType = otpType;
	}

	public Date getExpireDate() {
		return expireDate;
	}

	public void setExpireDate(Date expireDate) {
		this.expireDate = expireDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	
}
