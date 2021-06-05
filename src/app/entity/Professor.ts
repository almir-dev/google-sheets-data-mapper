import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, ManyToOne, PrimaryKey } from "../../libs/entity/Dto";
import { DepartmentEntity } from "./DepartmentEntity";
import { ExtracurricularActivityEntity } from "./ExtracurricularActivityEntity";

@Entity("StudentsSpreadsheet", "ProfessorTable", "ProfessorEntity")
export class ProfessorEntity extends Dto<ProfessorEntity> {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @Column("C")
  address = "";
  @ManyToOne("D", "DepartmentEntity")
  department = ({} as unknown) as DepartmentEntity;
  @ManyToOne("E", "ExtracurricularActivityEntity")
  eActivity = ({} as unknown) as ExtracurricularActivityEntity;
  @Column("F")
  age = 0;
}
