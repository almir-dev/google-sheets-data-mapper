import { Column, Dto, Entity } from "./EntityDescriptor";

@Entity
export class Student extends Dto {
  @Column("Student Name")
  name: string;
  @Column("Gender")
  gender: string;
  @Column("Class Level")
  classLevel: string;
  @Column("Home State")
  homeState: string;
  @Column("Major")
  major: string;
  @Column("Extracurricular Activity")
  eActivity: string;
}
