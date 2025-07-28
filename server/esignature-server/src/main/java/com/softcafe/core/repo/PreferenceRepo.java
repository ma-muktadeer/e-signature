package com.softcafe.core.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import com.softcafe.core.model.Preference;

public interface PreferenceRepo extends JpaRepository<Preference, Long>, JpaSpecificationExecutor<Preference>, QueryByExampleExecutor<Preference>{
	
}