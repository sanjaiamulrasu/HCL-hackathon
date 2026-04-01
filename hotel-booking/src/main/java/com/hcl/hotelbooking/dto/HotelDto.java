package com.hcl.hotelbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HotelDto {
    private Long id;

    @NotBlank(message = "Hotel name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    private String description;
    
    @NotNull(message = "Rating is required")
    private Double rating;
}
