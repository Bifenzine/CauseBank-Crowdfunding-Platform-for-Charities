package causebankgrp.causebank.Enums;

public enum CauseStatus {
    DRAFT,      // Initial state when creating
    ACTIVE,     // Published and accepting donations
    PAUSED,     // Temporarily stopped
    COMPLETED,  // Reached goal
    CANCELLED,  // Terminated before completion
    DELETED    // For Soft deletion
}