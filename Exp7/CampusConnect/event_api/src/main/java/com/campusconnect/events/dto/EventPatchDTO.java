package com.campusconnect.events.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class EventPatchDTO {

    @Size(max = 60, message = "Category must not exceed 60 characters")
    private String category;

    private String date;

    @Min(value = 1, message = "Capacity must be greater than zero")
    private Integer capacity;

    @Min(value = 0, message = "Registered count cannot be negative")
    private Integer registeredCount;

    public EventPatchDTO() {
    }

    public EventPatchDTO(String category, String date, Integer capacity, Integer registeredCount) {
        this.category = category;
        this.date = date;
        this.capacity = capacity;
        this.registeredCount = registeredCount;
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
}
