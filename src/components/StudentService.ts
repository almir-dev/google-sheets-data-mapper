import { Student } from "../api/entity/Student";

class StudentServiceImpl {
  getStudents(): Promise<Student[]> {
    return Student.findAll();
  }
}

export const StudentService = new StudentServiceImpl();
