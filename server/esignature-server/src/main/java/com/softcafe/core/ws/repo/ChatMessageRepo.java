package com.softcafe.core.ws.repo;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import com.softcafe.core.ws.model.ChatMessage;

public interface ChatMessageRepo extends CrudRepository<ChatMessage, Long>, JpaSpecificationExecutor<ChatMessage>, QueryByExampleExecutor<ChatMessage>{
	
}
