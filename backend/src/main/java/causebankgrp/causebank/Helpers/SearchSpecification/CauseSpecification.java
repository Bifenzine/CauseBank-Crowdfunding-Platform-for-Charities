package causebankgrp.causebank.Helpers.SearchSpecification;

import causebankgrp.causebank.Dto.CauseSearchCriteriaDTO.CauseSearchCriteria;
import causebankgrp.causebank.Entity.Cause;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;


@Component
public class CauseSpecification {
    public static Specification<Cause> withSearchCriteria(CauseSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Existing filters
            if (criteria.getSearchTerm() != null) {
                String searchTermLower = "%" + criteria.getSearchTerm().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), searchTermLower),
                        cb.like(cb.lower(root.get("description")), searchTermLower)
                ));
            }

            if (criteria.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            }

            if (criteria.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), criteria.getCategoryId()));
            }

            if (criteria.getOrganizationId() != null) {
                predicates.add(cb.equal(root.get("organization").get("id"), criteria.getOrganizationId()));
            }

            if (criteria.getCountry() != null) {
                predicates.add(cb.equal(root.get("causeCountry"), criteria.getCountry()));
            }

            if (criteria.getIsFeatured() != null) {
                predicates.add(cb.equal(root.get("isFeatured"), criteria.getIsFeatured()));
            }

            if (criteria.getMinAmount() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("currentAmount"), criteria.getMinAmount()));
            }

            if (criteria.getMaxAmount() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("currentAmount"), criteria.getMaxAmount()));
            }

            // Near goal filter
            if (criteria.getPercentageToGoal() != null) {
                Expression<Double> remainingPercentage = cb.quot(
                        cb.diff(root.get("goalAmount"), root.get("currentAmount")),
                        root.get("goalAmount")
                ).as(Double.class);
                predicates.add(cb.lessThanOrEqualTo(
                        cb.prod(remainingPercentage, 100.0),
                        criteria.getPercentageToGoal()
                ));
            }

            // Ending soon filter
            if (criteria.getDaysToEnd() != null) {
                ZonedDateTime now = ZonedDateTime.now();
                ZonedDateTime threshold = now.plusDays(criteria.getDaysToEnd());
                predicates.add(cb.and(
                        cb.greaterThanOrEqualTo(root.get("endDate"), now),
                        cb.lessThanOrEqualTo(root.get("endDate"), threshold)
                ));
            }

            // Date range filters
            if (criteria.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("endDate"), criteria.getStartDate()));
            }

            if (criteria.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("endDate"), criteria.getEndDate()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}


