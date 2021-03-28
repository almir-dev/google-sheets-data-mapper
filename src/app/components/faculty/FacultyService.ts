import { FacultyEntity } from "../../entity/FacultyEntity";

class FacultyServiceImpl {
  getAllFaculties(): Promise<FacultyEntity[]> {
    if (!this.isProdEnv()) {
      return Promise.resolve(createMockFaculties());
    }

    return FacultyEntity.findAll();
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

export const FacultyService = new FacultyServiceImpl();
