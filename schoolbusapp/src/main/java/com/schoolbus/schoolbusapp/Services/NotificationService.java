package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.Models.Notification;
import com.schoolbus.schoolbusapp.Repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getNotifications(String adminId) {
        return notificationRepository.findByAdminId(adminId);
    }

    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }


    public Notification createNotification(String message, boolean urgent, String adminId) {
        Notification notification = new Notification(message, LocalDateTime.now(), false, urgent, adminId);
        return notificationRepository.save(notification);
    }
}