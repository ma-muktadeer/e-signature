package com.softcafe.core.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.softcafe.core.model.Location;

public interface LocationRepo extends JpaRepository<Location, Long>, JpaSpecificationExecutor<Location>{
	
}
