
package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.klef.soa.docker.dto.ChildActivityClassDTO;
import com.klef.soa.docker.service.ChildActivityClassService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:3000"
})
public class ChildActivityClassController {

    private final ChildActivityClassService service;

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public ChildActivityClassDTO addClass(
            @Valid @RequestBody ChildActivityClassDTO dto) {
        return service.addClass(dto);
    }

    @GetMapping("/display")
    public List<ChildActivityClassDTO> getAllClasses() {
        return service.getAllClasses();
    }

    @GetMapping("/display/{id}")
    public ChildActivityClassDTO getClassById(@PathVariable Long id) {
        return service.getClassById(id);
    }

    @PutMapping("/update/{id}")
    public ChildActivityClassDTO updateClass(
            @PathVariable Long id,
            @Valid @RequestBody ChildActivityClassDTO dto) {
        return service.updateClass(id, dto);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClass(@PathVariable Long id) {
        service.deleteClass(id);
    }
}
