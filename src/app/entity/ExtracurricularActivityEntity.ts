import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "ExtracurricularActivityTable", "ExtracurricularActivityEntity")
export class ExtracurricularActivityEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";

  @Column("B")
  name = "";
}
