package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.UserLink;

public interface UserLinkRepo extends JpaRepository<UserLink, Long>{

	UserLink findAllByLinkAndActive(String link, int i);

	UserLink findByUserIdAndActive(Long userId, int i);

	UserLink findAllByLink(String link);

	List<UserLink> findUserLinkByUserIdAndLinkTypeAndActive(Long userId, String forgetPass, int i);

}
