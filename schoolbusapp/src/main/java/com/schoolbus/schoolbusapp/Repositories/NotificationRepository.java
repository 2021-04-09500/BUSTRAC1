package com.schoolbus.schoolbusapp.Repositories;

import com.schoolbus.schoolbusapp.Models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification,String> {
    List<Notification> findByAdminId(String adminId);

}
