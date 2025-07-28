package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.AgreementFileInfo;

public interface AgreementFileInfoRepo extends JpaRepository<AgreementFileInfo, Long>{

	List<AgreementFileInfo> findAllByConfigGroupAndConfigSubGroupInAndActive(String configGroup,
			List<String> configSubGroupList, int i);

}
