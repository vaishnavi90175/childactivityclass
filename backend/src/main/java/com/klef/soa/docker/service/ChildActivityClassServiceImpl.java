package com.klef.soa.docker.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klef.soa.docker.dto.ChildActivityClassDTO;
import com.klef.soa.docker.entity.ChildActivityClass;
import com.klef.soa.docker.repository.ChildActivityClassRepository;
import com.klef.soa.docker.service.ChildActivityClassService;

@Service
@Transactional
public class ChildActivityClassServiceImpl
        implements ChildActivityClassService {

    private final ChildActivityClassRepository repository;

    public ChildActivityClassServiceImpl(
            ChildActivityClassRepository repository) {
        this.repository = repository;
    }

    @Override
    public ChildActivityClassDTO addClass(ChildActivityClassDTO dto) {
        ChildActivityClass entity = new ChildActivityClass();
        copyToEntity(dto, entity);

        ChildActivityClass saved = repository.save(entity);
        return copyToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChildActivityClassDTO> getAllClasses() {
        return repository.findAll()
                .stream()
                .map(this::copyToDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ChildActivityClassDTO getClassById(Long id) {
        ChildActivityClass entity = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Class not found with ID: " + id));

        return copyToDTO(entity);
    }

    @Override
    public ChildActivityClassDTO updateClass(
            Long id, ChildActivityClassDTO dto) {

        ChildActivityClass entity = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Class not found with ID: " + id));

        copyToEntity(dto, entity);
        return copyToDTO(repository.save(entity));
    }

    @Override
    public String deleteClass(Long id) {
        ChildActivityClass entity = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Class not found with ID: " + id));

        repository.delete(entity);
        return "Class deleted successfully";
    }

    private void copyToEntity(
            ChildActivityClassDTO dto, ChildActivityClass entity) {

        entity.setClassName(dto.getClassName());
        entity.setInstructorName(dto.getInstructorName());
        entity.setEnrolledCount(dto.getEnrolledCount());
        entity.setActive(dto.getActive());
    }

    private ChildActivityClassDTO copyToDTO(
            ChildActivityClass entity) {

        ChildActivityClassDTO dto = new ChildActivityClassDTO();

        dto.setId(entity.getId());
        dto.setClassName(entity.getClassName());
        dto.setInstructorName(entity.getInstructorName());
        dto.setEnrolledCount(entity.getEnrolledCount());
        dto.setActive(entity.getActive());

        return dto;
    }
}