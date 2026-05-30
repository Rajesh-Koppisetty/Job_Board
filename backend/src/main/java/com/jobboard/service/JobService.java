package com.jobboard.service;

import com.jobboard.dto.*;
import com.jobboard.entity.*;
import com.jobboard.exception.BadRequestException;
import com.jobboard.exception.ResourceNotFoundException;
import com.jobboard.repository.ApplicationRepository;
import com.jobboard.repository.JobRepository;
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
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyService companyService;
    private final SavedJobRepository savedJobRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    public JobResponse create(JobRequest request, User recruiter) {
        Company company = companyService.findCompany(request.getCompanyId());
        if (!company.getRecruiter().getId().equals(recruiter.getId())) {
            throw new BadRequestException("You can only post jobs for your own companies");
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .experienceLevel(request.getExperienceLevel())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.ACTIVE)
                .company(company)
                .postedBy(recruiter)
                .build();

        return toResponse(jobRepository.save(job), null);
    }

    public PageResponse<JobResponse> search(String keyword, String location, JobType jobType,
                                            ExperienceLevel experienceLevel, int page, int size, User currentUser) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs = jobRepository.searchJobs(JobStatus.ACTIVE, keyword, location, jobType, experienceLevel, pageable);
        return toPageResponse(jobs, currentUser);
    }

    public JobResponse getById(Long id, User currentUser) {
        Job job = findJob(id);
        return toResponse(job, currentUser);
    }

    public List<JobResponse> getRelatedJobs(Long id) {
        Job job = findJob(id);
        List<Job> related = jobRepository.findRelatedJobs(
                id, job.getJobType(), job.getExperienceLevel(), job.getLocation(), PageRequest.of(0, 4));
        return related.stream().map(j -> toResponse(j, null)).collect(Collectors.toList());
    }

    public PageResponse<JobResponse> getRecruiterJobs(User recruiter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs = jobRepository.findByPostedBy(recruiter, pageable);
        return toPageResponse(jobs, recruiter);
    }

    @Transactional
    public JobResponse update(Long id, JobRequest request, User recruiter) {
        Job job = findJob(id);
        if (!job.getPostedBy().getId().equals(recruiter.getId())) {
            throw new BadRequestException("You can only edit your own jobs");
        }

        Company company = companyService.findCompany(request.getCompanyId());
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        if (request.getStatus() != null) job.setStatus(request.getStatus());
        job.setCompany(company);

        return toResponse(jobRepository.save(job), recruiter);
    }

    @Transactional
    public void delete(Long id, User recruiter) {
        Job job = findJob(id);
        if (!job.getPostedBy().getId().equals(recruiter.getId())) {
            throw new BadRequestException("You can only delete your own jobs");
        }
        jobRepository.delete(job);
    }

    public Job findJob(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
    }

    private PageResponse<JobResponse> toPageResponse(Page<Job> page, User currentUser) {
        List<JobResponse> content = page.getContent().stream()
                .map(job -> toResponse(job, currentUser))
                .collect(Collectors.toList());

        return PageResponse.<JobResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public JobResponse toResponse(Job job, User currentUser) {
        boolean saved = false;
        boolean applied = false;
        if (currentUser != null) {
            saved = savedJobRepository.existsByUserAndJob(currentUser, job);
            applied = applicationRepository.existsByJobAndApplicant(job, currentUser);
        }

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .experienceLevel(job.getExperienceLevel())
                .status(job.getStatus())
                .company(companyService.toResponse(job.getCompany()))
                .postedById(job.getPostedBy().getId())
                .postedByName(job.getPostedBy().getFullName())
                .createdAt(job.getCreatedAt())
                .saved(saved)
                .applied(applied)
                .build();
    }
}
