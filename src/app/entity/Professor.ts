import { Entity } from "../../datamapper/libs/entity/Entity";
import { Column, Dto, ManyToOne, PrimaryKey } from "../../datamapper/libs/entity/Dto";
import { DepartmentEntity } from "./DepartmentEntity";
import { ExtracurricularActivityEntity } from "./ExtracurricularActivityEntity";

@Entity("1Bswrjv8evr2PAP5Cmnfb3XbI5voxMeDwBdvLxurf-5A", "ProfessorTable", "ProfessorEntity")
export class ProfessorEntity extends Dto<ProfessorEntity> {
  @PrimaryKey()
  @Column("A")
  id = "";
  @Column("B")
  name = "";
  @Column("C")
  address = "";
  @ManyToOne("D", "DepartmentEntity")
  department = ({} as unknown) as DepartmentEntity;
  @ManyToOne("E", "ExtracurricularActivityEntity")
  eActivity = ({} as unknown) as ExtracurricularActivityEntity;
  @Column("F")
  age = 0;
}
