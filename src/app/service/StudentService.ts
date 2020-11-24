import { Student } from "../entity/Student";
import { and, whereEq } from "../../libs/criteria/QueryOperation";

class StudentServiceImpl {
  getStudents(): Promise<Student[]> {
    const query = and(whereEq(Student.name, "Stacy"));
    return Student.find(query);
  }

  getAllStudents(): Promise<Student[]> {
    return Student.findAll();
  }
}

export const StudentService = new StudentServiceImpl();
