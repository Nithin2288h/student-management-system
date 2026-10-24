package com.sms.service;

import com.sms.entity.Student;
import java.util.List;

public interface StudentService {
    List<Student> getAllStudents();
    List<Student> searchStudents(String keyword);
    Student getStudentById(Long id);
    Student createStudent(Student student);
    Student updateStudent(Long id, Student student);
    void deleteStudent(Long id);
    long getStudentCount();
}
