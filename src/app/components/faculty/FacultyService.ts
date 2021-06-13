import { FacultyEntity } from "../../entity/FacultyEntity";
import { DepartmentEntity } from "../../entity/DepartmentEntity";
import { ProfessorEntity } from "../../entity/Professor";
import { ClassEntity } from "../../entity/ClassEntity";

class FacultyServiceImpl {
  getAllFaculties(): Promise<FacultyEntity[]> {
    if (!this.isProdEnv()) {
      return Promise.resolve(createMockFaculties());
    }

    return FacultyEntity.findAll();
  }

  getDepartmentNames(facultyId: string): Promise<string[]> {
    if (!this.isProdEnv()) {
      const departments = createMockDepartments();
      const names = departments.filter(d => d.faculty.id === facultyId).map(d => d.name);
      return Promise.resolve(names);
    }

    return DepartmentEntity.findAll<DepartmentEntity>().then((result: DepartmentEntity[]) => {
      const facultyDepartments = result.filter(dep => dep.faculty.id === facultyId);
      return facultyDepartments.map(dep => dep.name);
    });
  }

  getProfessorNames(facultyId: string): Promise<string[]> {
    if (!this.isProdEnv()) {
      const mockDepartments = createMockDepartments();
      const mockProfessors = createMockProfessors();

      const departmentIds = mockDepartments.filter(d => d.faculty.id === facultyId).map(d => d.id);
      const names = mockProfessors.filter(p => departmentIds.indexOf(p.id) !== -1).map(p => p.name);
      return Promise.resolve(names);
    }

    return DepartmentEntity.findAll<DepartmentEntity>().then(departments => {
      const departmentIds = departments.filter(d => d.faculty.id === facultyId).map(d => d.id);
      return ProfessorEntity.findAll<ProfessorEntity>().then(professors => {
        return professors.filter(p => departmentIds.indexOf(p.department.id) !== -1).map(p => p.name);
      });
    });
  }

  getClassNames(facultyId: string): Promise<string[]> {
    if (!this.isProdEnv()) {
      const mockDepartments = createMockDepartments();
      const mockClasses = createMockClasses();

      const departmentIds = mockDepartments.filter(d => d.faculty.id === facultyId).map(d => d.id);
      const names = mockClasses.filter(c => departmentIds.indexOf(c.id) !== -1).map(c => c.name);
      return Promise.resolve(names);
    }

    return DepartmentEntity.findAll<DepartmentEntity>().then(departments => {
      const departmentIds = departments.filter(d => d.faculty.id === facultyId).map(d => d.id);
      return ClassEntity.findAll<ProfessorEntity>().then(clazz => {
        return clazz.filter(c => departmentIds.indexOf(c.department.id) !== -1).map(c => c.name);
      });
    });
  }

  getNumberOfStudents(facultyId: string): Promise<number> {
    return Promise.resolve(0);
  }

  private isProdEnv(): boolean {
    return process.env.NODE_ENV === "production";
  }
}

function createMockFaculties(): FacultyEntity[] {
  const faculty1 = createFaculty(
    "id1",
    "Faculty Of Electrical Engineering",
    "2970 Church Street (NY)",
    "5551234",
    "EE",
    "https://uploads.sarvgyan.com/2014/06/electrical-engineering-image.jpg",
    "Electrical engineering is an engineering discipline concerned with the study, design and application of equipment, devices and systems which use electricity, electronics, and electromagnetism. It emerged as an identifiable occupation in the latter half of the 19th century after commercialization of the electric telegraph, the telephone, and electrical power generation, distribution and use."
  );
  const faculty2 = createFaculty(
    "id2",
    "Faculty Of Computer Science",
    "3013 Poe Road (SC)",
    "6661234",
    "CS",
    "https://www.computersciencedegreehub.com/wp-content/uploads/2020/06/How-Much-Overlap-is-There-Between-Computer-Science-and-Data-Science-768x512.jpg",
    "Computer science is the study of algorithmic processes, computational machines and computation itself.[1] As a discipline, computer science spans a range of topics from theoretical studies of algorithms, computation and information to the practical issues of implementing computational systems in hardware and software."
  );
  const faculty3 = createFaculty(
    "id3",
    "Faculty Of Physics",
    "626 Tyler Avenue (FL)",
    "7771234",
    "P",
    "https://www.environmentalscience.org/wp-content/uploads/2018/08/physics-300x300.jpg",
    "Physics is the branch of science that deals with the structure of matter and how the fundamental constituents of the universe interact. It studies objects ranging from the very small using quantum mechanics to the entire universe using general relativity."
  );
  const faculty4 = createFaculty(
    "id4",
    "Faculty Of Math",
    "463 Butternut Lane (IL)",
    "8881234",
    "M",
    "https://i.pinimg.com/564x/c8/e5/75/c8e5753370bad54c7977d485e0a0e29d.jpg",
    "Mathematics includes the study of such topics as quantity, structure, space, and change. It has no generally accepted definition. Mathematicians seek and use patterns to formulate new conjectures; they resolve the truth or falsity of such by mathematical proof"
  );
  const faculty5 = createFaculty(
    "id5",
    "Faculty Of Art",
    "4196 Boone Crockett Lane (WA)",
    "9991234",
    "A",
    "https://images.theconversation.com/files/296052/original/file-20191008-128681-ngzwqb.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=600&h=599&fit=crop&dpr=1",
    "Art is a diverse range of human activities involving the conscious use of creative imagination to express technical proficiency, beauty, emotional power, or conceptual ideas. There is no generally agreed definition of what constitutes art, and ideas have changed over time."
  );
  const faculty6 = createFaculty(
    "id6",
    "Faculty Of Drama",
    "2704 Hillhaven Drive (CA)",
    "11111234",
    "D",
    "https://www.teachwire.net/uploads/news/iStock-856395646_1.jpg",
    "Drama is the specific mode of fiction represented in performance: a play, opera, mime, ballet, etc., performed in a theatre, or on radio or television"
  );
  const faculty7 = createFaculty(
    "id7",
    "Faculty Of Sport ",
    "1934 Ocello Street (CA)",
    "22221234",
    "S",
    "http://glastk.ba/wp-content/uploads/2021/02/sport.jpeg",
    "Sport pertains to any form of competitive physical activity or game that aims to use, maintain or improve physical ability and skills while providing enjoyment to participants and, in some cases, entertainment to spectators. Sports can, through casual or organized participation, improve one's physical health."
  );

  return [faculty1, faculty2, faculty3, faculty4, faculty5, faculty6, faculty7];
}

function createFaculty(
  id: string,
  name: string,
  address: string,
  phoneNumber: string,
  shortName: string,
  image: string,
  description: string
): FacultyEntity {
  const faculty = new FacultyEntity();

  faculty.id = id;
  faculty.name = name;
  faculty.address = address;
  faculty.phoneNumber = phoneNumber;
  faculty.shortName = shortName;
  faculty.image = image;
  faculty.description = description;

  return faculty;
}

function createMockDepartments(): DepartmentEntity[] {
  const faculties = createMockFaculties();

  const department1 = createDepartment("id1", "Department Of Telecomunications", faculties[1]);
  const department2 = createDepartment("id2", "Department Of Applied Computer Science", faculties[1]);
  const department3 = createDepartment("id3", "Department Of Theoretical Math", faculties[3]);
  const department4 = createDepartment("id4", "Department Of Applied Math", faculties[3]);
  const department5 = createDepartment("id5", "Department Of Theoretical Physics", faculties[2]);
  const department6 = createDepartment("id6", "Department Of Applied Physcis", faculties[2]);
  const department7 = createDepartment("id7", "Department Of Theoretical Sport", faculties[6]);
  const department8 = createDepartment("id8", "Department Of Applied Sport", faculties[6]);
  const department9 = createDepartment("id9", "Department Of Strong Current", faculties[0]);
  const department10 = createDepartment("id10", "Department Of Filmindustry", faculties[4]);
  const department11 = createDepartment("id11", "Department Of Drama", faculties[5]);

  return [
    department1,
    department2,
    department3,
    department4,
    department6,
    department7,
    department8,
    department9,
    department10,
    department11
  ];
}

function createDepartment(id: string, name: string, faculty: FacultyEntity): DepartmentEntity {
  const department = new DepartmentEntity();

  department.id = id;
  department.name = name;
  department.faculty = faculty;

  return department;
}

function createMockProfessors(): ProfessorEntity[] {
  const mockDepartments = createMockDepartments();

  const professor1 = createProfessor("id1", "Dr. Jack Anderson", "4607 Watson Street (NJ)", mockDepartments[9]);
  const professor2 = createProfessor("id2", "Dr. Edward Jones", "222 Arthur Avenue (IL)", mockDepartments[8]);
  const professor3 = createProfessor("id3", "Dr. Elizabeth Swan", "4656 Fulton Street (WV)", mockDepartments[0]);
  const professor4 = createProfessor("id4", "Dr. Mary Jenkins", "3021 Woodstock Drive (CA)", mockDepartments[1]);
  const professor5 = createProfessor("id5", "Dr. Alex Vance", "3485 Ashcraft Court (CA)", mockDepartments[2]);
  const professor6 = createProfessor("id6", "Dr. Gordon Freeman", "1663 Wildrose Lane (MI)", mockDepartments[4]);
  const professor7 = createProfessor("id", "Dr. Wallace Breen", "3543 Five Points (MD)", mockDepartments[3]);
  const professor8 = createProfessor("id8", "Dr. Barney Coulhun", "2818 Briercliff Road (NY)", mockDepartments[5]);
  const professor9 = createProfessor("id9", "Dr. Judith Mossman", "1852 Wood Street (CA)", mockDepartments[6]);
  const professor10 = createProfessor("id10", "Dr. Isac Kleiner", "4572 Saint Marys Avenue (NY)", mockDepartments[7]);
  const professor11 = createProfessor("id11", "Dr. Richard Keller", "2455 Cimmaron Road (CA)", mockDepartments[10]);

  return [
    professor1,
    professor2,
    professor3,
    professor4,
    professor5,
    professor6,
    professor7,
    professor8,
    professor9,
    professor10,
    professor11
  ];
}

function createProfessor(id: string, name: string, address: string, department: DepartmentEntity): ProfessorEntity {
  const professor = new ProfessorEntity();

  professor.id = id;
  professor.name = name;
  //professor.department = department;
  professor.address = address;

  return professor;
}

function createMockClasses(): ClassEntity[] {
  const departments = createMockDepartments();
  const professors = createMockProfessors();

  const clazz1 = createClass("id1", "Telecomunications 101", departments[0], professors[0]);
  const clazz2 = createClass("id2", "Applied Computer Science 101", departments[1], professors[1]);
  const clazz3 = createClass("id3", "Theoretical Math 1", departments[2], professors[4]);
  const clazz4 = createClass("id4", "Applied Math In Engineering", departments[3], professors[7]);
  const clazz5 = createClass("id5", "Theoretical Physics 101", departments[4], professors[2]);
  const clazz6 = createClass("id6", "Applied Physics 101", departments[5], professors[8]);
  const clazz7 = createClass("id7", "Basic Tennis", departments[7], professors[6]);
  const clazz8 = createClass("id8", "Film Expenses 101", departments[9], professors[7]);
  const clazz9 = createClass("id9", "Drama 101", departments[10], professors[5]);

  return [clazz1, clazz2, clazz3, clazz4, clazz5, clazz6, clazz7, clazz8, clazz9];
}

function createClass(id: string, name: string, department: DepartmentEntity, professor: ProfessorEntity): ClassEntity {
  const clazz = new ClassEntity();

  clazz.id = id;
  clazz.name = name;
  clazz.department = department;
  clazz.professor = professor;

  return clazz;
}

export const FacultyService = new FacultyServiceImpl();
