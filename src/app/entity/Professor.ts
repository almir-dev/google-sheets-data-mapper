import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";
import { EntityManager } from "../../libs/entity/EntityManager";
import { Address } from "./Address";

@Entity("ProfessorTable", "Professor")
export class Professor extends Dto {
  @PrimaryKey()
  @Column("A")
  id: string;
  @Column("B")
  name: string;
  @JoinColumn("C", "Address")
  address: Address;
}

export const ProfessorInstance = new Professor();
EntityManager.register("Professor", Professor);
