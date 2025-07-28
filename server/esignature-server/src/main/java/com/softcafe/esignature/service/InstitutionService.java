package com.softcafe.esignature.service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.delfian.core.message.AbstractMessageHeader;
import com.delfian.core.message.ResponseBuilder;
import com.delfian.core.message.interfaces.Message;
import com.delfian.core.message.service.AbstractService;
import com.softcafe.constants.ActionType;
import com.softcafe.esignature.entity.Institution;
import com.softcafe.esignature.repo.InstitutionRepo;
import com.softcafe.esignature.repo.InstitutionViewRepo;
import com.softcafe.esignature.utils.Str;
import com.softcafe.esignature.view.InstitutionView;

@Service
public class InstitutionService extends AbstractService<Institution> {

	private static final Logger log = LoggerFactory.getLogger(InstitutionService.class);

	@Autowired
	private InstitutionRepo institutionRepo;
	
	@Autowired
	private InstitutionViewRepo institutionViewRepo;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;
		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

			if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				Page<InstitutionView> obj = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				List<InstitutionView> obj = selectAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.SELECT_ALL_INSTUTION.toString())) {
				List<InstitutionView> obj = selectInstitution(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_1.toString())) {
				InstitutionView obj = selectOne(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_2.toString())) {
				Page<InstitutionView> obj = select2(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.SELECT_ALL_WITHOUT_PRIME.toString())) {
				List<InstitutionView> obj = selectAllWithoutPrime(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<InstitutionView> obj = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			 else if (actionType.equals(ActionType.SEARCH_EX_INSTITUTION.toString())) {
					List<InstitutionView> obj = searchExInstitution(requestMessage, actionType);
					msgResponse = ResponseBuilder.buildResponse(header, obj);
				}
		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	private List<InstitutionView> selectInstitution(Message<List<Institution>> requestMessage, String actionType) {
		Institution ins = requestMessage.getPayload().get(0);
		Long institutionId = ins.getInstitutionId();

		Pageable pageable = PageRequest.of(ins.getPageNumber() != 0 ? ins.getPageNumber() - 1 : 1,
				ins.getPageSize() != 0 ? ins.getPageSize() : 20);
		if (institutionId != null) {
			return Arrays.asList(institutionViewRepo.findAllByInstitutionIdAndActive(institutionId, 1));
		}
		return institutionViewRepo.findAllByActive(1, pageable).getContent();
	}

	private List<InstitutionView> selectAllWithoutPrime(Message<List<Institution>> requestMessage, String actionType) {
		Institution ins = requestMessage.getPayload().get(0);

		return institutionViewRepo.findAllByStatusAndInstitutionNameNotAndActive(ins.getStatus(), ins.getInstitutionName(),
				1);
	}

	private List<InstitutionView> searchExInstitution(Message<List<Institution>> requestMessage, String actionType) {
	
		return institutionViewRepo.findAllByOwnInstitutionAndActiveAndStatus(0, 1, Str.APPROVED);
	}

	private Page<InstitutionView> select2(Message<List<Institution>> requestMessage, String actionType) {
		Institution ins = requestMessage.getPayload().get(0);
		Pageable pageable = PageRequest.of(ins.getPageNumber() - 1, ins.getPageSize(),
				Sort.by("institutionId").descending());

		return institutionViewRepo.findAllByActive(1, pageable);
	}

	private InstitutionView selectOne(Message<List<Institution>> requestMessage, String actionType) throws Exception {
		Institution ins = requestMessage.getPayload().get(0);
		log.info("Try to finding institution information for institutionId:{}", ins.getInstitutionId());
		if (ins.getInstitutionId() != null) {
			return institutionViewRepo.findAllByInstitutionIdAndActive(ins.getInstitutionId(), 1);
		} else {
			log.info("Institution Id not found");
			throw new Exception("Invalid request ");
		}
	}

	private List<InstitutionView> selectAll(Message<List<Institution>> requestMessage, String actionType) {
//		return getAllInstitution();
		return institutionViewRepo.findAllByTypeAndStatusAndOwnInstitutionAndActive(requestMessage.getPayload().get(0).getType(),
				Str.APPROVED, 0, 1);
	}

	private List<InstitutionView> select(Message<List<Institution>> requestMessage, String actionType) {
//		return getAllInstitution();
		return institutionViewRepo.findAllByStatusAndActive(Str.APPROVED, 1);
	}

	private Page<InstitutionView> save(Message<List<Institution>> requestMessage, String actionType) throws Exception {
		Institution ins = requestMessage.getPayload().get(0);
		Long userId = Long.valueOf(requestMessage.getHeader().getUserId());
		Pageable pageable = PageRequest.of(ins.getPageNumber() - 1, ins.getPageSize(),
				Sort.by("institutionId").descending());
		try {
			log.info("come to the Institution service for action:[{}]", actionType);
			if (ins.getInstitutionId() == null) {
//				boolean exit = institutionRepo.existsByinstitutionNameAndTypeAndActive(ins.getInstitutionName(), ins.getType(), 1);
				boolean exit = institutionViewRepo.existsByinstitutionNameAndActive(ins.getInstitutionName(), 1);
				if(exit) {
					log.info("Duplicat Institution Name. {}", ins.getInstitutionName());
					throw new RuntimeException("Duplicat Institution Name.");
				}
				ins = saveInstitution(ins, userId);
			} else {
				ins = updateInstitution(ins, userId);
			}

		} catch (Exception e) {
			log.info("Getting error :{}", e.getMessage());
			throw new Exception(e.getMessage());
		}

		return getAllInstitution(pageable);
	}

	private Page<InstitutionView> getAllInstitution(Pageable pageable) {
		return institutionViewRepo.findAllByActive(1, pageable);
	}

	private Institution updateInstitution(Institution entity, Long userModId) {
		log.info("trying to update Institution. InstitutionId : userModId: [{}, {}]", entity.getInstitutionId(),
				userModId);
		Institution ins = institutionRepo.findAllByInstitutionIdAndActive(entity.getInstitutionId(), 1);
		ins.setUserModId(userModId);
		ins.setModDate(new Date());
		ins.setInstitutionName(entity.getInstitutionName());
		ins.setType(entity.getType());
		ins.setNumberUser(entity.getNumberUser());
		ins.setNumberGenUser(entity.getNumberGenUser());
		ins.setStatus(entity.getStatus());
		ins.setDomain(entity.getDomain());
		if (entity.getStatus().equals(Str.PEND_UPDATE)) {
			log.info("getting from modify institution. for institution ID: {}", entity.getInstitutionId());
			ins.setUserModId(userModId);
			ins.setModDate(new Date());
		} else if (entity.getStatus().equals(Str.PEND_APPROVE) || entity.getStatus().equals(Str.PEND_DELETE)) {
			log.info("getting from checker institution. for institution ID: {}", entity.getInstitutionId());
			ins.setUserModId(userModId);
			ins.setModDate(new Date());
		} else if (entity.getStatus().equals(Str.APPROVED) || entity.getStatus().equals(Str.DELETED)) {
			log.info("getting from approver institution. for institution ID: {}", entity.getInstitutionId());
			ins.setApproveById(userModId);
			ins.setApproveTime(new Date());
			if (entity.getStatus().equals(Str.DELETED)) {
				log.info("getting from delete institution. for institution ID: {}", entity.getInstitutionId());
				ins.setActive(0);
			}
		} else {
			log.info("Invalid Status=[{}]", entity.getStatus());
			throw new RuntimeException("Invalid Status: " + entity.getStatus());
		}
		return saveEntity(ins);
	}

	private Institution saveInstitution(Institution entity, Long creatorId) {
		 HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		
		log.info("trying to save Institution. creatorId: [{}]", creatorId);
		Institution ins = new Institution();
		ins.setActive(1);
		ins.setCreateDate(new Date());
		ins.setCreatorId(creatorId);
		ins.setInstitutionName(entity.getInstitutionName());
		ins.setType(entity.getType());
		ins.setNumberGenUser(entity.getNumberGenUser());
		ins.setDomain(entity.getDomain());
		ins.setIpAddr(request.getRemoteAddr());
		ins.setIpGateway(request.getHeader("X-Forwarded-For"));
//		ins.setStatus(Str.APPROVED);
		if (StringUtils.isBlank(entity.getStatus())) {
			ins.setStatus(Str.NEW);
		} else {
			ins.setStatus(entity.getStatus());
		}
		ins.setNumberUser(entity.getNumberUser());
		return saveEntity(ins);
	}

	private Institution saveEntity(Institution ins) {
		return institutionRepo.save(ins);
	}

	public String getInstitutionName(Long institutionId) {
		Institution ins = institutionRepo.findAllByInstitutionIdAndActive(institutionId, 1);
		if (ins != null) {
			return ins.getInstitutionName();
		}
		log.info("institution name not found for institution ID:{}", institutionId);
		return "";
	}

	public List<Institution> getAllInstitutionByType(String insType) {

		return institutionRepo.findAllByTypeAndActive(insType, 1);
	}

	public Institution findInstitutionInfoByUserId(long userId) {
		log.info("find institution information by user id:{}", userId);
		return institutionRepo.findAllByUserIdAndActive(userId, 1);
	}

	public boolean findOwnInstitution(Long institutionId) {
		return institutionViewRepo.existsByInstitutionIdAndOwnInstitutionAndActive(institutionId, 1, 1);
	}

	
}
