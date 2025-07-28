package com.softcafe.core.ws.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.softcafe.core.ws.model.ChatMessage;
import com.softcafe.core.ws.repo.ChatMessageRepo;

@Controller
public class WebSocketController {
	private static final Logger log = LoggerFactory.getLogger(WebSocketController.class);
	
	private Gson gson;
	{
		gson = new Gson();
	}

	@Autowired
	private SimpMessageSendingOperations messagingTemplate;
	@Autowired
	private ChatMessageRepo chatMessageRepo;

	@MessageMapping("/message")
	public void processMessageFromClient(@Payload ChatMessage cm) throws Exception {
		log.info("sender/rcvr : [{}]/[{}], msg[{}]", cm.getSenderId(), cm.getReceiverId(), cm.getMessage());
		cm = chatMessageRepo.save(cm);
		messagingTemplate.convertAndSend("/queue/reply/" + cm.getSubscribeUrl(), gson.toJson(cm));
		cm.setDelevered(1);
		cm.setMessageVer(cm.getMessageVer() + 1);
		chatMessageRepo.save(cm);
		
	}
}
