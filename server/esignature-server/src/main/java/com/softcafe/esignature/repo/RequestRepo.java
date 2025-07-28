package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.Request;

public interface RequestRepo extends JpaRepository<Request, Long> {

	List<Request> findAllByActive(int i);

	List<Request> findAllByCreatorIdAndActiveOrderByCreateDateDesc(Long userId, int i);

	Request findAllByRequestIdAndActive(Long requestId, int i);

}
