package com.campusconnect.events.service;

import com.campusconnect.events.dto.EventPatchDTO;
import com.campusconnect.events.dto.EventRequestDTO;
import com.campusconnect.events.exception.EventCapacityException;
import com.campusconnect.events.exception.InvalidEventDataException;
import com.campusconnect.events.exception.ResourceNotFoundException;
import com.campusconnect.events.model.Event;
import com.campusconnect.events.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event with ID " + id + " not found"));
    }

    public Event createEvent(EventRequestDTO dto) {
        validateCapacityRules(dto.getCapacity(), dto.getRegisteredCount());

        Event event = new Event();
        mapDtoToEntity(dto, event);
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, EventRequestDTO dto) {
        Event event = getEventById(id);
        validateCapacityRules(dto.getCapacity(), dto.getRegisteredCount());

        mapDtoToEntity(dto, event);
        return eventRepository.save(event);
    }

    public Event patchEvent(Long id, EventPatchDTO patchDto) {
        Event event = getEventById(id);

        Integer newCapacity = patchDto.getCapacity() != null ? patchDto.getCapacity() : event.getCapacity();
        Integer newRegistered = patchDto.getRegisteredCount() != null ? patchDto.getRegisteredCount() : event.getRegisteredCount();

        validateCapacityRules(newCapacity, newRegistered);

        if (patchDto.getCategory() != null) {
            if (patchDto.getCategory().trim().isEmpty()) {
                throw new InvalidEventDataException("Category cannot be blank when updating");
            }
            event.setCategory(patchDto.getCategory().trim());
        }

        if (patchDto.getDate() != null) {
            if (patchDto.getDate().trim().isEmpty()) {
                throw new InvalidEventDataException("Date cannot be blank when updating");
            }
            event.setDate(patchDto.getDate().trim());
        }

        if (patchDto.getCapacity() != null) {
            event.setCapacity(patchDto.getCapacity());
        }

        if (patchDto.getRegisteredCount() != null) {
            event.setRegisteredCount(patchDto.getRegisteredCount());
        }

        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }

    public Event registerAttendee(Long id) {
        Event event = getEventById(id);

        if (event.getRegisteredCount() >= event.getCapacity()) {
            throw new EventCapacityException(String.format(
                    "Cannot register for event '%s' (ID %d): capacity is full (%d/%d registered)",
                    event.getTitle(), id, event.getRegisteredCount(), event.getCapacity()
            ));
        }

        event.setRegisteredCount(event.getRegisteredCount() + 1);
        return eventRepository.save(event);
    }

    private void validateCapacityRules(Integer capacity, Integer registeredCount) {
        if (capacity == null || capacity <= 0) {
            throw new InvalidEventDataException("Capacity must be greater than zero");
        }
        if (registeredCount == null || registeredCount < 0) {
            throw new InvalidEventDataException("Registered count cannot be negative");
        }
        if (registeredCount > capacity) {
            throw new InvalidEventDataException(String.format(
                    "Registered count (%d) cannot exceed total capacity (%d)",
                    registeredCount, capacity
            ));
        }
    }

    private void mapDtoToEntity(EventRequestDTO dto, Event event) {
        event.setTitle(dto.getTitle().trim());
        event.setCategory(dto.getCategory().trim());
        event.setDate(dto.getDate().trim());
        event.setTime(dto.getTime().trim());
        event.setVenue(dto.getVenue().trim());
        event.setOrganizer(dto.getOrganizer().trim());
        event.setCapacity(dto.getCapacity());
        event.setRegisteredCount(dto.getRegisteredCount());
        event.setDescription(dto.getDescription().trim());
    }
}
