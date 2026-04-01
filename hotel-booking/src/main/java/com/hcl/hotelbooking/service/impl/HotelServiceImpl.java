package com.hcl.hotelbooking.service.impl;

import com.hcl.hotelbooking.dto.HotelDto;
import com.hcl.hotelbooking.entity.Hotel;
import com.hcl.hotelbooking.exception.ResourceNotFoundException;
import com.hcl.hotelbooking.repository.HotelRepository;
import com.hcl.hotelbooking.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;

    @Override
    public HotelDto addHotel(HotelDto hotelDto) {
        Hotel hotel = mapToEntity(hotelDto);
        Hotel savedHotel = hotelRepository.save(hotel);
        return mapToDto(savedHotel);
    }

    @Override
    public HotelDto updateHotel(Long id, HotelDto hotelDto) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        hotel.setName(hotelDto.getName());
        hotel.setLocation(hotelDto.getLocation());
        hotel.setDescription(hotelDto.getDescription());
        hotel.setRating(hotelDto.getRating());

        Hotel updatedHotel = hotelRepository.save(hotel);
        return mapToDto(updatedHotel);
    }

    @Override
    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        hotelRepository.delete(hotel);
    }

    @Override
    public HotelDto getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        return mapToDto(hotel);
    }

    @Override
    public Page<HotelDto> getAllHotels(Pageable pageable) {
        return hotelRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public List<HotelDto> searchHotels(String location, LocalDate checkIn, LocalDate checkOut) {
        // Simple search by location
        List<Hotel> hotels;
        if (checkIn != null && checkOut != null) {
            hotels = hotelRepository.findAvailableHotelsByLocation(location);
        } else {
            hotels = hotelRepository.findByLocationContainingIgnoreCase(location);
        }
        return hotels.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private Hotel mapToEntity(HotelDto dto) {
        return Hotel.builder()
                .name(dto.getName())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .rating(dto.getRating())
                .build();
    }

    private HotelDto mapToDto(Hotel entity) {
        HotelDto dto = new HotelDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setLocation(entity.getLocation());
        dto.setDescription(entity.getDescription());
        dto.setRating(entity.getRating());
        return dto;
    }
}
