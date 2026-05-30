package com.jobboard.repository;

import com.jobboard.entity.Company;
import com.jobboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    List<Company> findByRecruiter(User recruiter);
}
