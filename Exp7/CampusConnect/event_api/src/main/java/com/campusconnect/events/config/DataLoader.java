package com.campusconnect.events.config;

import com.campusconnect.events.model.Event;
import com.campusconnect.events.repository.EventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataLoader {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    @Bean
    CommandLineRunner initDatabase(EventRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                List<Event> sampleEvents = List.of(
                        new Event(
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
                        new Event(
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
                        new Event(
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
                        new Event(
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
                        new Event(
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

                repository.saveAll(sampleEvents);
                log.info("Initialized {} sample CampusConnect events in H2 database.", sampleEvents.size());
            }
        };
    }
}
