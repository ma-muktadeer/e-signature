package com.softcafe.esignature.service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.esignature.entity.ActivityLog;
import com.softcafe.esignature.model.ViewActivityLog;
import com.softcafe.esignature.repo.ActivityLogRepo;
import com.softcafe.esignature.repo.ViewActivityLogRepo;
import com.softcafe.esignature.utils.ActivityType;

@Service
public class ActivityLogService extends AbstractService<ActivityLog> {

	private static final Logger log = LoggerFactory.getLogger(ActivityLogService.class);
	private static final String VIA = "VIA";
	private static final DateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
	
	@Autowired
	ActivityLogRepo activityLogRepo;
	
	@Autowired
	ViewActivityLogRepo viewActivityLogRepo;

	@Autowired
	private ViewActivityLogService viewActivityLogService;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;
		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

			if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				Page<ViewActivityLog> obj = selectAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			} else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				ActivityLog obj = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			}
			else if (actionType.equals(ActionType.SELECT_ALL_INFO.toString())) {
				String obj = selectAllInfo(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			}
			else if (actionType.equals(ActionType.SELECT_ALL_INFO.toString())) {
				String obj = selectAllInfo(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);

			}else if(actionType.equals(ActionType.ACTIVITY_LOG_SEARCH.toString())) {
				Page<ViewActivityLog> obj = getLogs(requestMessage, actionType);
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

	
	public Page<ViewActivityLog> getLogs(Message<List<ActivityLog>> requestMessage, String actionType) throws ParseException {
		 ActivityLog r = requestMessage.getPayload().get(0);

		    Date fromDate = yyyyMMddHHmmss.parse(r.getFromDate());
		    Date toDate = yyyyMMddHHmmss.parse(r.getToDate());
		    String email = r.getEmail();
		    String name = r.getName();
		    Pageable pageable = PageRequest.of(r.getPageNumber() - 1, r.getPageSize(),
		                                       Sort.by("DTT_ACTIVITY").descending());
		    Page<ViewActivityLog> result = viewActivityLogRepo.getLogs(fromDate, toDate, email,name, pageable);

		    return result;
	}

	private String selectAllInfo(Message<List<ActivityLog>> requestMessage, String actionType) {
		save(requestMessage.getHeader().getUserId().longValue(), null,
				ActivityType.VIEW_CONTACT_INFO, requestMessage.getHeader().getSenderSourceIPAddress(),
				requestMessage.getHeader().getSenderGatewayIPAddress());
		return "save success";
	}

	public ActivityLog save(Message<List<ActivityLog>> requestMessage, String actionType) {
		ActivityLog activity = null;

		try {
			activity = requestMessage.getPayload().get(0);
			log.info("Saving activity [{}]", activity.toString());
			activity.setSourceIp(requestMessage.getHeader().getSenderSourceIPAddress());
			activity.setGatewayIp(requestMessage.getHeader().getSenderGatewayIPAddress());
			activity.setActivityTime(new Date());

			activity = activityLogRepo.save(activity);
		} catch (Exception e) {
			log.error("Error saving activity log {}", e);
		}

		return activity;

	}

	public Page<ViewActivityLog> selectAll(Message<List<ActivityLog>> requestMessage, String actionType) {
//		return activityLogRepo.findAll(Sort.by(Direction.DESC, "activityTime"));
		ActivityLog activityLog = requestMessage.getPayload().get(0);
		Pageable pageable = PageRequest.of(activityLog.getPageNumber() - 1, activityLog.getPageSize(),
				Sort.by("activityTime").descending());
		return viewActivityLogService.findAllActivityLog(pageable);
	}

	public void save(Long userId, Long onId, ActivityType activityType, String sourceIp, String gatewayIp) {
		save(userId, onId, activityType, sourceIp, gatewayIp, null, null);
	}

	public void save(Long userId, Long onId, ActivityType activityType, String sourceIp, String gatewayIp, String pa,
			String name) {
		log.info("Saving activity [{}]:[{}]:[{}]:[{}]:[{}]:[{}]:[{}]", userId, onId, activityType.toString(), sourceIp,
				gatewayIp, pa, name);

		ExecutorService future = Executors.newFixedThreadPool(1);

		Runnable runnableTask = () -> {
			try {
				ActivityLog l = new ActivityLog();
				l.setActivityTime(new Date());
				l.setActivityType(activityType);
				l.setGatewayIp(gatewayIp);
				l.setOnId(onId);
				l.setSourceIp(sourceIp);
				l.setUserId(userId);
				l.setPa(pa);
				l.setName(name);

				activityLogRepo.save(l);
			} catch (Exception e) {
				log.error("Error saving activity log [{}]:\n{}", activityType, e);
			}
		};

		future.execute(runnableTask);

	}
	public void saveSignatuerSearch(Long userId, Long onId, ActivityType activityType, String sourceIp, String gatewayIp, String pa,
			String name, String status) {
		log.info("Saving activity [{}]:[{}]:[{}]:[{}]:[{}]:[{}]:[{}]:[{}]", userId, onId, activityType.toString(), sourceIp,
				gatewayIp, pa, name, status);

		ExecutorService future = Executors.newFixedThreadPool(1);

		Runnable runnableTask = () -> {
			try {
				ActivityLog l = new ActivityLog();
				l.setActivityTime(new Date());
				l.setActivityType(activityType);
				l.setGatewayIp(gatewayIp);
				l.setOnId(onId);
				l.setSourceIp(sourceIp);
				l.setUserId(userId);
				l.setPa(pa);
				l.setName(name);
				l.setStatus(status);
				activityLogRepo.save(l);
			} catch (Exception e) {
				log.error("Error saving activity log [{}]:\n{}", activityType, e);
			}
		};

		future.execute(runnableTask);

	}
}
