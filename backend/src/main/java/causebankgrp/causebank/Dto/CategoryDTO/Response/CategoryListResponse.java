package causebankgrp.causebank.Dto.CategoryDTO.Response;

import java.util.List;
import lombok.Data;

@Data

public class CategoryListResponse {
    private List<CategoryResponse> categories;
    private long totalCount;
    private int pageNumber;
    private int pageSize;
}
