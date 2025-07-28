package com.softcafe.core.security;

import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.softcafe.core.model.BlacklistedToken;
import com.softcafe.core.repo.BlacklistedTokenRepository;
import com.softcafe.core.util.AppPermissionEnum;
import com.softcafe.esignature.entity.ViewUserPermission;
import com.softcafe.esignature.exceptions.PermissionNotAllowedException;
import com.softcafe.esignature.repo.ViewUserPermissionRepo;

@Service
public class SecurityService {

//	public static final long tokenExpSec = 60000 * 60 * 12;
//	@Value("${extUserFirstLoginMailSubject:Signature profile complete}")
//	String extUserFirstLoginMailSubject;

	@Value("${jwt.exp.time:60}")
	public long tokenExpSec;

	public static String secret = "sdlkjsoifsljdlewruo309!)@&$/weor8w)@&#@&IYDIWQYE@&#)(@!40234p3o3ixm234u9";

	@Value("${default.permission.denied.msg:Permission not allowed to do the action}")
	String defaultPermissionDeniedMsg;

	@Value("${check.permission.backend}")
	boolean isCheckPermission;

	@Autowired
	ViewUserPermissionRepo userPermissionRepo;
	@Autowired
	private BlacklistedTokenRepository blacklistedTokenRepository;

	@PostConstruct
	public void init() {

	}

	public boolean hasPermission(Long userId, AppPermissionEnum permission, String msg)
			throws PermissionNotAllowedException {
		// current user all permission
		if (!isCheckPermission) {
			return true;
		}
		boolean found = checkPermission(userId, permission);

		if (!found) {
			throw new PermissionNotAllowedException(msg);
		}
		return found;
	}

	public boolean hasPermission(Long userId, AppPermissionEnum permission) throws PermissionNotAllowedException {
		return hasPermission(userId, permission, defaultPermissionDeniedMsg);
	}

	public boolean hasPermissionIn(Long userId, List<AppPermissionEnum> permissions)
			throws PermissionNotAllowedException {
		return hasPermissionIn(userId, permissions, defaultPermissionDeniedMsg);
	}

	public boolean hasPermissionIn(Long userId, List<AppPermissionEnum> permissions, String msg)
			throws PermissionNotAllowedException {

		boolean found = permissions.stream().anyMatch(p -> checkPermission(userId, p));

		if (!found) {
			throw new PermissionNotAllowedException(msg);
		}
		return found;
	}

	private boolean checkPermission(Long userId, AppPermissionEnum permission) {
		return userPermissionRepo.existsByUserIdAndPermissionName(userId, permission.toString());
	}

	public List<ViewUserPermission> loadUserPermission(Long userId) {
		if (userId == null) {
			return null;
		}
		return userPermissionRepo.findByUserId(userId);
	}

	// Blacklist a token
	public void blacklistToken(String token) {
		BlacklistedToken blacklistedToken = new BlacklistedToken(token,
				new Date(new Date().getTime() + tokenExpSec * 60 * 1000));
		blacklistedTokenRepository.save(blacklistedToken);
	}

	// Check if a token is blacklisted
	public boolean isTokenBlacklisted(String token) {
//        return blacklistedTokenRepository.isBlacklisted(token);
		return blacklistedTokenRepository.existsById(token);

	}

	// Clean up expired tokens
	@Scheduled(cron = "0 0 * * * ?")
	@Transactional
	public void cleanUpExpiredTokens() {
		blacklistedTokenRepository.deleteByExpiresAtBefore(new Date());
	}
}
