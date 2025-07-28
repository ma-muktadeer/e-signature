package com.softcafe.esignature.service;

import java.util.Date;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.softcafe.core.model.User;
import com.softcafe.core.service.UserService;
import com.softcafe.esignature.entity.PublicLink;
import com.softcafe.esignature.entity.Request;
import com.softcafe.esignature.entity.SignatureInfo;
import com.softcafe.esignature.repo.PublicLinkRepo;
import com.softcafe.esignature.utils.Str;
import com.softcafe.esignature.utils.Utils;

@Service
public class PublicLinkService {

	private static final Logger log = LoggerFactory.getLogger(PublicLinkService.class);
	@Autowired
	private PublicLinkRepo publicLinkRepo;
	@Autowired
	private SignatureInfoService signatureInfoService;
	@Autowired
	private UserService userService;

	public PublicLink saveNew(Long requestId, Request req) {
		PublicLink pl = new PublicLink();
		pl.setRequestId(requestId);
		pl.setPa(req.getPa());
		pl.setLnkSendingEmail(req.getLnkSendingEmail());
		pl.setLinkType(req.getLinkType());

		if (req.getLinkType().equals("FOR_USER")) {
			User ur = userService.findUserByEmail(req.getLnkSendingEmail());
			if (ur == null) {
				throw new UsernameNotFoundException("User not found for the Email " + req.getLnkSendingEmail());
			}
		}

		pl.setPublicLink(Utils.makeLink());

		pl.setLinkStatus(Str.NEW);

		pl.setExpireDate(req.getEndDate());
		pl.setStartDate(req.getStartDate());

		return publicLinkRepo.save(pl);
	}

	public Optional<PublicLink> findPublicLickByRequestId(Long requestId) {
		log.info("Tring to finding public link information for requestId:{}", requestId);
		return publicLinkRepo.findByRequestIdAndViewLink(requestId, 0);

	}

	public void updateLink(PublicLink pl) {
		pl.setLinkStatus(Str.APPROVED);
		publicLinkRepo.save(pl);
	}

	public SignatureInfo findPublicLickByLink(String publicLink) throws Exception {

		PublicLink pl = findPublicLink(publicLink);
		if (pl == null) {
			throw new Exception("Imformation not found");
		}
		if (StringUtils.isBlank(pl.getPa())) {
			log.info("PA not found for the link:{}", publicLink);
			throw new RuntimeException("Invalid request");
		}

//		check the validation 
		checkValidation(pl);
		
		SignatureInfo ss = signatureInfoService.findAllByPa(pl.getPa());

		
//		update publick link
		updateLinkView(pl);
		
		ss = signatureInfoService.buildSignatureInfo(ss);
		ss.setSendingEmail(pl.getLnkSendingEmail());
		return ss;

	}

	private void updateLinkView(PublicLink pl) {
		pl.setViewLink(1);
		pl.setViewTime(new Date());
		publicLinkRepo.save(pl);

		
	}

	private void checkValidation(PublicLink pl) {
		// TODO Auto-generated method stub
		if(pl.getStartDate().after(new Date())) {
			log.info("Link is valid between fromDate:toDate = [{},{}]", pl.getStartDate(), pl.getExpireDate());
			throw new RuntimeException("Link is active from: "+pl.getStartDate() + " to: " +pl.getExpireDate());
		}
		if(pl.getExpireDate().before(new Date())) {
			log.info("Link time is expried. nowTime:linkExpireTime = [{},{}]", new Date(), pl.getExpireDate());
			updateLinkView(pl);
			throw new RuntimeException("Time is expired");
		}
		
	}

	public PublicLink findPublicLink(String publicLink) {
		log.info("tring to find publink information for public link: {}", publicLink);
		return publicLinkRepo.findAllByPublicLinkAndLinkStatusAndViewLink(publicLink, Str.APPROVED, 0)
				.orElseThrow(() -> new RuntimeException("Invalid link."));
	}

}
