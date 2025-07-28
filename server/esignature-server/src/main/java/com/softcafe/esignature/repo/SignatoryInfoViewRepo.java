package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.esignature.view.SignatoryInfoView;

public interface SignatoryInfoViewRepo extends JpaRepository<SignatoryInfoView, Long> {

	Page<SignatoryInfoView> findAllByTypeAndActive(String type, int i, Pageable pageable);

	Page<SignatoryInfoView> findAllByActive(int i, Pageable pageable);

	@Query(value = "SELECT s FROM SignatoryInfoView s WHERE " 
			+ "(:employeeId IS NULL OR s.employeeId = :employeeId) AND "
			+ "(:pa IS NULL OR s.pa = :pa) AND " + "(:email IS NULL OR s.email = :email) AND "
			+ "(:institutionId IS NULL OR s.institutionId = :institutionId) AND " 
			+ "(:name IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND "
			+ "s.active = :active")
	Page<SignatoryInfoView> findAllByEmployeeIdAndPaAndEmailAndInstitutionIdAndNameAndActive(
			@Param("employeeId") String employeeId,
	           @Param("pa") String pa,
	           @Param("email") String email,
	           @Param("institutionId") Long institutionId,
	           @Param("name") String name,
	           @Param("active") Integer active,
	           Pageable pageable);

	List<SignatoryInfoView> findAllByPaContainingIgnoreCaseOrNameContainingIgnoreCaseAndStatusAndActive(String pa, String name,
			String approved, int i);

	List<SignatoryInfoView> findAllByInstitutionIdInAndTypeAndStatusAndActive(List<Long> institutionIds, String userType,
			String approved, int i, Sort descending);

}
