package com.klef.soa.docker.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChildActivityClassDTO {

    private Long id;

    @NotBlank(message = "Class name is required")
    @Size(max = 100)
    private String className;

    @NotBlank(message = "Instructor name is required")
    @Size(max = 100)
    private String instructorName;

    @NotNull(message = "Enrolled count is required")
    @Min(value = 0, message = "Count cannot be negative")
    private Integer enrolledCount;

    @NotNull(message = "Active status is required")
    private Boolean active;
}