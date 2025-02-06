package causebankgrp.causebank.Tasks.Causes;

import causebankgrp.causebank.Entity.Cause;
import causebankgrp.causebank.Enums.CauseStatus;
import causebankgrp.causebank.Repository.CauseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CauseStatusUpdateService {

    private final CauseRepository causeRepository;

    @Scheduled(fixedRate = 60000) // Runs every minute
    @Transactional
    public void updateCauseStatuses() {
           nedDateTime now = ZonedDateTime.now();
        List<Cause> expiredCauses = causeRepository.findByEndDateBeforeAndStatusNot(now);


           r (Cause cause : expiredCauses) {
            cause.setStatus(CauseStatus.COMPLETED);
            cause.setIsFeatured(false);
            causeRepository.save(cause);
        }
    }
}
