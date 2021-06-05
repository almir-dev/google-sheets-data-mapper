import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, ManyToOne, PrimaryKey } from "../../libs/entity/Dto";

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
  @ManyToOne("E", "ContactInfoEntity")
  contactInfo = {};
  @ManyToOne("F", "ExtracurricularActivityEntity")
  eActivity = {};
}

export const StudentInstance = new StudentEntity();
