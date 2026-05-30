package com.jobboard.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String firstName;
    private String lastName;
    private String phone;
    private String bio;
    private String resumeUrl;
}
