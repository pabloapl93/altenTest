package com.example.alten.controller;

import com.example.alten.DTO.ReservationDTO;
import com.example.alten.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservation")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/getDataUser/{cellphone}")
    @ResponseBody
    public List<ReservationDTO> getDataUser(@PathVariable(value = "cellphone") String cellphone){
        return reservationService.getDataUser(cellphone);
    }

    @PutMapping
    public ReservationDTO updateReservation(@RequestBody ReservationDTO reservation){
        return reservationService.updateReservation(reservation);
    }

    @PutMapping("/cancel")
    public ReservationDTO cancelReservation(@RequestBody ReservationDTO reservation){
        return reservationService.cancelReservation(reservation);
    }

    @PostMapping
    @ResponseBody
    public ReservationDTO saveReservation(@RequestBody ReservationDTO reservationDTO){
        return reservationService.saveReservation(reservationDTO);
    }

    @GetMapping("/getAllActiveDates/{id}")
    @ResponseBody
    public List<String> getAllActiveDates(@PathVariable(value = "id") String id){
        return reservationService.getAllActiveDates(id);
    }

}