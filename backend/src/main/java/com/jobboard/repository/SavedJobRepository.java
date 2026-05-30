package com.jobboard.repository;

import com.jobboard.entity.Job;
import com.jobboard.entity.SavedJob;
import com.jobboard.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    Page<SavedJob> findByUser(User user, Pageable pageable);

    Optional<SavedJob> findByUserAndJob(User user, Job job);

    boolean existsByUserAndJob(User user, Job job);
}
