package com.sms;

import com.sms.entity.Student;
import com.sms.repository.StudentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    private StudentRepository studentRepository;

    @Test
    @DisplayName("Should save student, generate ID, and retrieve by ID")
    void testSaveAndFindById() {
        Student student = new Student("REG001", "David", "Miller", "david@example.edu", "Electrical", "Robotics", "+1-555-9988");
        Student saved = studentRepository.save(student);

        assertNotNull(saved.getId());
        assertNotNull(saved.getCreatedAt());

        Optional<Student> found = studentRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("David", found.get().getFirstName());
    }

    @Test
    @DisplayName("Should verify existsByStudentId and existsByEmail")
    void testExistsQueries() {
        Student student = new Student("REG002", "Elena", "Rostova", "elena@example.edu", "Physics", "Quantum Computing", "+1-555-7766");
        studentRepository.save(student);

        assertTrue(studentRepository.existsByStudentId("REG002"));
        assertFalse(studentRepository.existsByStudentId("NON_EXISTENT"));

        assertTrue(studentRepository.existsByEmail("elena@example.edu"));
        assertFalse(studentRepository.existsByEmail("other@example.edu"));
    }

    @Test
    @DisplayName("Should search students across multiple fields (first name, department, course)")
    void testSearchStudents() {
        Student s1 = new Student("REG003", "Frank", "Ocean", "frank@music.edu", "Arts", "Sound Engineering", "+1-555-1234");
        Student s2 = new Student("REG004", "Grace", "Hopper", "grace@tech.edu", "Computer Science", "Compiler Design", "+1-555-5678");
        studentRepository.save(s1);
        studentRepository.save(s2);

        List<Student> results = studentRepository.searchStudents("Hopper");
        assertEquals(1, results.size());
        assertEquals("Grace", results.get(0).getFirstName());

        List<Student> soundResults = studentRepository.searchStudents("Sound");
        assertEquals(1, soundResults.size());
        assertEquals("Frank", soundResults.get(0).getFirstName());
    }
}
