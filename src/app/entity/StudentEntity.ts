import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, OneToOneColumn, PrimaryKey } from "../../libs/entity/Dto";

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
  @OneToOneColumn("E", "ContactInfoEntity")
  contactInfo = {};
  @OneToOneColumn("F", "ExtracurricularActivityEntity")
  eActivity = {};
}
