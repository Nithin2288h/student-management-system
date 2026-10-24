package com.sms;

import com.sms.entity.Student;
import com.sms.exception.DuplicateResourceException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.StudentRepository;
import com.sms.service.impl.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student sampleStudent;

    @BeforeEach
    void setUp() {
        sampleStudent = new Student(
                "STU1001",
                "Alice",
                "Johnson",
                "alice.johnson@university.edu",
                "Computer Science",
                "Cloud Computing",
                "+1-555-0199"
        );
        sampleStudent.setId(1L);
    }

    @Test
    @DisplayName("Should successfully create a new student when studentId and email are unique")
    void testCreateStudentSuccess() {
        when(studentRepository.existsByStudentId(sampleStudent.getStudentId())).thenReturn(false);
        when(studentRepository.existsByEmail(sampleStudent.getEmail())).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(sampleStudent);

        Student created = studentService.createStudent(sampleStudent);

        assertNotNull(created);
        assertEquals("STU1001", created.getStudentId());
        assertEquals("Alice", created.getFirstName());
        verify(studentRepository, times(1)).save(sampleStudent);
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when student registration number already exists")
    void testCreateStudentDuplicateId() {
        when(studentRepository.existsByStudentId(sampleStudent.getStudentId())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            studentService.createStudent(sampleStudent);
        });

        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when student email already exists")
    void testCreateStudentDuplicateEmail() {
        when(studentRepository.existsByStudentId(sampleStudent.getStudentId())).thenReturn(false);
        when(studentRepository.existsByEmail(sampleStudent.getEmail())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            studentService.createStudent(sampleStudent);
        });

        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Should retrieve student by ID")
    void testGetStudentByIdSuccess() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));

        Student found = studentService.getStudentById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
        assertEquals("alice.johnson@university.edu", found.getEmail());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when student ID does not exist")
    void testGetStudentByIdNotFound() {
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            studentService.getStudentById(999L);
        });
    }

    @Test
    @DisplayName("Should update existing student successfully")
    void testUpdateStudentSuccess() {
        Student updatedDetails = new Student(
                "STU1001",
                "Alice",
                "Smith",
                "alice.smith@university.edu",
                "Computer Science",
                "DevOps Engineering",
                "+1-555-0199"
        );

        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));
        when(studentRepository.existsByStudentIdAndIdNot("STU1001", 1L)).thenReturn(false);
        when(studentRepository.existsByEmailAndIdNot("alice.smith@university.edu", 1L)).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Student result = studentService.updateStudent(1L, updatedDetails);

        assertNotNull(result);
        assertEquals("Smith", result.getLastName());
        assertEquals("DevOps Engineering", result.getCourse());
    }

    @Test
    @DisplayName("Should delete student when ID exists")
    void testDeleteStudentSuccess() {
        when(studentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(studentRepository).deleteById(1L);

        assertDoesNotThrow(() -> studentService.deleteStudent(1L));
        verify(studentRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException on delete when ID does not exist")
    void testDeleteStudentNotFound() {
        when(studentRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            studentService.deleteStudent(999L);
        });
        verify(studentRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Should search students by keyword")
    void testSearchStudents() {
        when(studentRepository.searchStudents("Cloud")).thenReturn(List.of(sampleStudent));

        List<Student> results = studentService.searchStudents("Cloud");

        assertEquals(1, results.size());
        assertEquals("Cloud Computing", results.get(0).getCourse());
    }
}
