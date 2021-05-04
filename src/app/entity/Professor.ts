import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, ManyToOneColumn, PrimaryKey } from "../../libs/entity/Dto";
import { DepartmentEntity } from "./DepartmentEntity";
import { ExtracurricularActivityEntity } from "./ExtracurricularActivityEntity";

@Entity("StudentsSpreadsheet", "ProfessorTable", "ProfessorEntity")
export class ProfessorEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @Column("C")
  address = "";
  @ManyToOneColumn("D", "DepartmentEntity")
  department = ({} as unknown) as DepartmentEntity;
  @ManyToOneColumn("E", "ExtracurricularActivityEntity")
  eActivity = ({} as unknown) as ExtracurricularActivityEntity;
}
