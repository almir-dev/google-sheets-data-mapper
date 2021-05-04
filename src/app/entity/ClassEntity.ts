import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, ManyToOneColumn, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "ClassTable", "ClassEntity")
export class ClassEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @ManyToOneColumn("C", "DepartmentEntity")
  department = {};
  @ManyToOneColumn("D", "ProfessorEntity")
  professor = {};
}
