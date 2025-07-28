package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.softcafe.esignature.entity.PasswordList;

public interface PasswordListRepo extends JpaRepository<PasswordList, Long> {

	// getting 3 rows with orders

	@Query(value = " SELECT p.* FROM T_PASSWORD_LIST p "
			+ " WHERE p.ID_USER_KEY = ?1 "
			+ " ORDER BY p.ID_PASSWORD_LIST_KEY DESC "
			+ " FETCH FIRST 3 ROWS ONLY", nativeQuery = true)
	List<PasswordList> find3PasswordList(Long userId);

	PasswordList findFirstByUserIdAndActive(Long userId, int i, Sort sort);

}
