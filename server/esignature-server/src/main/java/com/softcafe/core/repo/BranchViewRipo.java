package com.softcafe.core.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.softcafe.esignature.view.BranchView;

public interface BranchViewRipo extends JpaRepository<BranchView, Long>{
	
	@Override
	@Query(value="select b from Branch b where active = 1")
	List<BranchView> findAll();

	Page<BranchView> findAllByActive(int i, Pageable pageable);

	List<BranchView> findAllByStatusAndActive(String status, int i, Sort ascending);

}
