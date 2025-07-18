package com.schoolbus.schoolbusapp.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;
    private String message;
    private LocalDateTime timestamp;
    private boolean read;
    private boolean urgent;
    private String adminId;

    public Notification(String message, LocalDateTime now, boolean b, boolean urgent, String adminId) {
    }
}
