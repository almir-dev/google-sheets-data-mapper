import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, PrimaryKey } from "../../libs/entity/Dto";
import { EntityManager } from "../../libs/entity/EntityManager";

@Entity("AddressTable", "Address")
export class Address extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  address = "";
}

export const AddressInstance = new Address();
EntityManager.register("Address", Address);
