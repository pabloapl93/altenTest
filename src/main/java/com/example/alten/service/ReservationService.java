package com.example.alten.service;

import com.example.alten.DTO.ReservationDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReservationService {

    public ResponseEntity<?> findById(Long id);

    public ReservationDTO updateReservation(ReservationDTO reservationDTO);

    public ReservationDTO cancelReservation(ReservationDTO reservationDTO);

    public List<ReservationDTO> getDataUser(String cellphone);

    public ReservationDTO saveReservation(ReservationDTO reservation);

    public List<String> getAllActiveDates(String id);
}
