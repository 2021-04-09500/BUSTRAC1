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
@Document(collection = "mdvr")
public class MDVR {
    @Id
    private String id;
    private String busId;
    private String fileName;
    private String filePath;
    private long fileSize;
    private LocalDateTime createdAt;
}
