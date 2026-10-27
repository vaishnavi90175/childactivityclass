package com.klef.soa.docker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "child_activity_class")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChildActivityClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Class name is required")
    @Size(max = 100, message = "Class name must not exceed 100 characters")
    private String className;

    @NotBlank(message = "Instructor name is required")
    @Size(max = 100, message = "Instructor name must not exceed 100 characters")
    private String instructorName;

    @NotNull(message = "Enrolled count is required")
    @Min(value = 0, message = "Enrolled count cannot be negative")
    private Integer enrolledCount;

    @NotNull(message = "Active status is required")
    private Boolean active;
}