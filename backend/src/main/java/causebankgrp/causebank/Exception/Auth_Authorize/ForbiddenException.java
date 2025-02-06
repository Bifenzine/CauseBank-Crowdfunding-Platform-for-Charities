package causebankgrp.causebank.Exception.Auth_Authorize;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
