package com.schoolbus.schoolbusapp.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "messages")
public class Message {

    @Id
    private String id;
    private MessageType type;
    private String senderId;
    private String recipientId;
    private String recipientName;
    private String content;
    private LocalDateTime timestamp;
    private List<String> recipients;


    public enum MessageType {
        BROADCAST, INDIVIDUAL
    }


    public Message(MessageType type, String senderId, String recipientId, String content, LocalDateTime timestamp) {
        this.type = type;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
        this.timestamp = timestamp;
    }
}