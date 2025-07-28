package com.softcafe.esignature.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.softcafe.core.model.User;
import com.softcafe.esignature.entity.PasswordList;
import com.softcafe.esignature.repo.PasswordListRepo;

@Service
public class PasswordListService {

	private static final Logger log = LoggerFactory.getLogger(SecurityQuestionService.class);
	static Gson gson = null;
	static {
		gson = new Gson();
	}

	@Autowired
	private PasswordListRepo passwordListRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public void savePassword(User user, String oldPass, Long creatorId, String type, Long objectId) {
		PasswordList pl = new PasswordList();
		pl.setUserId(user.getUserId());
		pl.setOldPassword(oldPass);
		pl.setClientId(creatorId);
		pl.setCreateDate(new Date());
		pl.setModDate(new Date());
		pl.setUserModId(creatorId);
		pl.setType(type);
		pl.setObjectId(objectId);
		passwordListRepo.save(pl);
	}

	public boolean checkValidationForPass(Long userId, String password) {
		List<String> last3Pass = passwordListRepo.find3PasswordList(userId).stream().map(PasswordList::getOldPassword)
				.collect(Collectors.toList());

//		List<String> last3Pass = last3List.stream().map(PasswordList::getOldPassword).collect(Collectors.toList());
		log.info("getting last 3 pass for this user is: \n[{},{}]", userId, gson.toJson(last3Pass));

		return isValidPass(last3Pass, password);
	}

	private boolean isValidPass(List<String> last3Pass, String password) {
//		boolean res = last3Pass.contains(password); //the passwor is encripted so it can not get the correct ans
		boolean res = true;
		for (String p : last3Pass) {
			res = !passwordEncoder.matches(password, p);
			if (res) {
				continue;
			} else {
				return res;
			}
		}

		log.info("the usser password and isValid is: [{} : {}]", password, res);
		return res;
	}

	public PasswordList findLastChangPass(Long userId) {
		
		return passwordListRepo.findFirstByUserIdAndActive(userId, 1, Sort.by("createDate").descending());
	}

}
