package com.example.alten.service;

import com.example.alten.DTO.ReservationDTO;
import com.example.alten.entity.Reservation;
import com.example.alten.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(Long id) {

        /*Optional<Reservation> portfolio = reservationRepository.findById(id);

        if(portfolio.isPresent()){
            return ResponseEntity.ok(portfolio);
        } else {
            return ResponseEntity.notFound().build();
        }*/
        return ResponseEntity.notFound().build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllActiveDates(String id) {

        Query query = new Query();
        List<String> listActiveDates = new ArrayList<>();
        query.addCriteria(Criteria.where("state").is(true));
        if(!id.equals("0")){
            query.addCriteria(Criteria.where("id")
                    .ne(id));
        }
        List<Reservation> listReservation = mongoTemplate.find(query, Reservation.class);
        listReservation.stream().forEach((row)->{
            listActiveDates.addAll(getBetweenDays(row.getStartDate(),row.getEndDate()));
        });
        return listActiveDates;
    }

    @Override
    @Transactional
    public ReservationDTO updateReservation(ReservationDTO reservationDTO){
        Optional<Reservation> reservation = reservationRepository.findById(reservationDTO.getId());
        reservationDTO.setNumberDay(getBetweenDays(reservationDTO.getStartDate(),reservationDTO.getEndDate()).size());
        return entityToDTO(reservationRepository.save(DTOToEntity(reservationDTO, reservation.get())));
    }

    @Override
    @Transactional
    public ReservationDTO cancelReservation(ReservationDTO reservationDTO){
        Optional<Reservation> reservation = reservationRepository.findById(reservationDTO.getId());
        reservation.get().setState(Boolean.FALSE);
        return entityToDTO(reservationRepository.save(reservation.get()));
    }

    @Override
    @Transactional
    public ReservationDTO saveReservation(ReservationDTO reservationDTO){
        Reservation reservation = new Reservation();
        reservationDTO.setNumberDay(getBetweenDays(reservationDTO.getStartDate(),reservationDTO.getEndDate()).size());
        reservationRepository.save(DTOToEntity(reservationDTO, reservation));

        return reservationDTO;
    }

    @Override
    @Transactional
    public List<ReservationDTO> getDataUser(String cellphone){
        Query query = new Query();
        List<ReservationDTO> listReservationDTO = new ArrayList<>();
        query.addCriteria(Criteria.where("cellphone").is(cellphone));
        List<Reservation> listReservation = mongoTemplate.find(query, Reservation.class);
        listReservation.stream().forEach((row)->{
            listReservationDTO.add(entityToDTO(row));
        });

        return listReservationDTO;
    }

    private ReservationDTO entityToDTO(Reservation reservation){
        ReservationDTO reservationDTO = new ReservationDTO();
        reservationDTO.setCellphone(reservation.getCellphone());
        reservationDTO.setName(reservation.getName());
        reservationDTO.setStartDate(reservation.getStartDate());
        reservationDTO.setEndDate(reservation.getEndDate());
        reservationDTO.setState(reservation.getState());
        reservationDTO.setNumberDay(reservation.getNumberDay());
        reservationDTO.setId(reservation.getId());
        return reservationDTO;
    }

    private Reservation DTOToEntity (ReservationDTO reservationDTO, Reservation reservation){
        reservation.setCellphone(reservationDTO.getCellphone());
        reservation.setName(reservationDTO.getName());
        reservation.setStartDate(reservationDTO.getStartDate());
        reservation.setEndDate(reservationDTO.getEndDate());
        reservation.setState(reservationDTO.getState());
        reservation.setNumberDay(reservationDTO.getNumberDay());

        return reservation;
    }

    public static List<String> getBetweenDays(Date start, Date end) {
        List<String> result = new ArrayList<String>();

        Calendar tempStart = Calendar.getInstance();
        tempStart.setTime(start);

        tempStart.add(Calendar.DAY_OF_YEAR, 1);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT+12"));
        Calendar tempEnd = Calendar.getInstance();
        tempEnd.setTime(end);
        tempEnd.add(Calendar.DAY_OF_YEAR, 1);
        result.add(sdf.format(start));
        while (tempStart.before(tempEnd)) {
            result.add(sdf.format(tempStart.getTime()));
            tempStart.add(Calendar.DAY_OF_YEAR, 1);
        }
        return result;
    }

    }
