package com.jobboard.repository;

import com.jobboard.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    Page<Job> findByPostedBy(User postedBy, Pageable pageable);

    long countByStatus(JobStatus status);

    long countByPostedBy(User postedBy);

    long countByPostedByAndStatus(User postedBy, JobStatus status);

    @Query("""
            SELECT j FROM Job j
            WHERE j.status = :status
            AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
            AND (:jobType IS NULL OR j.jobType = :jobType)
            AND (:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel)
            """)
    Page<Job> searchJobs(
            @Param("status") JobStatus status,
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("jobType") JobType jobType,
            @Param("experienceLevel") ExperienceLevel experienceLevel,
            Pageable pageable
    );

    @Query("""
            SELECT j FROM Job j
            WHERE j.status = 'ACTIVE'
            AND j.id <> :jobId
            AND (j.jobType = :jobType OR j.experienceLevel = :experienceLevel OR j.location = :location)
            ORDER BY j.createdAt DESC
            """)
    List<Job> findRelatedJobs(
            @Param("jobId") Long jobId,
            @Param("jobType") JobType jobType,
            @Param("experienceLevel") ExperienceLevel experienceLevel,
            @Param("location") String location,
            Pageable pageable
    );
}
