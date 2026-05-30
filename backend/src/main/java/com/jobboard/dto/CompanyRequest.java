package com.jobboard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyRequest {

    @NotBlank
    private String name;

    private String description;
    private String website;
    private String logoUrl;
    private String location;
}
