package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.Models.Message;
import com.schoolbus.schoolbusapp.DTO.MessageRequest;
import com.schoolbus.schoolbusapp.Models.Parent;
import com.schoolbus.schoolbusapp.Repositories.MessageRepository;
import com.schoolbus.schoolbusapp.Services.MessageService;
import com.schoolbus.schoolbusapp.Services.ParentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private ParentService parentService;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/broadcast/parents")
    public ResponseEntity<Message> broadcastToParents(@RequestBody MessageRequest request, Authentication auth) {
        String senderId = auth.getName();
        return ResponseEntity.ok(messageService.sendBroadcastMessage(senderId, request.getContent(), "Parent"));
    }

    @PostMapping("/broadcast/conductors")
    public ResponseEntity<Message> broadcastToConductors(@RequestBody MessageRequest request, Authentication auth) {
        String senderId = auth.getName();
        return ResponseEntity.ok(messageService.sendBroadcastMessage(senderId, request.getContent(), "Conductor"));
    }

    @PostMapping("/individual")
    public ResponseEntity<Message> individualMessage(@RequestBody MessageRequest request, Authentication auth) {
        String senderId = auth.getName();
        return ResponseEntity.ok(
                messageService.sendIndividualMessage(senderId, request.getRecipientId(), request.getContent())
        );
    }

    @GetMapping("/sent")
    public ResponseEntity<List<Message>> getSentMessages(Authentication auth) {
        return ResponseEntity.ok(messageService.getSentMessages(auth.getName()));
    }

    @MessageMapping("/send-to-admin")
    public void conductorToAdmin(@Payload Message message, Authentication authentication) {
        String senderId = authentication.getName();
        message.setSenderId(senderId);
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/admin", message);
    }

    @GetMapping("/parent/broadcasts")
    public ResponseEntity<List<Message>> getBroadcastMessagesForParent(@AuthenticationPrincipal UserDetails userDetails) {
        String identifier = userDetails.getUsername();
        Parent parent = parentService.getLoggedInParent(identifier);
        List<Message> messages = messageService.getBroadcastMessagesForRole("Parent");
        return ResponseEntity.ok(messages);
    }
}
