package com.klef.soa.docker.service;

import java.util.List;
import com.klef.soa.docker.dto.ChildActivityClassDTO;

public interface ChildActivityClassService {

    ChildActivityClassDTO addClass(ChildActivityClassDTO dto);

    List<ChildActivityClassDTO> getAllClasses();

    ChildActivityClassDTO getClassById(Long id);

    ChildActivityClassDTO updateClass(Long id, ChildActivityClassDTO dto);

    String deleteClass(Long id);
}