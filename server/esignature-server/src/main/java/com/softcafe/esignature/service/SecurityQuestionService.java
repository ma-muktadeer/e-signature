package com.softcafe.esignature.service;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.google.gson.Gson;
import com.softcafe.constants.ActionType;
import com.softcafe.core.service.SConfigurationService;
import com.softcafe.esignature.entity.SecurityQuestion;
import com.softcafe.esignature.entity.SecurityQuestionAnswer;
import com.softcafe.esignature.repo.SecurityQuestionAnswerRepo;
import com.softcafe.esignature.repo.SecurityQuestionRepo;

import org.apache.commons.math3.ml.neuralnet.SquareNeighbourhood;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

@Service
public class SecurityQuestionService extends AbstractService<SecurityQuestion> {
    private static final Logger log = LoggerFactory.getLogger(SecurityQuestionService.class);
    private static Gson gson;
	static {
		gson = new Gson();
	}

    @Autowired
    private SecurityQuestionRepo securityQuestionRepo;
    @Autowired
	private SecurityQuestionAnswerRepo securityQuestionAnswerRepo;
    
    @Autowired
    private SConfigurationService sConfigurationService;



    @Override
    public Message<?> serviceSingle(Message requestMessage) throws Exception {
        AbstractMessageHeader header = null;
        Message<?> msgResponse = null;
        try {
            header = requestMessage.getHeader();
            String actionType = header.getActionType();
            log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

            if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
                SecurityQuestion obj = selectSecurityQuestion(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, obj);

            }else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
                SecurityQuestion obj = save(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, obj);

            }else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
                SecurityQuestion obj = delete(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, obj);

            }
            else if (actionType.equals(ActionType.ACTION_SELECT_3.toString())) {
                List<SecurityQuestion> obj = select3(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, obj);

            }else if (actionType.equals(ActionType.SELECT_ALL_INFO.toString())) {
                List<SecurityQuestion> obj = selectAllInfo(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, obj);

            }
            else {
                log.info("No action handle [{}]", actionType);
            }

        } catch (Exception ex) {

            msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

            log.error("Exception Message **** [{}]", ex);
        }

        return msgResponse;
    }

    private List<SecurityQuestion> selectAllInfo(Message<List<SecurityQuestion>> requestMessage, String actionType) {
    	log.info("finding security question and answer for user id: \n[{}]");

//		List<SecurityQuestionAnswer> ansList = securityQuestionAnswerRepo.findAllByUserId;
    	List<SecurityQuestion> sList  = securityQuestionRepo.findAllByActive(1);
    	sList.forEach(q->{
    		log.info("finding security question answer for questionId: [{}]", q.getSecurityQuestionId());
    		q.setQuestionAnsList(sConfigurationService.findAllAns4QuestionId(q.getSecurityQuestionId()));
    	});
    	
		return sList;
	}

	private List<SecurityQuestion> select3(Message<List<SecurityQuestion>> requestMessage, String actionType) {
		// TODO Auto-generated method stub
    	Long userId = requestMessage.getHeader().getUserId().longValue();
    	log.info("finding security question and answer for user id: \n[{}]", userId);

		List<SecurityQuestionAnswer> ansList = securityQuestionAnswerRepo.findAllByUserId(userId);
		
		List<Long> qIds = ansList.stream().map(SecurityQuestionAnswer::getQuestionId).collect(Collectors.toList());
		log.info("question ids are: [{}]", gson.toJson(qIds));

		List<SecurityQuestion> sList = getQuestionList(qIds);
		log.info("question ids are: [{}]", gson.toJson(sList));
		
		for (SecurityQuestion qus : sList) {
			qus.setQuestionAnsList(sConfigurationService.findAllAns4QuestionId(qus.getSecurityQuestionId()));
			
//			qus.setQuestionAnsList(securityQuestionAnswerRepo.findAllByQuestionIdAndUserIdAndActive(qus.getSecurityQuestionId(), userId, 1));
		}
		
//		sList.forEach(qus->{
//			qus.setQuestionAnsList(securityQuestionAnswerRepo.findAllBySecurityQuestionAnswerKey(qus.getSecurityQuestionId()));
//		});

		
		return sList;
	}

	private SecurityQuestion save(Message<List<SecurityQuestion>> requestMessage, String actionType) {

    	SecurityQuestion sq = requestMessage.getPayload().get(0);
    	SecurityQuestion dbSq = null;
    	if(sq.getSecurityQuestionId()!=null) {
    		dbSq = securityQuestionRepo.findAllBySecurityQuestionIdAndActive(sq.getSecurityQuestionId(), 1);
    		if(dbSq!=null) {
    			dbSq.setSecurityQuestion(sq.getSecurityQuestion());
    			dbSq.setModDate(new Date());
    			securityQuestionRepo.save(dbSq);
    		}else {
    			dbSq = saveNewQuestion(sq);
    		}
    	}else {
			dbSq = saveNewQuestion(sq);
    	}
    	
		return buildReaponse(dbSq);
	}
	private SecurityQuestion delete(Message<List<SecurityQuestion>> requestMessage, String actionType) {

    	SecurityQuestion sq = requestMessage.getPayload().get(0);
    	SecurityQuestion dbSq = null;
    	if(sq.getSecurityQuestionId()!=null) {
    		dbSq = securityQuestionRepo.findAllBySecurityQuestionIdAndActive(sq.getSecurityQuestionId(), 1);
    		if(dbSq!=null) {
    			dbSq.setActive(0);
    			dbSq.setUserModId(requestMessage.getHeader().getUserId().longValue());
    			dbSq.setModDate(new Date());
    			securityQuestionRepo.save(dbSq);
    		}else {
    			dbSq = saveNewQuestion(sq);
    		}
    	}else {
			dbSq = saveNewQuestion(sq);
    	}
    	
		return buildReaponse(dbSq);
	}

	private SecurityQuestion buildReaponse(SecurityQuestion dbSq) {
		SecurityQuestion res = new SecurityQuestion();
		res.setSaveOrUpdateQuestion(dbSq);
		res.setAllQuestion(securityQuestionRepo.findAllByActive(1));
		return res;
	}

	private SecurityQuestion saveNewQuestion(SecurityQuestion sq) {
		 HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		sq.setActive(1);
		sq.setCreateDate(new Date());
		sq.setIpAddr(request.getRemoteAddr());
		sq.setIpGateway(request.getHeader("X-Forwarded-For"));
		return securityQuestionRepo.save(sq);
	}

	private SecurityQuestion selectSecurityQuestion(Message<List<SecurityQuestion>> requestMessage, String actionType) {
        return buildReaponse(null);
    }

	public List<SecurityQuestion> getQuestionList(List<Long> qIds) {
		
		return securityQuestionRepo.findAllByIdAndActive(qIds, 1);
	}
}
