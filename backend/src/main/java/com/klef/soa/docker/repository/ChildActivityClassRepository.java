package com.klef.soa.docker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klef.soa.docker.entity.ChildActivityClass;

public interface ChildActivityClassRepository
        extends JpaRepository<ChildActivityClass, Long> {
}