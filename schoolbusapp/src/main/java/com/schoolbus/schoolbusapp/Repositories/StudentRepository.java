package com.schoolbus.schoolbusapp.Repositories;

import com.schoolbus.schoolbusapp.Models.Student;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student,String> {
    List<Student> findByParentId(String parentId);
    Optional<Student> findById(String id);
    Optional<Student> findByCombinationKey(String combinationKey);

}
