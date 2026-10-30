package com.campusconnect.events.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class EventCapacityException extends RuntimeException {
    public EventCapacityException(String message) {
        super(message);
    }
}
