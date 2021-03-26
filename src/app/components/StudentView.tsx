import React from "react";
import { Student } from "../entity/Student";
import { StudentService } from "../service/StudentService";
import styles from "./StudentView.module.scss";

export function StudentView() {
  React.useEffect(() => {
    StudentService.getAllStudents().then(students => setStudents(students));
  }, []);

  const [students, setStudents] = React.useState<Student[]>([]);

  return <StudentViewContent students={students} />;
}

export function StudentViewContent({ students }: { students: Student[] }) {
  return <div className={styles.studentView}>Almir</div>;
}
