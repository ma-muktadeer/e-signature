package com.softcafe.core.ws.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

@Component
public class WebSocketEventListener {

	private static final Logger log = LoggerFactory.getLogger(WebSocketEventListener.class);

	@Autowired
	private SimpMessageSendingOperations messagingTemplate;

	@EventListener
	public void handleWebSocketConnectListener(SessionConnectedEvent event) {

		StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
		headers.getSessionId();
		headers.getSessionAttributes();

		log.info("Received a new web socket connection. session id [{}]", headers.getSessionId());
	}

	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
		log.info("handleWebSocketDisconnectListener");
	}

	@EventListener
	public void onConnect(SessionConnectEvent event) {
		StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
		log.info("onConnect [{}]", headers.getSubscriptionId());
	}

	@EventListener
	public void onSubscribe(SessionSubscribeEvent event) {
		StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
		log.info("onSubscribe [{}]");
	}

	@EventListener
	public void onUnsubscribe(SessionUnsubscribeEvent event) {
		StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
		log.info("onUnsubscribe");
	}

}
