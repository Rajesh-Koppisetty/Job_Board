package com.jobboard.controller;

import com.jobboard.dto.*;
import com.jobboard.entity.User;
import com.jobboard.service.ApplicationService;
import com.jobboard.service.CompanyService;
import com.jobboard.service.DashboardService;
import com.jobboard.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final JobService jobService;
    private final CompanyService companyService;
    private final ApplicationService applicationService;
    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public DashboardStatsResponse getDashboard(@AuthenticationPrincipal User recruiter) {
        return dashboardService.getRecruiterStats(recruiter);
    }

    @PostMapping("/companies")
    public ResponseEntity<CompanyResponse> createCompany(
            @Valid @RequestBody CompanyRequest request,
            @AuthenticationPrincipal User recruiter
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.create(request, recruiter));
    }

    @GetMapping("/companies")
    public List<CompanyResponse> getCompanies(@AuthenticationPrincipal User recruiter) {
        return companyService.getByRecruiter(recruiter);
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal User recruiter
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.create(request, recruiter));
    }

    @GetMapping("/jobs")
    public PageResponse<JobResponse> getMyJobs(
            @AuthenticationPrincipal User recruiter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobService.getRecruiterJobs(recruiter, page, size);
    }

    @PutMapping("/jobs/{id}")
    public JobResponse updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal User recruiter
    ) {
        return jobService.update(id, request, recruiter);
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, @AuthenticationPrincipal User recruiter) {
        jobService.delete(id, recruiter);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/applications")
    public PageResponse<ApplicationResponse> getApplications(
            @AuthenticationPrincipal User recruiter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return applicationService.getRecruiterApplications(recruiter, page, size);
    }

    @GetMapping("/jobs/{jobId}/applications")
    public List<ApplicationResponse> getJobApplications(
            @PathVariable Long jobId,
            @AuthenticationPrincipal User recruiter
    ) {
        return applicationService.getJobApplications(jobId, recruiter);
    }

    @PatchMapping("/applications/{id}/status")
    public ApplicationResponse updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request,
            @AuthenticationPrincipal User recruiter
    ) {
        return applicationService.updateStatus(id, request, recruiter);
    }
}
