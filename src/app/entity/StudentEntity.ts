import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "StudentTable", "StudentEntity")
export class StudentEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @Column("C")
  gender = "";
  @Column("D")
  classLevel = "";
  @JoinColumn("E", "ContactInfoEntity")
  contactInfo = {};
  @JoinColumn("F", "ExtracurricularActivityEntity")
  eActivity = {};
}
