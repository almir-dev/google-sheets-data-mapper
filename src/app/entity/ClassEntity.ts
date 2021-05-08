import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, ManyToOne, PrimaryKey } from "../../libs/entity/Dto";
import { ProfessorEntity } from "./Professor";
import { DepartmentEntity } from "./DepartmentEntity";

@Entity("StudentsSpreadsheet", "ClassTable", "ClassEntity")
export class ClassEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @ManyToOne("C", "DepartmentEntity")
  department: DepartmentEntity = ({} as unknown) as DepartmentEntity;
  @ManyToOne("D", "ProfessorEntity")
  professor: ProfessorEntity = ({} as unknown) as ProfessorEntity;
}
