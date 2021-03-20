import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "AddressTable", "Address")
export class Address extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  address = "";
}

export const AddressInstance = new Address();
