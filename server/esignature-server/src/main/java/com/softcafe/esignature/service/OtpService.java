package com.softcafe.esignature.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.softcafe.core.model.User;
import com.softcafe.esignature.entity.Otp;
import com.softcafe.esignature.repo.OtpRepo;
import com.softcafe.esignature.utils.Utils;

@Service
public class OtpService {

	private static final Logger log = LoggerFactory.getLogger(OtpService.class);

	@Value("${user.set.pass.otp.time}")
	private int expireHour;
	
	@Value("${isDefaultOtp:false}")
	private boolean isDefaltOtp;

	@Autowired
	private OtpRepo otpRepo;

	public List<Otp> findOtpByUserIdAndOtpType(Long userId, String forgetPass) {

		return otpRepo.findAllByUserIdAndOtpTypeAndActive(userId, forgetPass, 1);
	}

	public void deleteOtpByList(List<Otp> otpList, Long userId, String otpStatus) {
		for (Otp otp : otpList) {
			updateOtp(otp, userId, otpStatus);
		}
	}

	private void updateOtp(Otp otp, Long userId, String status) {
		otp.setActive(0);
		otp.setModDate(new Date());
		otp.setUserModId(userId);
		otp.setStatus(status);
		otpRepo.save(otp);
	}

	public Otp saveFaildOtp(User user, String otpType, String status) {
		Otp otp = new Otp();

		otp.setCreatorId(user.getUserId());
		otp.setCreateDate(new Date());
		otp.setUserId(user.getUserId());
		otp.setOtpType(otpType);

//		String link = Utils.makeLink();
		String ot = Utils.makeNewOtp(6);

		otp.setOtp(ot);

		otp.setExpireDate(makeDate());
		updateOtp(otp, user.getUserId(), status);
		return otpRepo.save(otp);
	}

	public Otp saveNew(User user, String otpType) {
		Otp otp = new Otp();

		otp.setCreatorId(user.getCreatorId());
		otp.setCreateDate(new Date());
		otp.setUserId(user.getUserId());
		otp.setOtpType(otpType);

//		String link = Utils.makeLink();
		String ot = !isDefaltOtp ? Utils.makeNewOtp(6):"123456";
		otp.setOtp(ot);

		otp.setExpireDate(makeDate());

		log.info("generating uuid is: expire date [{}:{}]", ot, otp.getExpireDate());

		return otpRepo.save(otp);
	}

	private Date makeDate() {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MINUTE, expireHour); // number of hours to add
		return c.getTime();
	}

	public Otp findOtp(String otp, Long userId, String otpType) {
		return otpRepo.findAllByOtpAndUserIdAndOtpTypeAndActive(otp, userId, otpType, 1);
	}

	
}
