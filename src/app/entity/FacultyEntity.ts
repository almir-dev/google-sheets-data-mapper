import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "FacultyTable", "FacultyEntity")
export class FacultyEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @Column("C")
  shortName = "";
  @Column("D")
  image = "";
  @Column("E")
  phoneNumber = "";
  @Column("F")
  address = "";
  @Column("G")
  description = "";
}
