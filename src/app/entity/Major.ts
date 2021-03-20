import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";
import { Professor } from "./Professor";

@Entity("StudentsSpreadsheet", "MajorTable", "Major")
export class Major extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @JoinColumn("C", "Professor")
  professor = {};
}

export const MajorInstance = new Major();
