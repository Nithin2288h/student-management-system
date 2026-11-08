package com.sms;

import tools.jackson.databind.json.JsonMapper;
import com.sms.controller.StudentController;
import com.sms.entity.Student;
import com.sms.exception.DuplicateResourceException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.service.StudentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper objectMapper;

    @MockitoBean
    private StudentService studentService;

    @Test
    @DisplayName("GET /api/students returns 200 OK and student list")
    void testGetAllStudents() throws Exception {
        Student student = new Student("STU1001", "Bob", "Marley", "bob@example.com", "IT", "DevOps", "+1-555-0100");
        student.setId(1L);

        when(studentService.getAllStudents()).thenReturn(List.of(student));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentId").value("STU1001"))
                .andExpect(jsonPath("$[0].firstName").value("Bob"));
    }

    @Test
    @DisplayName("GET /api/students/{id} returns 200 OK when student exists")
    void testGetStudentByIdFound() throws Exception {
        Student student = new Student("STU1001", "Bob", "Marley", "bob@example.com", "IT", "DevOps", "+1-555-0100");
        student.setId(1L);

        when(studentService.getStudentById(1L)).thenReturn(student);

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentId").value("STU1001"))
                .andExpect(jsonPath("$.email").value("bob@example.com"));
    }

    @Test
    @DisplayName("GET /api/students/{id} returns 404 NOT FOUND when student does not exist")
    void testGetStudentByIdNotFound() throws Exception {
        when(studentService.getStudentById(99L)).thenThrow(new ResourceNotFoundException("Student record not found with ID: 99"));

        mockMvc.perform(get("/api/students/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Student record not found with ID: 99"));
    }

    @Test
    @DisplayName("POST /api/students returns 201 CREATED for valid payload")
    void testCreateStudentSuccess() throws Exception {
        Student newStudent = new Student("STU2002", "Charlie", "Brown", "charlie@school.org", "Engineering", "AWS", "+1-555-0155");
        Student savedStudent = new Student("STU2002", "Charlie", "Brown", "charlie@school.org", "Engineering", "AWS", "+1-555-0155");
        savedStudent.setId(10L);

        when(studentService.createStudent(any(Student.class))).thenReturn(savedStudent);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newStudent)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.studentId").value("STU2002"));
    }

    @Test
    @DisplayName("POST /api/students returns 400 BAD REQUEST when validation fails")
    void testCreateStudentValidationFailure() throws Exception {
        Student invalidStudent = new Student("", "", "", "not-an-email", "", "", "invalid");

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidStudent)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors").exists());
    }

    @Test
    @DisplayName("POST /api/students returns 409 CONFLICT on duplicate student registration")
    void testCreateStudentDuplicateConflict() throws Exception {
        Student student = new Student("STU1001", "Bob", "Marley", "bob@example.com", "IT", "DevOps", "+1-555-0100");

        when(studentService.createStudent(any(Student.class)))
                .thenThrow(new DuplicateResourceException("Student registration number 'STU1001' is already registered"));

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(student)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Student registration number 'STU1001' is already registered"));
    }

    @Test
    @DisplayName("DELETE /api/students/{id} returns 200 OK on success")
    void testDeleteStudentSuccess() throws Exception {
        doNothing().when(studentService).deleteStudent(1L);

        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deleted").value(true));
    }
}
