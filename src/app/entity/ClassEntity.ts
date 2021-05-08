import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, ManyToOne, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "ClassTable", "ClassEntity")
export class ClassEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @ManyToOne("C", "DepartmentEntity")
  department = {};
  @ManyToOne("D", "ProfessorEntity")
  professor = {};
}
