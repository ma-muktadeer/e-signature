package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.Otp;

public interface OtpRepo extends JpaRepository<Otp, Long>{

	List<Otp> findAllByUserIdAndOtpTypeAndActive(Long userId, String forgetPass, int i);

	Otp findAllByOtpAndActive(String otp, int i);

//	Otp findAllByOtpAndUserIdAndActive(String otp, Long userId, int i);

	Otp findAllByOtpAndUserIdAndOtpTypeAndActive(String otp, Long userId, String otpType, int i);

}
