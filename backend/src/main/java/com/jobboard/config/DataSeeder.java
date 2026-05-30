package com.jobboard.config;

import com.jobboard.entity.*;
import com.jobboard.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        if (!seedEnabled || userRepository.count() > 0) {
            return;
        }

        log.info("Seeding demo data...");

        User admin = userRepository.save(User.builder()
                .email("admin@talentflow.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("User")
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build());

        User recruiter = userRepository.save(User.builder()
                .email("recruiter@talentflow.com")
                .password(passwordEncoder.encode("recruiter123"))
                .firstName("Sarah")
                .lastName("Johnson")
                .role(Role.ROLE_RECRUITER)
                .phone("+1-555-0100")
                .bio("Tech recruiter at TalentFlow")
                .enabled(true)
                .build());

        User jobSeeker = userRepository.save(User.builder()
                .email("user@talentflow.com")
                .password(passwordEncoder.encode("user123"))
                .firstName("Alex")
                .lastName("Chen")
                .role(Role.ROLE_USER)
                .phone("+1-555-0200")
                .bio("Full-stack developer open to remote roles")
                .resumeUrl("https://example.com/resume/alex-chen.pdf")
                .enabled(true)
                .build());

        Company techCorp = companyRepository.save(Company.builder()
                .name("TechCorp Global")
                .description("Leading technology company building the future of work.")
                .website("https://techcorp.example.com")
                .location("San Francisco, CA")
                .recruiter(recruiter)
                .build());

        Company cloudNine = companyRepository.save(Company.builder()
                .name("CloudNine Systems")
                .description("Cloud infrastructure and DevOps solutions.")
                .website("https://cloudnine.example.com")
                .location("Remote")
                .recruiter(recruiter)
                .build());

        jobRepository.save(Job.builder()
                .title("Senior Full Stack Developer")
                .description("Join our engineering team to build scalable web applications using React and Spring Boot. You'll work on our core job platform and mentor junior developers.")
                .requirements("5+ years experience\nReact, TypeScript\nJava, Spring Boot\nMySQL, REST APIs")
                .salaryMin(new BigDecimal("120000"))
                .salaryMax(new BigDecimal("160000"))
                .location("San Francisco, CA")
                .jobType(JobType.HYBRID)
                .experienceLevel(ExperienceLevel.SENIOR)
                .status(JobStatus.ACTIVE)
                .company(techCorp)
                .postedBy(recruiter)
                .build());

        jobRepository.save(Job.builder()
                .title("Frontend Engineer (React)")
                .description("Build beautiful, accessible user interfaces for millions of users. Experience with Tailwind CSS and Framer Motion is a plus.")
                .requirements("3+ years React\nTypeScript\nCSS/Tailwind\nUI/UX sensibility")
                .salaryMin(new BigDecimal("90000"))
                .salaryMax(new BigDecimal("130000"))
                .location("New York, NY")
                .jobType(JobType.FULL_TIME)
                .experienceLevel(ExperienceLevel.MID)
                .status(JobStatus.ACTIVE)
                .company(techCorp)
                .postedBy(recruiter)
                .build());

        jobRepository.save(Job.builder()
                .title("DevOps Engineer")
                .description("Manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure on AWS. Help us achieve 99.99% uptime.")
                .requirements("Docker, Kubernetes\nAWS or GCP\nTerraform\nGitHub Actions")
                .salaryMin(new BigDecimal("110000"))
                .salaryMax(new BigDecimal("150000"))
                .location("Remote")
                .jobType(JobType.REMOTE)
                .experienceLevel(ExperienceLevel.SENIOR)
                .status(JobStatus.ACTIVE)
                .company(cloudNine)
                .postedBy(recruiter)
                .build());

        jobRepository.save(Job.builder()
                .title("Junior Java Developer")
                .description("Great opportunity for recent graduates to grow with a supportive team. Training provided on Spring Boot and microservices.")
                .requirements("Java fundamentals\nSQL basics\nEagerness to learn")
                .salaryMin(new BigDecimal("60000"))
                .salaryMax(new BigDecimal("80000"))
                .location("Austin, TX")
                .jobType(JobType.FULL_TIME)
                .experienceLevel(ExperienceLevel.ENTRY)
                .status(JobStatus.ACTIVE)
                .company(cloudNine)
                .postedBy(recruiter)
                .build());

        jobRepository.save(Job.builder()
                .title("Product Design Intern")
                .description("Summer internship working with our design team on user research and Figma prototypes.")
                .requirements("Figma\nPortfolio required\nCurrently enrolled in design program")
                .salaryMin(new BigDecimal("25"))
                .salaryMax(new BigDecimal("35"))
                .location("Chicago, IL")
                .jobType(JobType.INTERNSHIP)
                .experienceLevel(ExperienceLevel.ENTRY)
                .status(JobStatus.ACTIVE)
                .company(techCorp)
                .postedBy(recruiter)
                .build());

        log.info("Demo accounts created:");
        log.info("  Admin:     admin@talentflow.com / admin123");
        log.info("  Recruiter: recruiter@talentflow.com / recruiter123");
        log.info("  User:      user@talentflow.com / user123");
        log.info("Seeded {} jobs across {} companies", jobRepository.count(), companyRepository.count());
        log.debug("Admin id={}, seeker id={}", admin.getId(), jobSeeker.getId());
    }
}
