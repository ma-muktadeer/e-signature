package com.softcafe.esignature.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.google.gson.Gson;
import com.softcafe.constants.ActionType;
import com.softcafe.esignature.entity.SecurityQuestion;
import com.softcafe.esignature.entity.SecurityQuestionAnswer;
import com.softcafe.esignature.repo.SecurityQuestionAnswerRepo;

@Service
public class SecurityQuestionAnswerService extends AbstractService<SecurityQuestionAnswer> {
	private static final Logger log = LoggerFactory.getLogger(SecurityQuestionAnswerService.class);
	private static Gson gson;
	static {
		gson = new Gson();
	}

	@Autowired
	private SecurityQuestionAnswerRepo securityQuestionAnswerRepo;

	@Autowired
	private SecurityQuestionService securityQuestionServoce;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;
		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

			if (actionType.equals(ActionType.ACTION_SELECT_3.toString())) {
				List<SecurityQuestionAnswer> obj = select3(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	private List<SecurityQuestionAnswer> select3(Message<List<SecurityQuestionAnswer>> requestMessage,
			String actionType) {
		SecurityQuestionAnswer sqa = requestMessage.getPayload().get(0);
		log.info("finding security question and answer for user id: \n[{}]", sqa.getUserId());

		List<SecurityQuestionAnswer> ansList = securityQuestionAnswerRepo.findAllByUserId(sqa.getUserId());
		List<Long> qIds = ansList.stream().map(SecurityQuestionAnswer::getQuestionId).collect(Collectors.toList());
		log.info("question ids are: [{}]", gson.toJson(qIds));

		List<SecurityQuestion> sList = securityQuestionServoce.getQuestionList(qIds);
		log.info("question ids are: [{}]", gson.toJson(sList));

		ansList.forEach(e -> {
			for (SecurityQuestion s : sList) {
				if (e.getQuestionId() == s.getSecurityQuestionId()) {
					e.setSecurityQuestion(s.getSecurityQuestion());
				}
			}
		});

//		sqa.setSecurityQuestionsAnswerList(ansList);
//		sqa.setSecurityQuestionsList(sList);

		log.info("getting the questin and ans is:\n[{}]", gson.toJson(ansList));
		return ansList;
	}

	public boolean saveAnswerByList(List<SecurityQuestionAnswer> list) {
		log.info("come for save Sequrity question answer: [{}]", gson.toJson(list));

		try {
			if (list.size() == 3) {
				securityQuestionAnswerRepo.saveAll(list);
				return true;
			} else {
				log.info("getting error to save question answer...");
				throw new RuntimeException("Question must be three....");
			}
		} catch (Exception e) {
			log.info("getting error to save question answer: {}", e.getMessage());
			return false;
		}
	}

	public List<SecurityQuestionAnswer> matchQuestionAnswer(List<SecurityQuestionAnswer> questionAnswerList, Long userId) {
		List<SecurityQuestionAnswer> res = new ArrayList<SecurityQuestionAnswer>();
//		questionAnswerList.forEach(q -> {
//			log.info("testing the question answer. \nuserId : quertionId : questionAnswer is: [{},{},{}]", userId,
//					q.getSecurityQuestionId(), q.getQuestionAnswer());
//			SecurityQuestionAnswer dbAns = securityQuestionAnswerRepo.findByUserIdAndQuestionIdAndQuestionAnswerLikeAndActive(
//					q.getUserId(), q.getQuestionId(), q.getQuestionAnswer(), 1);
//			if (dbAns != null && !StringUtils.isBlank(dbAns.getQuestionAnswer())) {
//				log.info("sequrity question answer matched. \ninfo [{}]", gson.toJson(dbAns));
//				res.add(dbAns);
//			}
//		});
		
		for (SecurityQuestionAnswer q : questionAnswerList) {
			log.info("testing the question answer. \nuserId : quertionId : questionAnswer is: [{},{},{}]", userId,
					q.getSecurityQuestionId(), q.getQuestionAnswer());
			SecurityQuestionAnswer dbAns = securityQuestionAnswerRepo.findAllByQuestionAnswerAndQuestionIdAndUserIdAndActive(
					 q.getQuestionAnswer(), q.getSecurityQuestionId(), userId, 1);
			if (dbAns != null && !StringUtils.isBlank(dbAns.getQuestionAnswer())) {
				log.info("sequrity question answer matched. \ninfo [{}]", gson.toJson(dbAns));
				res.add(dbAns);
			}
		}
		return res;
	}

}
