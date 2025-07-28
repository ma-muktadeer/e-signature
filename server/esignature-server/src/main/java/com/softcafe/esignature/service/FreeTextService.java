package com.softcafe.esignature.service;

import java.util.Date;
import java.util.List;

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
import com.softcafe.esignature.entity.FreeText;
import com.softcafe.esignature.repo.FreeTextRepo;
import com.softcafe.esignature.utils.Str;

@Service
public class FreeTextService extends AbstractService<FreeText> {

	private static final Logger log = LoggerFactory.getLogger(FreeTextService.class);
	static Gson gson = null;
	static {
		gson = new Gson();
	}

	@Autowired
	private FreeTextRepo freeTextRepo;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;
		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

			if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				List<FreeText> obj = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				List<FreeText> obj = selectAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_APPROVE.toString())) {
				List<FreeText> obj = approve(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	private List<FreeText> approve(Message<List<FreeText>> requestMessage, String actionType) throws Exception {

		FreeText freeText = requestMessage.getPayload().get(0);
		Long approverId = Long.valueOf(requestMessage.getHeader().getUserId());
		try {
			if (freeText.getFreeTextId() != null) {
				freeText = approveFreeText(freeText, approverId);
			} else {
				throw new RuntimeException("Free text not found.");
			}
		} catch (Exception e) {
			log.info("getting error for approving free text: id:error:\n[{}:{}]", freeText.getFreeTextId(), e);
			throw new Exception(e.getMessage());
		}
		return getAllFreeText();
	}

	private FreeText approveFreeText(FreeText freeText, Long approverId) throws Exception {
		log.info("come for approving free textid: [{}]", freeText.getFreeTextId());
		FreeText ft = freeTextRepo.findById(freeText.getFreeTextId()).get();
		ft.setBody(freeText.getReqBody());
		ft.setReqBody("");
		ft.setStatus(Str.APPROVED);
		ft.setApproveById(approverId);
		ft.setApproveTime(new Date());

		return saveEntity(ft);
	}

	private List<FreeText> selectAll(Message<List<FreeText>> requestMessage, String actionType) {

		return getAllFreeText();
	}

	private List<FreeText> save(Message<List<FreeText>> requestMessage, String actionType) throws Exception {

		FreeText freeText = requestMessage.getPayload().get(0);
		Long userId = Long.valueOf(requestMessage.getHeader().getUserId());
		try {
			log.info("come to the Free text service for action:[{}]", actionType);
			if (freeText.getFreeTextId() == null) {
				freeText = saveFreeText(freeText, userId);
			} else {
				freeText = updateFreetext(freeText, userId);
			}

		} catch (Exception e) {
			log.info("Getting error :{}", e.getMessage());
			throw new Exception();
		}

		return getAllFreeText();
	}

	private FreeText saveFreeText(FreeText freeText, Long creatorId) {
		log.info("trying to save free text. creatorId: [{}]", creatorId);
		FreeText ft = new FreeText();
		ft.setActive(1);
		ft.setCreateDate(new Date());
		ft.setCreatorId(creatorId);
//		ft.setBody(freeText.getBody());
		ft.setReqBody(freeText.getReqBody());
		ft.setSubject(freeText.getSubject());
		ft.setTextGroup(freeText.getTextGroup());
		ft.setStatus(Str.PENDING);
		ft.setType(freeText.getType());
		return saveEntity(ft);
	}

	private FreeText saveEntity(FreeText entity) {
		return freeTextRepo.save(entity);
	}

	private FreeText updateFreetext(FreeText freeText, Long userModId) {
		log.info("trying to update free text. freeTextId : userModId: [{}, {}]", freeText.getFreeTextId(), userModId);
		FreeText ft = freeTextRepo.findById(freeText.getFreeTextId()).get();
		ft.setUserModId(userModId);

		ft.setSubject(freeText.getSubject());
		ft.setStatus(freeText.getStatus());
		if(ft.getStatus().equals(Str.APPROVED)) {
			ft.setBody(ft.getReqBody());
			ft.setReqBody("");
		}else {
			ft.setReqBody(freeText.getReqBody());
		}
//		ft.setStatus(Str.PENDING);
		ft.setType(freeText.getType());
		ft.setTextGroup(freeText.getTextGroup());

//		ft.setApproveById(userModId);
		return saveEntity(ft);
	}

	private List<FreeText> getAllFreeText() {
		return freeTextRepo.findAllByActive(1);
	}

}
