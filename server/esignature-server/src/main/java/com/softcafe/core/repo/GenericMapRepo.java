package com.softcafe.core.repo;

import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.core.model.GenericMap;

public interface GenericMapRepo extends JpaRepository<GenericMap, Long>, JpaSpecificationExecutor<GenericMap> {
	
	GenericMap findByFromIdAndFromTypeNameAndToIdAndToTypeName(Long fromId, String fromTypeName, Long toId,
			String toTypeName);

	GenericMap findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(Long fromId, String fromTypeName, Long toId, String toTypeName, int active);
	
	GenericMap findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndStatusAndActive(Long fromId, String fromTypeName, Long toId, String toTypeName,String status, int active);

	
	List<GenericMap> findByFromIdAndFromTypeNameAndToTypeNameAndActive(Long fromId, String fromTypeName,
			String toTypeName, int active);
	
	
	@Query(value="  select * from T_GENERIC_MAP   " + 
			"where is_active = 1  " + 
			"and lng_from_id = :fromId   " + 
			"and tx_from_type_name = :fromTypeName  " + 
			"and tx_to_type_name = :toTypeName  " + 
			"and tx_status in :statusList"
			+ "   ", nativeQuery = true)
	List<GenericMap> getToIdItemByStatus(@Param("fromId") Long fromId, @Param("fromTypeName") String fromTypeName,
			@Param("toTypeName") String toTypeName, @Param("statusList") Set<String> roleIdList);
	
	
	List<GenericMap> findByToIdAndToTypeNameAndFromTypeNameAndActive(Long toId, String toTypeName,
			String fromTypeName, int active);
	
	GenericMap findByToIdAndToTypeNameAndFromIdAndFromTypeNameAndActive(Long toId, String toTypeName,Long fromId,
			String fromTypeName, int active);
	
	List<GenericMap> findByFromIdAndActive(Long fromId, int active);
	
	

	@Transactional
	@Modifying
	@Query(value = "update GenericMap m " 
			+ "set m.active = 0 " 
			+ ", m.userModId = :userId " 
			+ ", m.modDate = :modDate " 
			+ " where m.fromTypeName = :fromType "
			+ " and m.toTypeName = :toTypeName "
			+ " and m.fromId  = :fromId")
	void unmapAllByFrom(@Param("fromId") Long fromId, @Param("fromType") String fromType, @Param("toTypeName") String toTypeName, @Param("userId") Long userId, @Param("modDate") Date modDate);
//
	
	@Transactional
	@Modifying
	@Query(value = "update GenericMap m " 
			+ "set m.active = 0 " 
			+ ", m.userModId = :userId " 
			+ ", m.modDate = :modDate " 
			+ " where m.fromTypeName = :fromType "
			+ " and m.toTypeName = :toTypeName "
			+ " and m.toId  = :toId")
	void unmapAllByTo(@Param("toId") Long toId, @Param("toTypeName") String toTypeName, @Param("fromType") String fromType, @Param("userId") Long userId, @Param("modDate") Date modDate);
//
	@Transactional
	@Modifying(clearAutomatically = true)
	@Query(value = "update GenericMap m " 
			+ " set m.active = 0 " 
			+ ", m.userModId = :userId " 
			+ ", m.modDate = :modDate " 
			+ " where m.fromTypeName = ':fromType' "
			+ " and m.fromId  = :fromId"
			+ " and m.toTypeName = ':toName' "
			+ " and m.toId  = :toId "
			)
	void unmapOne(@Param("fromId") Long fromId, @Param("fromType") String fromType, @Param("toId") Long toId, @Param("toName") String toName, @Param("userId") Long userId, @Param("modDate") Date modDate);

	List<GenericMap> findByFromIdAndFromTypeNameAndActive(Long fromId, String fromTypeName, int active);
}
