import { Entity } from "./Entity";
import { Column, Dto } from "./Dto";

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
