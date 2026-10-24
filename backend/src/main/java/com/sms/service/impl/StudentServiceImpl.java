package com.sms.service.impl;

import com.sms.entity.Student;
import com.sms.exception.DuplicateResourceException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.StudentRepository;
import com.sms.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentServiceImpl.class);

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        logger.info("Fetching all students from database");
        return studentRepository.findAllByOrderByIdDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> searchStudents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllStudents();
        }
        String cleanKeyword = keyword.trim();
        logger.info("Searching students with keyword: '{}'", cleanKeyword);
        return studentRepository.searchStudents(cleanKeyword);
    }

    @Override
    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        logger.info("Fetching student with ID: {}", id);
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student record not found with ID: " + id));
    }

    @Override
    public Student createStudent(Student student) {
        logger.info("Attempting to create student with ID: {} and email: {}", student.getStudentId(), student.getEmail());

        if (studentRepository.existsByStudentId(student.getStudentId())) {
            throw new DuplicateResourceException("Student registration number '" + student.getStudentId() + "' is already registered");
        }

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new DuplicateResourceException("Email address '" + student.getEmail() + "' is already registered to another student");
        }

        student.setId(null); // Ensure fresh insertion
        Student savedStudent = studentRepository.save(student);
        logger.info("Successfully created student with generated DB ID: {}", savedStudent.getId());
        return savedStudent;
    }

    @Override
    public Student updateStudent(Long id, Student studentDetails) {
        logger.info("Attempting to update student with ID: {}", id);

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student record not found with ID: " + id));

        if (studentRepository.existsByStudentIdAndIdNot(studentDetails.getStudentId(), id)) {
            throw new DuplicateResourceException("Student registration number '" + studentDetails.getStudentId() + "' is already in use by another student");
        }

        if (studentRepository.existsByEmailAndIdNot(studentDetails.getEmail(), id)) {
            throw new DuplicateResourceException("Email address '" + studentDetails.getEmail() + "' is already in use by another student");
        }

        existingStudent.setStudentId(studentDetails.getStudentId());
        existingStudent.setFirstName(studentDetails.getFirstName());
        existingStudent.setLastName(studentDetails.getLastName());
        existingStudent.setEmail(studentDetails.getEmail());
        existingStudent.setDepartment(studentDetails.getDepartment());
        existingStudent.setCourse(studentDetails.getCourse());
        existingStudent.setPhone(studentDetails.getPhone());

        Student updatedStudent = studentRepository.save(existingStudent);
        logger.info("Successfully updated student with ID: {}", id);
        return updatedStudent;
    }

    @Override
    public void deleteStudent(Long id) {
        logger.info("Attempting to delete student with ID: {}", id);
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete: Student record not found with ID: " + id);
        }
        studentRepository.deleteById(id);
        logger.info("Successfully deleted student with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public long getStudentCount() {
        return studentRepository.count();
    }
}
