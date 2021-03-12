import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";
import { EntityManager } from "../../libs/entity/EntityManager";
import { Address } from "./Address";

@Entity("ProfessorTable", "Professor")
export class Professor extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @JoinColumn("C", "Address")
  address = {};
}

export const ProfessorInstance = new Professor();
EntityManager.register("Professor", Professor);
