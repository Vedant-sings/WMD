package com.campusconnect.events.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class EventRequestDTO {

    @NotBlank(message = "Title is required and cannot be blank")
    @Size(max = 120, message = "Title must not exceed 120 characters")
    private String title;

    @NotBlank(message = "Category is required and cannot be blank")
    @Size(max = 60, message = "Category must not exceed 60 characters")
    private String category;

    @NotBlank(message = "Date is required (e.g. YYYY-MM-DD)")
    private String date;

    @NotBlank(message = "Time is required (e.g. 10:00 AM)")
    private String time;

    @NotBlank(message = "Venue is required and cannot be blank")
    @Size(max = 150, message = "Venue must not exceed 150 characters")
    private String venue;

    @NotBlank(message = "Organizer is required and cannot be blank")
    @Size(max = 120, message = "Organizer must not exceed 120 characters")
    private String organizer;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be greater than zero")
    private Integer capacity;

    @NotNull(message = "Registered count is required")
    @Min(value = 0, message = "Registered count cannot be negative")
    private Integer registeredCount;

    @NotBlank(message = "Description is required and cannot be blank")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    public EventRequestDTO() {
    }

    public EventRequestDTO(String title, String category, String date, String time,
                           String venue, String organizer, Integer capacity,
                           Integer registeredCount, String description) {
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
}
