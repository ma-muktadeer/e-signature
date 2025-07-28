package com.softcafe.esignature.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.TempStatus;

public interface TempStatusRepo extends JpaRepository<TempStatus, Long>{

}
