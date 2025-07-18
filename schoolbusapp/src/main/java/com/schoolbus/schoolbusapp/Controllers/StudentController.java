package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.DTO.StudentDTO;
import com.schoolbus.schoolbusapp.DTO.StudentUpdateRequest;
import com.schoolbus.schoolbusapp.Models.Student;
import com.schoolbus.schoolbusapp.Services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")

public class StudentController {
    @Autowired
    private StudentService studentService;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable String id, @RequestBody StudentUpdateRequest request) {
        try {
            Student updatedStudent = studentService.updateStudent(id, request);
            return ResponseEntity.ok(updatedStudent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student update failed: " + e.getMessage());
        }
    }

    @PostMapping("/{parentId}")
    public ResponseEntity<Student> createStudent(@RequestBody StudentDTO student, @PathVariable String parentId) {
        return ResponseEntity.ok(studentService.createStudent(student, parentId));
    }
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable String id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
        if (studentService.deleteStudent(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
