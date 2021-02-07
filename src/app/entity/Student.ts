import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";
import { ExtracurricularActivity } from "./ExtracurricularActivity";
import { EntityManager } from "../../libs/entity/EntityManager";
import { Major } from "./Major";

@Entity("StudentTable", "Student")
export class Student extends Dto {
  @PrimaryKey()
  @Column("A")
  id: string;
  @Column("B")
  name: string;
  @Column("C")
  gender: string;
  @Column("D")
  classLevel: string;
  @Column("E")
  homeState: string;
  @JoinColumn("F", "Major")
  major: Major;
  @JoinColumn("G", "ExtracurricularActivity")
  eActivity: ExtracurricularActivity;
}

export const StudentInstance = new Student();
EntityManager.register("Student", Student);
