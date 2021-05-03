import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, OneToOneColumn, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "ClassTable", "ClassEntity")
export class ClassEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @OneToOneColumn("C", "DepartmentEntity")
  department = {};
  @OneToOneColumn("D", "ProfessorEntity")
  professor = {};
}
