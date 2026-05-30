package com.jobboard.dto;

import com.jobboard.entity.ExperienceLevel;
import com.jobboard.entity.JobStatus;
import com.jobboard.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class JobRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String requirements;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String location;

    @NotNull
    private JobType jobType;

    @NotNull
    private ExperienceLevel experienceLevel;

    private JobStatus status;

    @NotNull
    private Long companyId;
}
