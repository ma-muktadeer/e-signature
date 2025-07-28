package com.softcafe.core.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.core.model.Branch;

public interface BranchRepo extends JpaRepository<Branch, Long> {

//	@Override
//	@Query(value="select b from Branch b where active = 1")
//	List<Branch> findAll();
//
//	Page<Branch> findAllByActive(int i, Pageable pageable);
//
//	List<Branch> findAllByStatusAndActive(String status, int i, Sort ascending);
}
