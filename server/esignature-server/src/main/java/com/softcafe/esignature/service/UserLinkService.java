package com.softcafe.esignature.service;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.core.model.User;
import com.softcafe.esignature.entity.UserLink;
import com.softcafe.esignature.repo.UserLinkRepo;
import com.softcafe.esignature.utils.Str;
import com.softcafe.esignature.utils.Utils;

@Service
public class UserLinkService extends AbstractService<UserLink> {
	private static final Logger log = LoggerFactory.getLogger(UserLinkService.class);
	
	@Value("${user.set.pass.url.time}")
	private int expireHour;
	
	@Autowired
	private UserLinkRepo userLinkRepo;


	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;
		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

			if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
//			List<FreeText> obj = save(requestMessage, actionType);
//			msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {

			}
		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}
	
	public UserLink save(User user, String linkType, Long otpId) throws ParseException {
		UserLink ul = new UserLink();
		
		ul.setCreatorId(user.getUserId());
		ul.setCreateDate(new Date());
		ul.setUserId(user.getUserId());
		ul.setLinkType(linkType);
		ul.setOtpId(otpId);
		
		String link = Utils.makeLink();

		ul.setLink(link);
		
		ul.setExpireDate(makeDate());
		
		log.info("generating uuid is: expire date [{}:{}]", link, ul.getExpireDate());
		
		return userLinkRepo.save(ul);
	}


	private Date makeDate() throws ParseException {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.HOUR, expireHour);  // number of hours to add
		return c.getTime();
	}

	public UserLink findUserLink(String link) {
		
		return userLinkRepo.findAllByLinkAndActive(link, 1);
	}

	public void deleteLink(Long userId) {
		UserLink dbLink = userLinkRepo.findByUserIdAndActive(userId, 1);
		if(dbLink != null) {
			dbLink.setActive(0);
			dbLink.setModDate(new Date());
			dbLink.setUserModId(userId);
			userLinkRepo.save(dbLink);
		}else {
			log.info("Can not find value of t_user_link table for userId:{}", userId);
			throw new RuntimeException("Link not found");
		}
		
	}

	public UserLink findUserLinkByUserId(Long userId) {
		log.info("finding link for userId: {}", userId);
		return userLinkRepo.findByUserIdAndActive(userId, 1);
	}

	public void updateUserLink(UserLink ul, long userId, String status) {
		ul.setActive(0);
		ul.setModDate(new Date());
		ul.setUserModId(userId);
		ul.setStatus(status);
		userLinkRepo.save(ul);
	}

	public UserLink findUserLinkByLink(String link) {
		return userLinkRepo.findAllByLink(link);
	}

	public List<UserLink> findUserLinkByUserIdAndLinkType(Long userId, String forgetPass) {
		
		return userLinkRepo.findUserLinkByUserIdAndLinkTypeAndActive(userId, forgetPass, 1);
	}

	public void deleteLinkByList(List<UserLink> linkList, Long userId) {
		for (UserLink userLink : linkList) {
			updateUserLink(userLink, userId, Str.FAILED);
		}
		
	}
	
//	public static void main(String[] args) throws ParseException {
//		UserLinkService ur = new UserLinkService();
//		System.out.println(ur.expireHour + " " + ur.makeDate());
//	}
	
}
