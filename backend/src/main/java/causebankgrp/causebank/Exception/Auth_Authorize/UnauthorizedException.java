package causebankgrp.causebank.Exception.Auth_Authorize;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}