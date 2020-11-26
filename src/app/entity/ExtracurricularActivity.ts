import { Entity } from "../../libs/entity/Entity";
import { Column, Dto } from "../../libs/entity/Dto";

@Entity("ExtracurricularActivityTable")
export class ExtracurricularActivity extends Dto {
  @Column("A")
  id: string;
  @Column("B")
  name: string;
}

export const ExtracurricularActivityInstance = new ExtracurricularActivity();
