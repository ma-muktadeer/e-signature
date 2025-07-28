package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.esignature.entity.Institution;

public interface InstitutionRepo extends JpaRepository<Institution, Long> {

//	Page<Institution> findAllByActive(int i, Pageable pageable);
//
	Institution findAllByInstitutionIdAndActive(Long institutionId, int i);

	List<Institution> findAllByTypeAndActive(String insType, int i);
//
//	List<Institution> findAllByStatusAndInstitutionNameNotAndActive(String status, String institutionName, int i);
//
//	List<Institution> findAllByTypeAndStatusAndOwnInstitutionAndActive(String type, String approved, int i, int j);
//
	@Query(value = "SELECT I.* FROM T_INSTITUTION I, T_USER U"
			+ " WHERE I.ID_INSTITUTION_KEY = U.ID_INSTITUTION_KEY"
			+ " AND U.ID_USER_KEY = :userId AND U.IS_ACTIVE = :isActive"
			+ " AND U.IS_ACTIVE = I.IS_ACTIVE", nativeQuery = true)
	Institution findAllByUserIdAndActive(@Param("userId") long userId,@Param("isActive") int isActive);
//
//	List<Institution> findAllByStatusAndActive(String approved, int i);
//
//	boolean existsByInstitutionIdAndOwnInstitutionAndActive(Long institutionId, int i, int j);
//
////	List<InstitutionView> findAllByOwnInstitutionAndActiveAndStatus(int i, int j, String approved);
//
////	boolean existsByinstitutionNameAndTypeAndActive(String institutionName, String string, int i);
//	boolean existsByinstitutionNameAndActive(String institutionName, int i);

}
