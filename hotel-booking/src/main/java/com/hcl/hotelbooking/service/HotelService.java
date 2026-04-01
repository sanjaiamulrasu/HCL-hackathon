package com.hcl.hotelbooking.service;

import com.hcl.hotelbooking.dto.HotelDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface HotelService {
    HotelDto addHotel(HotelDto hotelDto);
    HotelDto updateHotel(Long id, HotelDto hotelDto);
    void deleteHotel(Long id);
    HotelDto getHotelById(Long id);
    Page<HotelDto> getAllHotels(Pageable pageable);
    List<HotelDto> searchHotels(String location, LocalDate checkIn, LocalDate checkOut);
}
