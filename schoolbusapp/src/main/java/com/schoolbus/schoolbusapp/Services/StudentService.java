package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.DTO.StudentDTO;
import com.schoolbus.schoolbusapp.DTO.StudentUpdateRequest;
import com.schoolbus.schoolbusapp.Models.Student;
import com.schoolbus.schoolbusapp.Repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;



    public Student createStudent(StudentDTO studentDTO, String parentId) {
        Student student = new Student();
        student.setName(studentDTO.getName());
        student.setGrade(studentDTO.getGrade());
        student.setRoute(studentDTO.getRoute());
        student.setParentId(parentId);
        student.setRole(studentDTO.getRole());

        String key = student.getName().toLowerCase().trim() + "-" +
                student.getGrade().toLowerCase().trim() + "-" +
                parentId;
        student.setCombinationKey(key);

        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();

    }

    public List<Student> getStudentsByParentId(String parentId) {
        return studentRepository.findByParentId(parentId);
    }
    public boolean deleteStudent(String id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Student getStudentById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }


    public Student updateStudent(String id, StudentUpdateRequest request) {
        Student student = getStudentById(id);

        if (request.getName() != null) student.setName(request.getName());
        if (request.getGrade() != null) student.setGrade(request.getGrade());
        if (request.getRoute() != null) student.setRoute(request.getRoute());

        return studentRepository.save(student);
    }

}



