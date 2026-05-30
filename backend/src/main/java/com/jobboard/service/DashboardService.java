package com.jobboard.service;

import com.jobboard.dto.DashboardStatsResponse;
import com.jobboard.dto.NotificationResponse;
import com.jobboard.dto.PageResponse;
import com.jobboard.entity.*;
import com.jobboard.exception.ResourceNotFoundException;
import com.jobboard.repository.*;
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
public class DashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public DashboardStatsResponse getAdminStats() {
        return DashboardStatsResponse.builder()
                .totalJobs(jobRepository.count())
                .activeJobs(jobRepository.countByStatus(JobStatus.ACTIVE))
                .totalApplications(applicationRepository.count())
                .pendingApplications(applicationRepository.countByStatus(ApplicationStatus.PENDING))
                .totalUsers(userRepository.count())
                .totalRecruiters(userRepository.countByRole(Role.ROLE_RECRUITER))
                .build();
    }

    public DashboardStatsResponse getRecruiterStats(User recruiter) {
        return DashboardStatsResponse.builder()
                .totalJobs(jobRepository.countByPostedBy(recruiter))
                .activeJobs(jobRepository.countByPostedByAndStatus(recruiter, JobStatus.ACTIVE))
                .totalApplications(applicationRepository.countByJobPostedBy(recruiter))
                .pendingApplications(applicationRepository.countByJobPostedByAndStatus(recruiter, ApplicationStatus.PENDING))
                .build();
    }

    public PageResponse<NotificationResponse> getNotifications(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);

        List<NotificationResponse> content = notifications.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<NotificationResponse>builder()
                .content(content)
                .page(notifications.getNumber())
                .size(notifications.getSize())
                .totalElements(notifications.getTotalElements())
                .totalPages(notifications.getTotalPages())
                .last(notifications.isLast())
                .build();
    }

    @Transactional
    public void markNotificationRead(Long id, User user) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
