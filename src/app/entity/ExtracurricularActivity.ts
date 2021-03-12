import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, PrimaryKey } from "../../libs/entity/Dto";
import { EntityManager } from "../../libs/entity/EntityManager";

@Entity("ExtracurricularActivityTable", "ExtracurricularActivity")
export class ExtracurricularActivity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
}

export const ExtracurricularActivityInstance = new ExtracurricularActivity();
EntityManager.register("ExtracurricularActivity", ExtracurricularActivity);
