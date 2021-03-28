import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "ClassTable", "ClassEntity")
export class ClassEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @JoinColumn("C", "DepartmentEntity")
  department = {};
  @JoinColumn("D", "ProfessorEntity")
  professor = {};
}
