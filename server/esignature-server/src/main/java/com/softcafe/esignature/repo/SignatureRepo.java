package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.softcafe.esignature.entity.Signature;
import com.softcafe.esignature.model.SignatureCount;

public interface SignatureRepo extends JpaRepository<Signature, Long> {
//    Signature findByPa(String accountId);

//	Signature findByPa(Long signatoryId);
//
//	Signature findByPaAndStatusAndActive(String pa, String status, Integer active);

	List<Signature> findAllByActive(int i);

//	boolean existsByPa(String pa);

//	List<Signature> findAllByPaContainingIgnoreCaseAndStatusAndActive(String pa, String status, int i);

//	Signature findByPaAndActive(String pa, int i);

//	List<Signature> findAllByNameContainingIgnoreCaseAndStatusAndActive(String name, String approved, int i);

//	Signature findByNameOrPaAndStatusAndActive(String name, String pa, String approved, int i);
//
//	Signature findByNameAndStatusAndActive(String name, String approved, int i);
	
//	@Query(	" SELECT NEW com.softcafe.esignature.model.SignatureCount(S.signatureStatus, COUNT(S)) FROM Signature S "
//			+ " WHERE S.active = 1 AND S.status = 'APPROVED' AND S.isMainSignature = 1" 
//			+ " GROUP BY S.signatureStatus ")
	
	@Query("SELECT NEW com.softcafe.esignature.model.SignatureCount(S.signatureStatus, COUNT(S)) FROM Signature S "
			+ " JOIN Signatory ST on ST.signatoryId = S.signatoryId AND ST.status = 'APPROVED'"
			+ " AND ST.active = 1 "
			+ " JOIN Institution I on I.institutionId = ST.institutionId AND INSTR(UPPER(I.institutionName), 'PRIME BANK', 1, 1) = 1 "
			+ " AND I.active = 1 "
			+ " WHERE S.active = 1 AND S.status = 'APPROVED' AND S.isMainSignature = 1 "
			+ " GROUP BY S.signatureStatus ")
	List<SignatureCount> countByActiveAndGroupByStatus();

	Signature findBySignatureIdAndActive(Long signatureId, int i);

	Signature findBySignatoryIdAndActive(Long signatoryId, int i);

	List<Signature> findAllBySignatoryIdAndActive(Long signatoryId, int i);

	List<Signature> findAllBySignatoryIdAndIsMainSignatureAndActive(Long signatoryId, int i, int j);
}
