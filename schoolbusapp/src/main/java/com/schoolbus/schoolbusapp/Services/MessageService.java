package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.Models.Message;
import com.schoolbus.schoolbusapp.Models.User;
import com.schoolbus.schoolbusapp.Repositories.ConductorRepository;
import com.schoolbus.schoolbusapp.Repositories.MessageRepository;
import com.schoolbus.schoolbusapp.Repositories.ParentRepository;
import com.schoolbus.schoolbusapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private ParentRepository parentRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Message sendBroadcastMessage(String senderId, String content, String role) {
        List<? extends User> recipients;

        if ("PARENT".equalsIgnoreCase(role)) {
            recipients = parentRepository.findAll();
        } else if ("CONDUCTOR".equalsIgnoreCase(role)) {
            recipients = conductorRepository.findAll();
        } else {
            throw new RuntimeException("Invalid role: " + role);
        }

        if (recipients.isEmpty()) {
            throw new RuntimeException("No recipients found for role: " + role);
        }

        List<String> recipientIds = recipients.stream()
                .map(User::getId)
                .collect(Collectors.toList());

        Message message = new Message(
                Message.MessageType.BROADCAST,
                senderId,
                null,
                content,
                LocalDateTime.now()
        );
        message.setRecipients(recipientIds);

        message = messageRepository.save(message);

        messagingTemplate.convertAndSend("/topic/" + role.toLowerCase() + "s", message);
        return message;
    }

    public Message sendIndividualMessage(String senderId, String recipientId, String content) {
        User recipient = conductorRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        Message message = new Message(
                Message.MessageType.INDIVIDUAL,
                senderId,
                recipientId,
                content,
                LocalDateTime.now()
        );
        message.setRecipientName(recipient.getName());
        message = messageRepository.save(message);

        messagingTemplate.convertAndSendToUser(recipientId, "/queue/messages", message);
        return message;
    }

    public List<Message> getSentMessages(String senderId) {
        return messageRepository.findBySenderId(senderId);
    }

    public List<Message> getBroadcastMessagesForRole(String role) {
        List<String> userIds;

        if ("PARENT".equalsIgnoreCase(role)) {
            userIds = parentRepository.findAll().stream()
                    .map(User::getId)
                    .collect(Collectors.toList());
        } else if ("CONDUCTOR".equalsIgnoreCase(role)) {
            userIds = conductorRepository.findAll().stream()
                    .map(User::getId)
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException("Invalid role");
        }

        List<Message> allBroadcasts = messageRepository.findByType(Message.MessageType.BROADCAST);

        return allBroadcasts.stream()
                .filter(msg -> msg.getRecipients() == null || msg.getRecipients().isEmpty() ||
                        msg.getRecipients().stream().anyMatch(userIds::contains))
                .collect(Collectors.toList());
    }
}
