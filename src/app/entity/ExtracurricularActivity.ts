import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "ExtracurricularActivityTable", "ExtracurricularActivity")
export class ExtracurricularActivity extends Dto {
  @Column("B")
  name = "";

  @PrimaryKey()
  @Column("A")
  id = "";
}

export const ExtracurricularActivityInstance = new ExtracurricularActivity();
