package com.jobboard.controller;

import com.jobboard.dto.*;
import com.jobboard.entity.*;
import com.jobboard.service.JobService;
import com.jobboard.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final SavedJobService savedJobService;

    @GetMapping
    public PageResponse<JobResponse> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) ExperienceLevel experienceLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal User user
    ) {
        return jobService.search(keyword, location, jobType, experienceLevel, page, size, user);
    }

    @GetMapping("/saved")
    public PageResponse<JobResponse> getSavedJobs(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return savedJobService.getSavedJobs(user, page, size);
    }

    @GetMapping("/{id}")
    public JobResponse getJob(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return jobService.getById(id, user);
    }

    @GetMapping("/{id}/related")
    public List<JobResponse> getRelatedJobs(@PathVariable Long id) {
        return jobService.getRelatedJobs(id);
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<Map<String, String>> saveJob(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        savedJobService.saveJob(id, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Job saved"));
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<Map<String, String>> unsaveJob(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        savedJobService.unsaveJob(id, user);
        return ResponseEntity.ok(Map.of("message", "Job removed from saved"));
    }
}
