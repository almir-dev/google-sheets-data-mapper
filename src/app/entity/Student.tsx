import { Entity } from "../../libs/entity/Entity";
import { Column, Dto } from "../../libs/entity/Dto";

@Entity
export class Student extends Dto {
  @Column("Student Name", "A")
  name: string;
  @Column("Gender", "B")
  gender: string;
  @Column("Class Level", "C")
  classLevel: string;
  @Column("Home State", "D")
  homeState: string;
  @Column("Major", "E")
  major: string;
  @Column("Extracurricular Activity", "F")
  eActivity: string;
}

export const StudentInstance = new Student();
