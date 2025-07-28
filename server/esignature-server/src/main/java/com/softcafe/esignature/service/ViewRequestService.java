package com.softcafe.esignature.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.softcafe.esignature.entity.Request;
import com.softcafe.esignature.model.ViewRequest;
import com.softcafe.esignature.repo.ViewRequestRepo;
import com.softcafe.esignature.utils.Utils;

@Service
public class ViewRequestService {
	
	private static final Logger log = LoggerFactory.getLogger(ViewRequestService.class);
	
	@Autowired
	private ViewRequestRepo viewExternalUserRequestRepo;

	public Page<ViewRequest> findAllRequest(Pageable pageable) {
		log.info("Find all request..........");
		
		Page<ViewRequest> pr = viewExternalUserRequestRepo.findAll(pageable);
		
		return buildImage(pr);
	}

	private Page<ViewRequest> buildImage(Page<ViewRequest> pr) {
		pr.getContent().stream().forEach(f->{
			if(f.getUserImage() != null) {
				try {
					f.setUserImage(Utils.file2Base64(f.getUserImage()));
				} catch (Exception e) {
					log.info("can not convart file to user image64. error: {}", e.getMessage());
					f.setUserImage("");
				}
				
			}
		});
		return pr;
	}

	public Page<ViewRequest> findAllRequestByCreatorId(Long institutionId, Pageable pageable) {
		Page<ViewRequest> pr = viewExternalUserRequestRepo.findAllByInstitutionId(institutionId, pageable);
		return buildImage(pr);
	}

	public ViewRequest findRequest(Long requestId) {
		return viewExternalUserRequestRepo.findAllByExternalUserRequestId(requestId);
	}

}
