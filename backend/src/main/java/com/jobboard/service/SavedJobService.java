package com.jobboard.service;

import com.jobboard.dto.JobResponse;
import com.jobboard.dto.PageResponse;
import com.jobboard.entity.Job;
import com.jobboard.entity.SavedJob;
import com.jobboard.entity.User;
import com.jobboard.exception.BadRequestException;
import com.jobboard.repository.SavedJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobService jobService;

    @Transactional
    public void saveJob(Long jobId, User user) {
        Job job = jobService.findJob(jobId);
        if (savedJobRepository.existsByUserAndJob(user, job)) {
            throw new BadRequestException("Job already saved");
        }
        savedJobRepository.save(SavedJob.builder().user(user).job(job).build());
    }

    @Transactional
    public void unsaveJob(Long jobId, User user) {
        Job job = jobService.findJob(jobId);
        SavedJob savedJob = savedJobRepository.findByUserAndJob(user, job)
                .orElseThrow(() -> new BadRequestException("Job not in saved list"));
        savedJobRepository.delete(savedJob);
    }

    public PageResponse<JobResponse> getSavedJobs(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SavedJob> savedJobs = savedJobRepository.findByUser(user, pageable);

        List<JobResponse> content = savedJobs.getContent().stream()
                .map(sj -> jobService.toResponse(sj.getJob(), user))
                .collect(Collectors.toList());

        return PageResponse.<JobResponse>builder()
                .content(content)
                .page(savedJobs.getNumber())
                .size(savedJobs.getSize())
                .totalElements(savedJobs.getTotalElements())
                .totalPages(savedJobs.getTotalPages())
                .last(savedJobs.isLast())
                .build();
    }
}
