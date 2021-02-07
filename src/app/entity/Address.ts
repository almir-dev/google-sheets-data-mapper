import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, PrimaryKey } from "../../libs/entity/Dto";
import { EntityManager } from "../../libs/entity/EntityManager";

@Entity("AddressTable", "Address")
export class Address extends Dto {
  @PrimaryKey()
  @Column("A")
  id: string;
  @Column("B")
  address: string;
}

export const AddressInstance = new Address();
EntityManager.register("Address", Address);
