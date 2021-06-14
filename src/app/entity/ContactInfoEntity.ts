import { Entity } from "../../datamapper/libs/entity/Entity";
import { Column, Dto, PrimaryKey } from "../../datamapper/libs/entity/Dto";

@Entity("1Bswrjv8evr2PAP5Cmnfb3XbI5voxMeDwBdvLxurf-5A", "ContactInfoTable", "ContactInfoEntity")
export class ContactInfoEntity extends Dto<ContactInfoEntity> {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  city = "";
  @Column("C")
  phoneNumber = "";
}

export const ContactInfoInstance = new ContactInfoEntity();
