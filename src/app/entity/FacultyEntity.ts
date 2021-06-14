import { Entity } from "../../datamapper/libs/entity/Entity";
import { Column, Dto, OneToMany, PrimaryKey } from "../../datamapper/libs/entity/Dto";
import { DepartmentEntity } from "./DepartmentEntity";

@Entity("1Bswrjv8evr2PAP5Cmnfb3XbI5voxMeDwBdvLxurf-5A", "FacultyTable", "FacultyEntity")
export class FacultyEntity extends Dto<FacultyEntity> {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @Column("C")
  shortName = "";
  @Column("D")
  image = "";
  @Column("E")
  phoneNumber = "";
  @Column("F")
  address = "";
  @Column("G")
  description = "";
  @OneToMany("faculty", "DepartmentEntity")
  departments: DepartmentEntity[] = [];
}
