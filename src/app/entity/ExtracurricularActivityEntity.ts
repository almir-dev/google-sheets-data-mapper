import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, OneToMany, PrimaryKey } from "../../libs/entity/Dto";
import { ProfessorEntity } from "./Professor";

@Entity("StudentsSpreadsheet", "ExtracurricularActivityTable", "ExtracurricularActivityEntity")
export class ExtracurricularActivityEntity extends Dto<ExtracurricularActivityEntity> {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @OneToMany("eActivity", "ProfessorEntity")
  professors: ProfessorEntity[] = [];
}
