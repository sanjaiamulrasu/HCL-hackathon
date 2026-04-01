package com.hcl.hotelbooking.config;

import com.hcl.hotelbooking.entity.Hotel;
import com.hcl.hotelbooking.entity.Role;
import com.hcl.hotelbooking.entity.Room;
import com.hcl.hotelbooking.entity.RoomType;
import com.hcl.hotelbooking.entity.User;
import com.hcl.hotelbooking.repository.HotelRepository;
import com.hcl.hotelbooking.repository.RoomRepository;
import com.hcl.hotelbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed users if empty
        if (userRepository.count() == 0) {
            System.out.println("Seeding temporary users...");

            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@hotel.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .isVerified(true)
                    .build();

            User manager = User.builder()
                    .name("Hotel Manager")
                    .email("manager@hotel.com")
                    .password(passwordEncoder.encode("manager123"))
                    .role(Role.HOTEL_MANAGER)
                    .isVerified(true)
                    .build();

            User user = User.builder()
                    .name("Regular User")
                    .email("user@hotel.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .isVerified(true)
                    .build();

            userRepository.saveAll(List.of(admin, manager, user));
            System.out.println("Users seeded successfully!");
        }

        // Seed only if the database is currently empty
        if (hotelRepository.count() == 0) {
            System.out.println("Seeding temporary hotels and rooms...");

            Hotel hotel1 = Hotel.builder()
                    .name("HCL Grand Hotel")
                    .location("New York")
                    .description("A luxurious 5-star hotel in the heart of the city.")
                    .rating(4.8)
                    .build();

            Hotel hotel2 = Hotel.builder()
                    .name("Ocean Breeze Resort")
                    .location("Miami")
                    .description("Beautiful beachfront resort with stunning ocean views.")
                    .rating(4.5)
                    .build();

            hotelRepository.saveAll(List.of(hotel1, hotel2));

            Room h1Room1 = Room.builder()
                    .roomNumber("101")
                    .type(RoomType.SINGLE)
                    .price(150.0)
                    .isAvailable(true)
                    .hotel(hotel1)
                    .build();

            Room h1Room2 = Room.builder()
                    .roomNumber("102")
                    .type(RoomType.DOUBLE)
                    .price(250.0)
                    .isAvailable(true)
                    .hotel(hotel1)
                    .build();

            Room h1Room3 = Room.builder()
                    .roomNumber("201")
                    .type(RoomType.SUITE)
                    .price(500.0)
                    .isAvailable(true)
                    .hotel(hotel1)
                    .build();

            Room h2Room1 = Room.builder()
                    .roomNumber("10A")
                    .type(RoomType.DOUBLE)
                    .price(200.0)
                    .isAvailable(true)
                    .hotel(hotel2)
                    .build();

            Room h2Room2 = Room.builder()
                    .roomNumber("10B")
                    .type(RoomType.DELUXE)
                    .price(350.0)
                    .isAvailable(true)
                    .hotel(hotel2)
                    .build();

            roomRepository.saveAll(List.of(h1Room1, h1Room2, h1Room3, h2Room1, h2Room2));
            
            System.out.println("Seeding completed!");
        }
    }
}
