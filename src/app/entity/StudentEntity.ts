import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, ManyToOneColumn, PrimaryKey } from "../../libs/entity/Dto";

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
  @ManyToOneColumn("E", "ContactInfoEntity")
  contactInfo = {};
  @ManyToOneColumn("F", "ExtracurricularActivityEntity")
  eActivity = {};
}
