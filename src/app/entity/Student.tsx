import { Entity } from "../../libs/entity/Entity";
import { Column, Dto } from "../../libs/entity/Dto";

@Entity
export class Student extends Dto {
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
  @Column("F")
  major: string;
  @Column("G")
  eActivity: string;
}

export const StudentInstance = new Student();
