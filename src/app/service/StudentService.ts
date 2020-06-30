import { Student } from "../entity/Student";

class StudentServiceImpl {
  getStudents(): Promise<Student[]> {
    return Student.findAll();
  }
}

export const StudentService = new StudentServiceImpl();
