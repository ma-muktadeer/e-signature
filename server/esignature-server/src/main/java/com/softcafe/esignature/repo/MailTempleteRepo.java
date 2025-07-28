package com.softcafe.esignature.repo;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.MailTemplete;
import com.softcafe.esignature.model.MailType;

public interface MailTempleteRepo extends JpaRepository<MailTemplete, Long> {

	List<MailTemplete> findAllByActive(int i, Sort sort);

	MailTemplete findAllByMailTempIdAndActive(Long mailTempId, int i);

	MailTemplete findAllByGroupAndTypeAndActive(String group, String type, int i);

	Boolean existsByGroupAndTypeAndActive(String group, String type, int i);

	MailTemplete findAllByGroupAndTypeAndStatusAndActive(String group, String type, String status, int i);

	List<MailTemplete> findAllByGroupAndTypeInAndStatusAndActive(String group, List<String> mailTypeList,
			String status, int i);

}
