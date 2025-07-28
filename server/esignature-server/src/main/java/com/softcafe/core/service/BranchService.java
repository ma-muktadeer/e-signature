package com.softcafe.core.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

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
import com.softcafe.core.model.Branch;
import com.softcafe.core.repo.BranchRepo;
import com.softcafe.core.repo.BranchViewRipo;
import com.softcafe.esignature.utils.Str;
import com.softcafe.esignature.view.BranchView;

@Service
public class BranchService extends AbstractService<List<Branch>> {

	private static final Logger log = LoggerFactory.getLogger(RoleService.class);

	@Autowired
	BranchRepo branchRepo;
	@Autowired
	private BranchViewRipo branchViewRipo;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {

			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				Page<BranchView> userLIst = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				Page<BranchView> userLIst = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			}
			else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				List<BranchView> userLIst = selectAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			}
			else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				BranchView userLIst = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			}
			else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
		}

		return msgResponse;
	}


	
	private BranchView delete(Message<List<Branch>> message, String actionType) throws Exception {
	    Branch branch = message.getPayload().get(0);	    
	    Optional<Branch> optionalDbBranch = branchRepo.findById(branch.getBranchId());
	    
	    if (!optionalDbBranch.isPresent()) {
	        throw new Exception("Branch not found");
	    }

	    Branch dbBranch = optionalDbBranch.get();

	    try {
//	        branchRepo.delete(dbBranch);
	    	dbBranch.setStatus(Str.PEND_DELETE);
	    	dbBranch.setUserModId(message.getHeader().getUserId().longValue());
	    	dbBranch.setModDate(new Date());
	    	dbBranch = branchRepo.save(dbBranch);
	    } catch (Exception e) {
	        throw new RuntimeException("Sorry, can't delete branch.", e);
	    }
	    return branchViewRipo.findById(branch.getBranchId()).get();
	}
	

	private Page<BranchView> save(Message<List<Branch>> message, String action) {
		Branch b = message.getPayload().get(0);
		Branch dbBranch = null;
		if(b.getBranchId() != null) {
			dbBranch = branchRepo.findById(b.getBranchId()).get();
		}
		boolean res = saveOrUpdate(dbBranch, b, Long.valueOf(message.getHeader().getUserId()));

//		if (b.getBranchId() == null) {
//			b.setCreatorId(Long.valueOf(message.getHeader().getUserId()));
//			b.setCreateDate(new Date());
//			b.setModDate(new Date());
//			b.setUserModId(Long.valueOf(message.getHeader().getUserId()));
//			branchRepo.save(b);
//			return branchRepo.findAll();
//		}
//
////		Branch dbBranch = branchRepo.findById(b.getBranchId()).get();
//		dbBranch.setActive(b.getActive());
//		dbBranch.setName(b.getName());
//		dbBranch.setAddress(b.getAddress());
//
//		branchRepo.save(dbBranch);
		
		if(!res) {
			throw new RuntimeException("Sorry, can't save branch.");
		}

		return select(message, action);
	}

	private boolean saveOrUpdate(Branch dbBranch, Branch b, Long userId) {
		Branch sb = null;
		if (dbBranch == null) {
			sb = b;
			sb.setCreateDate(new Date());
			sb.setCreatorId(userId);
		} else {
			sb = dbBranch;
			sb.setCbsBranchId(b.getCbsBranchId());
			sb.setBranchName(b.getBranchName());
			sb.setAdCode(b.getAdCode());
			sb.setRoutingNumber(b.getRoutingNumber());
			if(StringUtils.equals(sb.getStatus(), Str.PEND_DELETE)) {
				sb.setActive(0);
			}
			sb.setStatus(b.getStatus());
			
		}
		return saveBranch(sb, userId);

	}

	private boolean saveBranch(Branch sb, Long userId) {
		 HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		try {
			sb.setModDate(new Date());
			sb.setUserModId(userId);
			sb.setIpAddr(request.getRemoteAddr());
			sb.setIpGateway(request.getHeader("X-Forwarded-For"));
			branchRepo.save(sb);
			return true;
		} catch (Exception e) {
			log.info("getting error to saving branch.\n{}", e);
			return false;
		}
	}

	private Page<BranchView> select(Message<List<Branch>> message, String action) {
		Branch bnc = message.getPayload().get(0);
		
		Pageable pageable = PageRequest.of(bnc.getPageNumber() - 1, bnc.getPageSize(), Sort.by("branchId").descending());
		return branchViewRipo.findAllByActive(1, pageable);
	}
	
	private List<BranchView> selectAll(Message<List<Branch>> message, String action) {
		
		return branchViewRipo.findAllByStatusAndActive(Str.APPROVED, 1, Sort.by("branchName").ascending());
	}

}
