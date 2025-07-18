package com.schoolbus.schoolbusapp.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {
    private String recipientId;
    private String content;
}
