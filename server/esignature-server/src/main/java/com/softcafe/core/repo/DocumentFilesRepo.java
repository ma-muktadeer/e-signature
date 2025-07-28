package com.softcafe.core.repo;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.core.model.DocumentFiles;

public interface DocumentFilesRepo extends JpaRepository<DocumentFiles, Long>{

	List<DocumentFiles> findAllByObjectIdAndActiveOrderByCreateDateDesc(Long signatoryId, int i);

	List<DocumentFiles> findAllByObjectTypeAndObjectIdAndActive(String objectType, Long objectId, int i);
	
	List<DocumentFiles> findAllByObjectTypeInAndAndActive(List<String> objectType, int i);
	
	List<DocumentFiles> findAllByGroupAndActive(String group, int i, Sort sort);

	DocumentFiles findAllByDocumetnFilesIdAndActive(Long documetnFilesId, int i);


}
