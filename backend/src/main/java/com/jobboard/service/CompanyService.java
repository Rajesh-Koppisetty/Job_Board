package com.jobboard.service;

import com.jobboard.dto.CompanyRequest;
import com.jobboard.dto.CompanyResponse;
import com.jobboard.entity.Company;
import com.jobboard.entity.User;
import com.jobboard.exception.ResourceNotFoundException;
import com.jobboard.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    @Transactional
    public CompanyResponse create(CompanyRequest request, User recruiter) {
        Company company = Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .website(request.getWebsite())
                .logoUrl(request.getLogoUrl())
                .location(request.getLocation())
                .recruiter(recruiter)
                .build();
        return toResponse(companyRepository.save(company));
    }

    public List<CompanyResponse> getByRecruiter(User recruiter) {
        return companyRepository.findByRecruiter(recruiter).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CompanyResponse getById(Long id) {
        return toResponse(findCompany(id));
    }

    public Company findCompany(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
    }

    public CompanyResponse toResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .website(company.getWebsite())
                .logoUrl(company.getLogoUrl())
                .location(company.getLocation())
                .recruiterId(company.getRecruiter().getId())
                .createdAt(company.getCreatedAt())
                .build();
    }
}
