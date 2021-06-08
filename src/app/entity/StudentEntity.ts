import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, ManyToOne, PrimaryKey } from "../../libs/entity/Dto";
import { ContactInfoEntity } from "./ContactInfoEntity";

@Entity("1Bswrjv8evr2PAP5Cmnfb3XbI5voxMeDwBdvLxurf-5A", "StudentTable", "StudentEntity")
export class StudentEntity extends Dto<StudentEntity> {
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
  contactInfo = ({} as unknown) as ContactInfoEntity;
  @ManyToOne("F", "ExtracurricularActivityEntity")
  eActivity = {};
}

export const StudentInstance = new StudentEntity();
