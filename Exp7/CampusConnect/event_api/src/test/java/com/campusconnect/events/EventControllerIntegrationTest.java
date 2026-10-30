package com.campusconnect.events;

import com.campusconnect.events.dto.EventPatchDTO;
import com.campusconnect.events.dto.EventRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class EventControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private com.campusconnect.events.repository.EventRepository eventRepository;

    @BeforeEach
    void resetDatabase() {
        eventRepository.deleteAll();
        List<com.campusconnect.events.model.Event> sampleEvents = List.of(
                new com.campusconnect.events.model.Event(
                        "National Campus Hackathon 2026",
                        "Hackathon",
                        "2026-10-15",
                        "09:00 AM",
                        "Innovation & Tech Lab, Block C",
                        "ACM Student Chapter",
                        120,
                        95,
                        "36-hour hackathon focused on full-stack web applications, AI automation, and cloud microservices."
                ),
                new com.campusconnect.events.model.Event(
                        "Guest Lecture: Enterprise Spring Boot & Cloud",
                        "Academic",
                        "2026-10-18",
                        "02:00 PM",
                        "Main Auditorium",
                        "Department of Information Technology",
                        250,
                        180,
                        "Industry experts discuss enterprise Java architecture, Spring Boot 3 microservices, and reactive APIs."
                ),
                new com.campusconnect.events.model.Event(
                        "Campus Cultural Fiesta - Tarang 2026",
                        "Cultural",
                        "2026-11-05",
                        "05:00 PM",
                        "Open Air Amphitheatre",
                        "Student Cultural Council",
                        500,
                        320,
                        "Annual inter-college cultural festival featuring music performances, drama, dance, and art exhibits."
                ),
                new com.campusconnect.events.model.Event(
                        "Workshop: Modern React & Full-Stack Synergy",
                        "Workshop",
                        "2026-10-22",
                        "10:30 AM",
                        "Computer Center Lab 2",
                        "Web Development Club",
                        60,
                        60,
                        "Hands-on session integrating React 18 frontend with Spring Boot REST APIs and PostgreSQL/H2 backends."
                ),
                new com.campusconnect.events.model.Event(
                        "Annual Inter-Department Sports Meet",
                        "Sports",
                        "2026-11-12",
                        "08:00 AM",
                        "University Sports Arena",
                        "Campus Sports Committee",
                        300,
                        145,
                        "Track and field, badminton, football, and volleyball tournaments across all campus branches."
                )
        );
        eventRepository.saveAll(sampleEvents);
    }

    @Test
    @DisplayName("GET /api/events should return list of initial sample events with 200 OK")
    void testGetAllEvents() throws Exception {
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$[0].title", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/events/{id} should return specific event when found (200 OK)")
    void testGetEventById_Found() throws Exception {
        com.campusconnect.events.model.Event firstEvent = eventRepository.findAll().get(0);
        Long id = firstEvent.getId();

        mockMvc.perform(get("/api/events/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(id.intValue())))
                .andExpect(jsonPath("$.title", is(firstEvent.getTitle())));
    }

    @Test
    @DisplayName("GET /api/events/{id} should return 404 NOT FOUND when event does not exist")
    void testGetEventById_NotFound() throws Exception {
        mockMvc.perform(get("/api/events/9999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("Event with ID 9999 not found")));
    }

    @Test
    @DisplayName("POST /api/events should create a new event with 201 CREATED")
    void testCreateEvent_Success() throws Exception {
        EventRequestDTO newEvent = new EventRequestDTO(
                "AI & Robotics Symposium 2026",
                "Technical",
                "2026-11-20",
                "11:00 AM",
                "Robotics Arena, Hall 3",
                "Robotics Society",
                80,
                25,
                "Showcase of autonomous robotics and ML projects from campus teams."
        );

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newEvent)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is("AI & Robotics Symposium 2026")))
                .andExpect(jsonPath("$.capacity", is(80)))
                .andExpect(jsonPath("$.registeredCount", is(25)));
    }

    @Test
    @DisplayName("POST /api/events should fail with 400 BAD REQUEST when capacity <= 0")
    void testCreateEvent_InvalidCapacity() throws Exception {
        EventRequestDTO invalidEvent = new EventRequestDTO(
                "Invalid Capacity Event",
                "Technical",
                "2026-11-25",
                "10:00 AM",
                "Lab 1",
                "Tech Club",
                0, // invalid: capacity <= 0
                0,
                "Valid description"
        );

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidEvent)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.validationErrors.capacity", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/events should fail with 400 BAD REQUEST when registeredCount > capacity")
    void testCreateEvent_RegisteredExceedsCapacity() throws Exception {
        EventRequestDTO invalidEvent = new EventRequestDTO(
                "Overflow Event",
                "Technical",
                "2026-11-25",
                "10:00 AM",
                "Lab 1",
                "Tech Club",
                50,
                65, // invalid: registeredCount > capacity
                "Valid description"
        );

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidEvent)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("cannot exceed total capacity")));
    }

    @Test
    @DisplayName("PUT /api/events/{id} should update all event fields with 200 OK")
    void testUpdateEvent_Success() throws Exception {
        com.campusconnect.events.model.Event firstEvent = eventRepository.findAll().get(0);
        Long id = firstEvent.getId();

        EventRequestDTO updateDto = new EventRequestDTO(
                "National Campus Hackathon 2026 - Extended",
                "Hackathon",
                "2026-10-16",
                "09:30 AM",
                "Innovation & Tech Lab, Block C & D",
                "ACM Student Chapter & GDSC",
                150,
                110,
                "Updated 48-hour hackathon focused on full-stack web applications and AI microservices."
        );

        mockMvc.perform(put("/api/events/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(id.intValue())))
                .andExpect(jsonPath("$.title", is("National Campus Hackathon 2026 - Extended")))
                .andExpect(jsonPath("$.capacity", is(150)))
                .andExpect(jsonPath("$.registeredCount", is(110)));
    }

    @Test
    @DisplayName("PATCH /api/events/{id} should partially update category, date, capacity, or registeredCount")
    void testPatchEvent_Success() throws Exception {
        com.campusconnect.events.model.Event firstEvent = eventRepository.findAll().get(0);
        Long id = firstEvent.getId();

        EventPatchDTO patchDto = new EventPatchDTO(
                "Mega Hackathon",
                "2026-10-17",
                200,
                115
        );

        mockMvc.perform(patch("/api/events/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(patchDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(id.intValue())))
                .andExpect(jsonPath("$.category", is("Mega Hackathon")))
                .andExpect(jsonPath("$.date", is("2026-10-17")))
                .andExpect(jsonPath("$.capacity", is(200)))
                .andExpect(jsonPath("$.registeredCount", is(115)));
    }

    @Test
    @DisplayName("POST /api/events/{id}/register should increment registeredCount by 1 when capacity is available")
    void testRegisterAttendee_Success() throws Exception {
        com.campusconnect.events.model.Event availableEvent = eventRepository.findAll().stream()
                .filter(e -> e.getRegisteredCount() < e.getCapacity())
                .findFirst()
                .orElseThrow();
        Long id = availableEvent.getId();
        int expectedRegistered = availableEvent.getRegisteredCount() + 1;

        mockMvc.perform(post("/api/events/" + id + "/register"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(id.intValue())))
                .andExpect(jsonPath("$.registeredCount", is(expectedRegistered)));
    }

    @Test
    @DisplayName("POST /api/events/{id}/register should return 409 CONFLICT when capacity is full")
    void testRegisterAttendee_CapacityFull() throws Exception {
        com.campusconnect.events.model.Event fullEvent = eventRepository.findAll().stream()
                .filter(e -> e.getRegisteredCount().equals(e.getCapacity()))
                .findFirst()
                .orElseThrow();
        Long id = fullEvent.getId();

        mockMvc.perform(post("/api/events/" + id + "/register"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("Conflict")))
                .andExpect(jsonPath("$.message", containsString("capacity is full")));
    }

    @Test
    @DisplayName("DELETE /api/events/{id} should delete event and return 204 NO CONTENT")
    void testDeleteEvent_Success() throws Exception {
        com.campusconnect.events.model.Event lastEvent = eventRepository.findAll().get(eventRepository.findAll().size() - 1);
        Long id = lastEvent.getId();

        mockMvc.perform(delete("/api/events/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/events/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/events/{id} on non-existent event should return 404 NOT FOUND")
    void testDeleteEvent_NotFound() throws Exception {
        mockMvc.perform(delete("/api/events/9999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)));
    }
}
