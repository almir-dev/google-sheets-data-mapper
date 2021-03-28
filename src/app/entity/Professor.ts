import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "ProfessorTable", "ProfessorEntity")
export class ProfessorEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @Column("C")
  address = "";
  @JoinColumn("D", "DepartmentEntity")
  department = {};
}
