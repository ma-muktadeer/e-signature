package com.softcafe.core.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.core.model.Preference;
import com.softcafe.core.repo.PreferenceRepo;
import com.softcafe.core.util.AppUtils;

@Service
public class PreferenceService extends AbstractService<Preference> {
	private static final Logger log = LoggerFactory.getLogger(PreferenceService.class);
	
	@Autowired
	PreferenceRepo prefRepo;

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<Preference> objList = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				List<Preference> objList = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				List<Preference> objList = update(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				List<Preference> objList = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
		}

		return msgResponse;
	}

	private List<Preference> delete(Message<List<Preference>> message, String action) {
		Preference pref = message.getPayload().get(0);
		pref.setActive(0);
		prefRepo.save(pref);
		return AppUtils.toList(prefRepo.findAll());
	}

	private List<Preference> select(Message<List<Preference>> message, String action) throws Exception {
		Preference pref = message.getPayload().get(0);
		return AppUtils.toList(prefRepo.findAll());
	}

	private List<Preference> insert(Message<List<Preference>> message, String action) throws Exception {
		Preference pref = message.getPayload().get(0);
		prefRepo.save(pref);
		return AppUtils.toList(prefRepo.findAll());
	}
	private void insert(Preference pref, String action) throws Exception {
		prefRepo.save(pref);
	}

	public List<Preference> insert(List<Preference> preferenceList, String action) throws Exception {
		preferenceList.parallelStream().forEach( map ->{
			try {
				insert(map, action);
			} catch (Exception e) {
				log.error("Error executing action/id [{}]",action);
			}
		});
		return AppUtils.toList(prefRepo.findAll());
	}


	private List<Preference> update(Message<List<Preference>> message, String action) throws Exception {
		Preference pref = message.getPayload().get(0);
		prefRepo.save(pref);
		return AppUtils.toList(prefRepo.findAll());
	}

}
