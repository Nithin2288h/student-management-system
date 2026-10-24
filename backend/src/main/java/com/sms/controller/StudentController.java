package com.sms.controller;

import com.sms.entity.Student;
import com.sms.service.StudentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * 1. GET /api/students - Retrieve all students or search with ?search=keyword
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents(@RequestParam(value = "search", required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            logger.info("REST: Searching students with keyword: {}", search);
            return ResponseEntity.ok(studentService.searchStudents(search));
        }
        logger.info("REST: Retrieving all students");
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    /**
     * 2. GET /api/students/{id} - Retrieve one student by primary key ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        logger.info("REST: Retrieving student with ID: {}", id);
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    /**
     * 3. POST /api/students - Create a new student record
     */
    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        logger.info("REST: Creating student: {} {}", student.getFirstName(), student.getLastName());
        Student createdStudent = studentService.createStudent(student);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    /**
     * 4. PUT /api/students/{id} - Update an existing student record
     */
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student student) {
        logger.info("REST: Updating student with ID: {}", id);
        Student updatedStudent = studentService.updateStudent(id, student);
        return ResponseEntity.ok(updatedStudent);
    }

    /**
     * 5. DELETE /api/students/{id} - Delete a student record
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteStudent(@PathVariable Long id) {
        logger.info("REST: Deleting student with ID: {}", id);
        studentService.deleteStudent(id);
        Map<String, Object> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        response.put("id", id);
        response.put("message", "Student record successfully deleted");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/students/count - Retrieve total student count for dashboard header KPI
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getStudentCount() {
        long count = studentService.getStudentCount();
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}
