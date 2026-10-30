package com.campusconnect.events.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 120, message = "Title must not exceed 120 characters")
    @Column(nullable = false, length = 120)
    private String title;

    @NotBlank(message = "Category is required")
    @Size(max = 60, message = "Category must not exceed 60 characters")
    @Column(nullable = false, length = 60)
    private String category;

    @NotBlank(message = "Date is required")
    @Column(nullable = false, length = 20)
    private String date;

    @NotBlank(message = "Time is required")
    @Column(nullable = false, length = 20)
    private String time;

    @NotBlank(message = "Venue is required")
    @Size(max = 150, message = "Venue must not exceed 150 characters")
    @Column(nullable = false, length = 150)
    private String venue;

    @NotBlank(message = "Organizer is required")
    @Size(max = 120, message = "Organizer must not exceed 120 characters")
    @Column(nullable = false, length = 120)
    private String organizer;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be greater than zero")
    @Column(nullable = false)
    private Integer capacity;

    @NotNull(message = "Registered count is required")
    @Min(value = 0, message = "Registered count cannot be negative")
    @Column(nullable = false)
    private Integer registeredCount;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(nullable = false, length = 1000)
    private String description;

    // Constructors
    public Event() {
    }

    public Event(Long id, String title, String category, String date, String time,
                 String venue, String organizer, Integer capacity, Integer registeredCount,
                 String description) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.date = date;
        this.time = time;
        this.venue = venue;
        this.organizer = organizer;
        this.capacity = capacity;
        this.registeredCount = registeredCount;
        this.description = description;
    }

    public Event(String title, String category, String date, String time,
                 String venue, String organizer, Integer capacity, Integer registeredCount,
                 String description) {
        this(null, title, category, date, time, venue, organizer, capacity, registeredCount, description);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getRegisteredCount() {
        return registeredCount;
    }

    public void setRegisteredCount(Integer registeredCount) {
        this.registeredCount = registeredCount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Event{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", category='" + category + '\'' +
                ", date='" + date + '\'' +
                ", time='" + time + '\'' +
                ", venue='" + venue + '\'' +
                ", organizer='" + organizer + '\'' +
                ", capacity=" + capacity +
                ", registeredCount=" + registeredCount +
                ", description='" + description + '\'' +
                '}';
    }
}
