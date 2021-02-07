import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, JoinColumn, PrimaryKey } from "../../libs/entity/Dto";
import { EntityManager } from "../../libs/entity/EntityManager";
import { Professor } from "./Professor";

@Entity("MajorTable", "Major")
export class Major extends Dto {
  @PrimaryKey()
  @Column("A")
  id: string;
  @Column("B")
  name: string;
  @JoinColumn("C", "Professor")
  professor: Professor;
}

export const MajorInstance = new Major();
EntityManager.register("Major", Major);
