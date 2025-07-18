package com.schoolbus.schoolbusapp.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "conductorRouteHistory")
public class ConductorRouteHistory {
    @Id
    private String id;
    private String conductorId;
    private String routeId;
    private Date startDate;
    private Date endDate;

}