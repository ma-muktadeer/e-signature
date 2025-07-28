package com.softcafe.esignature.repo;

import com.softcafe.esignature.entity.Signatory;
import com.softcafe.esignature.entity.SignatureInfo;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SignatoryRepo extends JpaRepository<Signatory, Long> {
	
//	List<Signatory> findAllByActive(int i);

	Page<Signatory> findAllByActive(int i, Pageable pageable);

	Signatory findAllByPaAndInstitutionIdAndActive(String pa, Long institutionId, int i);
	Signatory findAllByEmailAndInstitutionIdAndActive(String email, Long institutionId, int i);
	
	Signatory findAllBySignatoryIdAndActive(Long id, int i);
	
	@Query(value = "SELECT PA_GEN_SEQ.nextval FROM DUAL", nativeQuery = true)
    public BigDecimal getPAFromSequence();

	List<Signatory> findAllByInstitutionIdNotInAndActive(List<Long> ids, int i, Sort descending);

	List<Signatory> findAllByInstitutionIdInAndActive(List<Long> ids, int i, Sort descending);

	List<Signatory> findAllByInstitutionIdInAndTypeAndActive(List<Long> institutionIds, String userType, int i,
			Sort descending);

	Page<Signatory> findAllByTypeAndActive(String type, int i, Pageable pageable);

	List<Signatory> findAllByInstitutionIdInAndTypeAndStatusAndActive(List<Long> institutionIds, String userType,
			String approved, int i, Sort descending);
	
	@Query(value = "SELECT s FROM Signatory s WHERE " +
            "(:employeeId IS NULL OR s.employeeId = :employeeId) AND " +
            "(:pa IS NULL OR s.pa = :pa) AND " +
            "(:email IS NULL OR s.email = :email) AND " +
            "(:institutionId IS NULL OR s.institutionId = :institutionId) AND "+
            "s.active = :active")
	Page<Signatory> findAllByEmployeeIdAndPaAndEmailAndInstitutionIdAndActive(
			@Param("employeeId") String employeeId,
           @Param("pa") String pa,
           @Param("email") String email,
           @Param("institutionId") Long institutionId,
           @Param("active") Integer active,
           Pageable pageable);

	Signatory findAllByEmployeeIdAndInstitutionIdAndActive(String employeeId, Long institutionId, int i);

	Signatory findAllByEmployeeIdAndPaAndInstitutionIdAndActive(String employeeId, String pa, Long institutionId, int i);

	List<Signatory> findAllByPaContainingIgnoreCaseOrNameContainingIgnoreCaseAndStatusAndActive(String pa, String name,
			String approved, int i);
}
