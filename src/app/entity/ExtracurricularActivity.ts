import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "ExtracurricularActivityTable", "ExtracurricularActivity")
export class ExtracurricularActivity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
}

export const ExtracurricularActivityInstance = new ExtracurricularActivity();
