package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.DTO.StudentParentRequestDTO;
import com.schoolbus.schoolbusapp.Models.Parent;
import com.schoolbus.schoolbusapp.Models.Student;
import com.schoolbus.schoolbusapp.Services.ParentService;
import com.schoolbus.schoolbusapp.Services.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/students")
public class StudentParentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private ParentService parentService;

    @PostMapping("/student-parent")
    public ResponseEntity<?> createStudentParent(@Valid @RequestBody StudentParentRequestDTO requestDTO) {
        try {
            Parent savedParent = parentService.createParent(requestDTO.getParent());
            Student savedStudent = studentService.createStudent(requestDTO.getStudent(), savedParent.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body("Student and parent created successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create student and parent: " + e.getMessage());
        }
    }


    @GetMapping("/by-parent/{parentId}")
    public ResponseEntity<?> getStudentsByParentId(@PathVariable String parentId) {
        List<Student> students = studentService.getStudentsByParentId(parentId);

        if (students.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No student found for parent ID: " + parentId);
        }

        return ResponseEntity.ok(students);
    }

    @GetMapping("/my-students")
    public ResponseEntity<?> getMyStudents(Authentication authentication) {
        try {
            String username = authentication.getName();
            Parent parent = parentService.findByEmailOrPhone(username);

            if (parent == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Parent not found.");
            }

            List<Student> students = studentService.getStudentsByParentId(parent.getId());

            if (students.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No students found for this parent.");
            }

            return ResponseEntity.ok(students);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }


}