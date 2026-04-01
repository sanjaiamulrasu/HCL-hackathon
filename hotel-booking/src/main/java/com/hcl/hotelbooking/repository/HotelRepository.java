package com.hcl.hotelbooking.repository;

import com.hcl.hotelbooking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByLocationContainingIgnoreCase(String location);

    @Query("SELECT DISTINCT h FROM Hotel h JOIN h.rooms r WHERE h.location LIKE %:location% AND r.isAvailable = true")
    List<Hotel> findAvailableHotelsByLocation(@Param("location") String location);
}
