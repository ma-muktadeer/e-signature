package com.softcafe.esignature.repo;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.esignature.entity.SignatureInfo;

public interface SignatureInfoRepo extends JpaRepository<SignatureInfo, Long> {

	Page<SignatureInfo> findAllByIsMainSignatureAndActive(int j, int i, Pageable pageable);

	List<SignatureInfo> findAllByPaContainingIgnoreCaseAndStatusAndActive(String pa, String status, int i);

//	List<SignatureInfo> xfindAllByNameContainingIgnoreCaseAndStatusAndActive(String name, String approved, int i);

//	SignatureInfo findAllByPaAndActive(String pa, int i);

	SignatureInfo findAllBySignatoryIdAndActive(Long signatoryId, int i);

	SignatureInfo findAllBySignatoryIdAndIsMainSignatureAndActive(Long signatoryId, int j, int i);

	SignatureInfo findByPaAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(String pa, String approved, int i,
			int j, int k);

	SignatureInfo findByPaAndStatusAndIsMainSignatureAndActive(String pa, String approved, int i, int j);

	SignatureInfo findByEmployeeIdAndStatusAndIsMainSignatureAndOwnInstitutionAndInstitutionIdAndActive(
			String employeeId, String approved, int i, int j, Long institutionId, int k);

	boolean existsByPaAndActive(String pa, int i);

	Page<SignatureInfo> findAllByActiveAndStatusAndSignatureStatusIn(int i, String approved, List<String> status4Notice,
			Pageable pageable);

	List<SignatureInfo> findAllByPaContainingIgnoreCaseAndStatusAndIsMainSignatureAndActive(String pa, String approved,
			int i, int j);

	List<SignatureInfo> findAllByEmployeeIdContainingIgnoreCaseAndStatusAndIsMainSignatureAndActive(String pa,
			String approved, int i, int j);

	List<SignatureInfo> findAllByNameContainingIgnoreCaseAndStatusAndIsMainSignatureAndActive(String name,
			String approved, int i, int j);

	@Query(value = "SELECT F.* FROM VW_SIGNATURE_INFO F " + "WHERE ( "
			+ "UPPER(F.TX_PA) LIKE '%' || UPPER(:pa) || '%' OR UPPER(F.TX_NAME) LIKE '%' || UPPER(:name) || '%' " + ") "
			+ "AND TX_STATUS = :status " + "AND INT_OWN_INSTITUTION = 1 " + "AND IS_MAIN_SIGNATURE = :i "
			+ "AND IS_ACTIVE = :j", nativeQuery = true)
	List<SignatureInfo> findAllByPaContainingIgnoreCaseOrNameContainingIgnoreCaseAndStatusAndIsMainSignatureAndActive(
			@Param("pa") String pa, @Param("name") String name, @Param("status") String status, @Param("i") int i,
			@Param("j") int j);

	@Query(value = "SELECT F.* FROM VW_SIGNATURE_INFO F " + "WHERE ( "
			+ "UPPER(F.TX_PA) LIKE '%' || UPPER(:pa) || '%' OR UPPER(F.TX_EMPLOYEE_ID) LIKE '%' || UPPER(:employeeId) || '%' "
			+ ") " + "AND TX_STATUS = :status " + "AND ID_INSTITUTION_KEY = :institutionId "
			+ "AND IS_MAIN_SIGNATURE = :i " + "AND IS_ACTIVE = :j", nativeQuery = true)
	List<SignatureInfo> findAllByPaContainingIgnoreCaseOrEmployeeIdContainingIgnoreCaseAndStatusAndInstitutionIdAndIsMainSignatureAndActive(
			@Param("pa") String pa, @Param("employeeId") String employeeId, @Param("status") String status,
			@Param("institutionId") Long institutionId, @Param("i") int i, @Param("j") int j);
	//

	List<SignatureInfo> findAllByPaContainingIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(String pa,
			String approved, int i, int j, int k);

	List<SignatureInfo> findAllByNameContainingIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(
			String name, String approved, int i, int j, int k);

	List<SignatureInfo> findByPaAndOwnInstitutionOrderBySignatureCreateDateDesc(String pa, int i);

	SignatureInfo findAllBySignatureIdAndActive(Long signatureId, int i);

	@Query(value = "SELECT s FROM SignatureInfo s WHERE " + "(:employeeId IS NULL OR s.employeeId = :employeeId) AND "
			+ "(:pa IS NULL OR s.pa = :pa) AND " + "(:email IS NULL OR s.email = :email) AND "
			+ "(:institutionName IS NULL OR s.institutionName = :institutionName) AND " + "s.isMainSignature = 1 AND "
			+ "(:name IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND "
			+ "s.active = :active")
	Page<SignatureInfo> findAllByEmployeeIdAndPaAndEmailAndInstitutionNameAndNameAndActive(
			@Param("employeeId") String employeeId, @Param("pa") String pa, @Param("email") String email,
			@Param("institutionName") String institutionName,@Param("name") String name, @Param("active") Integer active, Pageable pageable);

	boolean existsByEmployeeIdAndActive(String employeeId, int i);

	Page<SignatureInfo> findAllByisMainSignatureAndOwnInstitutionAndActive(int i, int j, int k, Pageable pageable);

	SignatureInfo findBySignatureInfoIdAndActive(Long signatureInfoId, int i);

//	SignatureInfo findByPaAndStatusAndIsMainSignatureAndOwnInstitutionAndInstitutionIdAndActive(String employeeId,
//			String approved, int i, int ownInstitution, Long institutionId, int j);

	List<SignatureInfo> findAllByNameContainingIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndInstitutionIdAndActive(
			String name, String approved, int i, int j, Long institutionId, int k);

//	 @Query(value = "SELECT DISTINCT ON (e.TX_EMPLOYEE_ID) e.* " +
//             "FROM VW_SIGNATURE_INFO e " +
//             "WHERE (LOWER(e.TX_PA) LIKE LOWER(CONCAT('%', :pa, '%')) " +
//             "OR LOWER(e.TX_NAME) LIKE LOWER(CONCAT('%', :name, '%'))) " +
//             "AND e.TX_STATUS = :status " +
//             "AND e.IS_MAIN_SIGNATURE = :isMainSignature " +
//             "ORDER BY e.ID_SIGNATURE_INFO_KEY", nativeQuery = true)
	@Query(value = "SELECT * " +
	        " FROM ( " +
	        "    SELECT i.*, ROW_NUMBER() OVER (PARTITION BY i.TX_EMPLOYEE_ID ORDER BY i.ID_SIGNATURE_INFO_KEY) AS rn " +
	        "    FROM VW_SIGNATURE_INFO i " +
	        "    WHERE i.IS_MAIN_SIGNATURE = 1 " +
	        " ) v " +
	        " WHERE v.rn = 1 " +
	        " AND (LOWER(v.TX_PA) LIKE LOWER('%' || :pa || '%') " +
	        "      OR LOWER(v.TX_NAME) LIKE LOWER('%' || :name || '%')) " +
	        " AND v.TX_STATUS = :status " +
	        " AND LOWER(v.INSTITUTION_NAME) LIKE LOWER('%prime bank%') " +  
	        " AND v.IS_MAIN_SIGNATURE = :isMainSignature ",
	        nativeQuery = true)
	List<SignatureInfo> findDistinctEmployeeIdByPaContainingIgnoreCaseOrNameContainingIgnoreCaseAndStatusAndIsMainSignature(
	        String pa, String name, String status, int isMainSignature);

//	@Query(value = "SELECT * " + " FROM ( "
//			+ "    SELECT i.*, ROW_NUMBER() OVER (PARTITION BY i.TX_EMPLOYEE_ID ORDER BY i.ID_SIGNATURE_INFO_KEY) AS rn "
//			+ "    FROM VW_SIGNATURE_INFO i " + "	   WHERE i.IS_MAIN_SIGNATURE = 1 " + " ) v " + " WHERE v.rn = 1 "
//			+ " AND (LOWER(v.TX_PA) LIKE ( LOWER('%' || :pa || '%')) "
//			+ " OR LOWER(v.TX_NAME) LIKE (LOWER('%' || :name || '%'))) " + " AND v.TX_STATUS = :status "
//			+ " AND v.IS_MAIN_SIGNATURE = :isMainSignature ", nativeQuery = true)
//	List<SignatureInfo> findDistinctEmployeeIdByPaContainingIgnoreCaseOrNameContainingIgnoreCaseAndStatusAndIsMainSignature(
//			String pa, String name, String status, int isMainSignature);

	@Query(value = "SELECT r FROM SignatureInfo r " 
			+ "WHERE (:institutionId IS NULL OR r.institutionId = :institutionId) "
			+ "AND (:fromDate IS NULL OR r.paAuthDate >= :fromDate) " 
			+ "AND (:toDate IS NULL OR r.paAuthDate <= :toDate) ",
			countQuery = "SELECT COUNT(1) FROM SignatureInfo r "
					+ "WHERE (:institutionId IS NULL OR r.institutionId = :institutionId) "
					+ "AND (:fromDate IS NULL OR r.paAuthDate >= :fromDate) " 
					+ "AND (:toDate IS NULL OR r.paAuthDate <= :toDate) "
			)
	Page<SignatureInfo> search(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate,
			@Param("institutionId") Long institutionId, Pageable page);

	Optional<List<SignatureInfo>> findByNameIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndActive(String name,
			String approved, int i, int j, int k);
	
	Optional<List<SignatureInfo>> findByNameIgnoreCaseAndStatusAndIsMainSignatureAndOwnInstitutionAndInstitutionIdAndActive(
			String employeeId, String approved, int i, int j, Long institutionId, int k);

	Slice<SignatureInfo> findAllByActiveAndStatusAndSignatureStatusInAndIsMainSignature(int i, String approved,
			List<String> status4Notice, int j, Pageable pageable);

	int countByEmployeeIdAndIsMainSignatureAndActive(String employeeId, int i, int j);

	List<SignatureInfo> findByEmployeeIdOrderBySignatureCreateDateDesc(String employeeId);
	

	@Query("SELECT e FROM SignatureInfo e WHERE "
			+ " LOWER(e.institutionName) LIKE LOWER(:institutionName) || '%'"
			+ " AND e.pa = :pa "
			+ " ORDER BY e.signatureCreateDate DESC")
	List<SignatureInfo> findByPaAndInstitutionNameStartingWithOrderBySignatureCreateDateDesc(String pa,String institutionName);

	Page<SignatureInfo> findAllByIsMainSignatureAndStatusNotAndActive(int i, String status, int j, Pageable pageable);
}
