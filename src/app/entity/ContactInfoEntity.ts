import { Entity } from "../../libs/entity/Entity";
import { Column, Dto, PrimaryKey } from "../../libs/entity/Dto";

@Entity("StudentsSpreadsheet", "ContactInfoTable", "ContactInfoEntity")
export class ContactInfoEntity extends Dto {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  city = "";
  @Column("C")
  phoneNumber = "";
}
