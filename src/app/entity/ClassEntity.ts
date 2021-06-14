import { Entity } from "../../datamapper/libs/entity/Entity";
import { Column, Dto, ManyToOne, PrimaryKey } from "../../datamapper/libs/entity/Dto";
import { ProfessorEntity } from "./Professor";
import { DepartmentEntity } from "./DepartmentEntity";

@Entity("1Bswrjv8evr2PAP5Cmnfb3XbI5voxMeDwBdvLxurf-5A", "ClassTable", "ClassEntity")
export class ClassEntity extends Dto<ClassEntity> {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @ManyToOne("C", "DepartmentEntity")
  department: DepartmentEntity = ({} as unknown) as DepartmentEntity;
  @ManyToOne("D", "ProfessorEntity")
  professor: ProfessorEntity = ({} as unknown) as ProfessorEntity;
}
