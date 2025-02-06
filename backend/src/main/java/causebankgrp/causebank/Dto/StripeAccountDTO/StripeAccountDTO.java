package causebankgrp.causebank.Dto.StripeAccountDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StripeAccountDTO {
    private String id;
    private String email;
    private BalanceData balance;
    private BusinessProfile businessProfile;
    private PayoutSchedule payoutSchedule;
    private List<Transaction> recentTransactions;

    @Data
    public static class BalanceData {
        private Long available;
        private long instantAvailable;
        private Long pending;
        private String currency;
    }

    @Data
    public static class BusinessProfile {
        private String name;
        private String businessType;
        private String url;
    }

    @Data
    public static class PayoutSchedule {
        private String interval;
        private Integer delayDays;
    }

    @Data
    public static class Transaction {
        private String id;
        private String type;
        private Long amount;
        private String currency;
        private String status;
        private Long created;
        private String description;
    }
}

