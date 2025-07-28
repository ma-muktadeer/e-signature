package com.softcafe.esignature.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.PublicLink;

public interface PublicLinkRepo extends JpaRepository<PublicLink, Long> {

	Optional<PublicLink> findByRequestIdAndViewLink(Long requestId, int i);

	Optional<PublicLink> findAllByPublicLinkAndLinkStatusAndViewLink(String publicLink, String approved, int i);

}
