package com.campusconnect.events.controller;

import com.campusconnect.events.dto.EventPatchDTO;
import com.campusconnect.events.dto.EventRequestDTO;
import com.campusconnect.events.model.Event;
import com.campusconnect.events.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * GET /api/events — retrieve all events
     */
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    /**
     * GET /api/events/{id} — retrieve one event
     */
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    /**
     * POST /api/events — create an event
     */
    @PostMapping
    public ResponseEntity<Event> createEvent(@Valid @RequestBody EventRequestDTO requestDTO) {
        Event createdEvent = eventService.createEvent(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    /**
     * PUT /api/events/{id} — fully update an event
     */
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id,
                                             @Valid @RequestBody EventRequestDTO requestDTO) {
        Event updatedEvent = eventService.updateEvent(id, requestDTO);
        return ResponseEntity.ok(updatedEvent);
    }

    /**
     * PATCH /api/events/{id} — partially update category, date, capacity, or registeredCount
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Event> patchEvent(@PathVariable Long id,
                                           @Valid @RequestBody EventPatchDTO patchDTO) {
        Event patchedEvent = eventService.patchEvent(id, patchDTO);
        return ResponseEntity.ok(patchedEvent);
    }

    /**
     * DELETE /api/events/{id} — delete an event
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/events/{id}/register — increment registeredCount only if capacity is available
     */
    @PostMapping("/{id}/register")
    public ResponseEntity<Event> registerAttendee(@PathVariable Long id) {
        Event event = eventService.registerAttendee(id);
        return ResponseEntity.ok(event);
    }
}
