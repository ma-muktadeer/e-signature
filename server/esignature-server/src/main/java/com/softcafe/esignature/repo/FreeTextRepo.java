package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.FreeText;

public interface FreeTextRepo extends JpaRepository<FreeText, Long>{

	List<FreeText> findAllByActive(int active);

}
