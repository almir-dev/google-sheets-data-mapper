import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";
import { ExtracurricularActivity } from "./ExtracurricularActivity";
import { EntityManager } from "../../libs/entity/EntityManager";
import { Major } from "./Major";

@Entity("StudentTable", "Student")
export class Student extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @Column("C")
  gender = "";
  @Column("D")
  classLevel = "";
  @Column("E")
  homeState = "";
  @JoinColumn("F", "Major")
  major = {};
  @JoinColumn("G", "ExtracurricularActivity")
  eActivity = {};
}

export const StudentInstance = new Student();
