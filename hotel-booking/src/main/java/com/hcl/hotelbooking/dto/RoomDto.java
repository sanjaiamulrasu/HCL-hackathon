package com.hcl.hotelbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoomDto {
    private Long id;

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotBlank(message = "Room type is required")
    private String type;

    @NotNull(message = "Price is required")
    private Double price;

    private boolean isAvailable;
    
    @NotNull(message = "Hotel ID is required")
    private Long hotelId;
}
