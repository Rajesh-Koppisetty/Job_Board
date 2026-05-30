package com.jobboard.repository;

import com.jobboard.entity.Application;
import com.jobboard.entity.ApplicationStatus;
import com.jobboard.entity.Job;
import com.jobboard.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByApplicant(User applicant, Pageable pageable);

    Page<Application> findByJobPostedBy(User recruiter, Pageable pageable);

    List<Application> findByJob(Job job);

    Optional<Application> findByJobAndApplicant(Job job, User applicant);

    boolean existsByJobAndApplicant(Job job, User applicant);

    long countByStatus(ApplicationStatus status);

    long countByJobPostedBy(User recruiter);

    long countByJobPostedByAndStatus(User recruiter, ApplicationStatus status);
}
