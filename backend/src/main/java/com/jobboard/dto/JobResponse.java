package com.jobboard.dto;

import com.jobboard.entity.ExperienceLevel;
import com.jobboard.entity.JobStatus;
import com.jobboard.entity.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String requirements;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String location;
    private JobType jobType;
    private ExperienceLevel experienceLevel;
    private JobStatus status;
    private CompanyResponse company;
    private Long postedById;
    private String postedByName;
    private LocalDateTime createdAt;
    private boolean saved;
    private boolean applied;
}
