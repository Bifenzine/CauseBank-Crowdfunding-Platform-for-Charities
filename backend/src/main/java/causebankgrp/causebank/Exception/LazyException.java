package causebankgrp.causebank.Exception;

import org.hibernate.LazyInitializationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class LazyException {
    @ExceptionHandler(LazyInitializationException.class)
    public ResponseEntity<String> handleLazyInitialization(LazyInitializationException e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to load related data");
    }
}
