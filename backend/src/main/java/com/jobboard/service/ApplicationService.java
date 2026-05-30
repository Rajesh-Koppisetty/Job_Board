package com.jobboard.service;

import com.jobboard.dto.*;
import com.jobboard.entity.*;
import com.jobboard.exception.BadRequestException;
import com.jobboard.exception.ResourceNotFoundException;
import com.jobboard.repository.ApplicationRepository;
import com.jobboard.repository.NotificationRepository;
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
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobService jobService;
    private final NotificationRepository notificationRepository;

    @Transactional
    public ApplicationResponse apply(ApplicationRequest request, User applicant) {
        Job job = jobService.findJob(request.getJobId());

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("This job is not accepting applications");
        }

        if (applicationRepository.existsByJobAndApplicant(job, applicant)) {
            throw new BadRequestException("You have already applied to this job");
        }

        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .status(ApplicationStatus.PENDING)
                .coverLetter(request.getCoverLetter())
                .resumeUrl(request.getResumeUrl() != null ? request.getResumeUrl() : applicant.getResumeUrl())
                .build();

        Application saved = applicationRepository.save(application);

        notificationRepository.save(Notification.builder()
                .user(job.getPostedBy())
                .title("New Application")
                .message(applicant.getFullName() + " applied for " + job.getTitle())
                .build());

        return toResponse(saved);
    }

    public PageResponse<ApplicationResponse> getMyApplications(User applicant, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Application> applications = applicationRepository.findByApplicant(applicant, pageable);
        return toPageResponse(applications);
    }

    public PageResponse<ApplicationResponse> getRecruiterApplications(User recruiter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Application> applications = applicationRepository.findByJobPostedBy(recruiter, pageable);
        return toPageResponse(applications);
    }

    public List<ApplicationResponse> getJobApplications(Long jobId, User recruiter) {
        Job job = jobService.findJob(jobId);
        if (!job.getPostedBy().getId().equals(recruiter.getId())) {
            throw new BadRequestException("Access denied");
        }
        return applicationRepository.findByJob(job).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateStatus(Long id, UpdateApplicationStatusRequest request, User recruiter) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!application.getJob().getPostedBy().getId().equals(recruiter.getId())) {
            throw new BadRequestException("Access denied");
        }

        application.setStatus(request.getStatus());
        Application saved = applicationRepository.save(application);

        notificationRepository.save(Notification.builder()
                .user(application.getApplicant())
                .title("Application Update")
                .message("Your application for " + application.getJob().getTitle() + " is now " + request.getStatus())
                .build());

        return toResponse(saved);
    }

    private PageResponse<ApplicationResponse> toPageResponse(Page<Application> page) {
        List<ApplicationResponse> content = page.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<ApplicationResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public ApplicationResponse toResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .companyName(application.getJob().getCompany().getName())
                .applicantId(application.getApplicant().getId())
                .applicantName(application.getApplicant().getFullName())
                .applicantEmail(application.getApplicant().getEmail())
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .resumeUrl(application.getResumeUrl())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}
