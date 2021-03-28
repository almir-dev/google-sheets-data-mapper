import { StudentEntity } from "../../entity/StudentEntity";
import { ExtracurricularActivityEntity } from "../../entity/ExtracurricularActivityEntity";
import { ContactInfoEntity } from "../../entity/ContactInfoEntity";

class StudentServiceImpl {
  getAllStudents(): Promise<StudentEntity[]> {
    if (!this.isProdEnv()) {
      return Promise.resolve(createMockStudents());
    }
    return StudentEntity.findAll();
  }

  private isProdEnv(): boolean {
    return process.env.NODE_ENV === "production";
  }
}

function createMockStudents(): StudentEntity[] {
  const students: StudentEntity[] = [];

  const eActivity1 = createEActivity("id1", "Debate Club");
  const eActivity2 = createEActivity("id2", "Baseball Club");
  const eActivity3 = createEActivity("id3", "Chess Club");
  const eActivity4 = createEActivity("id4", "Football Club");
  const eActivity5 = createEActivity("id5", "Tennis Club");

  const contactInfo1 = createContactInfo("id1", "Los Angeles", "661-347-7374");
  const contactInfo2 = createContactInfo("id2", "Bridgeport", "203-373-0554");
  const contactInfo3 = createContactInfo("id3", "Dunwoody", "404-648-2927");
  const contactInfo4 = createContactInfo("id4", "Fullerton", "714-626-3491");
  const contactInfo5 = createContactInfo("id5", "Phoenix", "630-864-3425");
  const contactInfo6 = createContactInfo("id6", "Chicago", "601-964-1971");
  const contactInfo7 = createContactInfo("id7", "Pittsburgh", "323-776-6461");
  const contactInfo8 = createContactInfo("id8", "Tallahassee", "802-244-5134");
  const contactInfo9 = createContactInfo("id9", "Waterbury", "802-244-5134");
  const contactInfo10 = createContactInfo("id10", "Palm Springs", "612-231-6363");
  const contactInfo11 = createContactInfo("id11", "Union City", "201-770-9061");
  const contactInfo12 = createContactInfo("id12", "Stonewall", "203-396-1889");
  const contactInfo13 = createContactInfo("id13", "Baltimore", "443-331-3367");
  const contactInfo14 = createContactInfo("id14", "Southfield", "248-447-9388");
  const contactInfo15 = createContactInfo("id15", "Richmond", "608-604-2862");
  const contactInfo16 = createContactInfo("id16", "Madison", "528-524-1345");

  const student1 = createStudent("id1", "Stacy", "Female", "1. Freshman", eActivity1, contactInfo1);
  const student2 = createStudent("id2", "Pamela", "Female", "3. Junior", eActivity2, contactInfo2);
  const student3 = createStudent("id3", "Olivia", "Female", "3. Junior", eActivity3, contactInfo3);
  const student4 = createStudent("id4", "Maureen", "Female", "4. Senior", eActivity4, contactInfo4);
  const student5 = createStudent("id5", "Mary", "Female", "1. Freshman", eActivity5, contactInfo5);
  const student6 = createStudent("id6", "Lisa", "Female", "2. Sophomore", eActivity1, contactInfo6);
  const student7 = createStudent("id7", "Karen", "Female", "3. Junior", eActivity2, contactInfo7);
  const student8 = createStudent("id8", "Josephine", "Female", "2. Sophomore", eActivity3, contactInfo8);
  const student9 = createStudent("id9", "Fiona", "Female", "1. Freshman", eActivity4, contactInfo9);
  const student10 = createStudent("id10", "Ellen", "Female", "1. Freshman", eActivity5, contactInfo10);
  const student11 = createStudent("id11", "Dorothy", "Female", "4. Senior", eActivity1, contactInfo11);
  const student12 = createStudent("id12", "Carrie", "Female", "3. Junior", eActivity2, contactInfo12);
  const student13 = createStudent("id13", "Becky", "Female", "2. Sophomore", eActivity3, contactInfo13);
  const student14 = createStudent("id14", "Anna", "Female", "1. Freshman", eActivity4, contactInfo14);
  const student15 = createStudent("id15", "Jack", "Male", "4. Senior", eActivity5, contactInfo15);
  const student16 = createStudent("id16", "Almir", "Male", "4. Senior", eActivity1, contactInfo16);

  return [
    student1,
    student2,
    student3,
    student4,
    student5,
    student6,
    student7,
    student8,
    student9,
    student10,
    student11,
    student12,
    student13,
    student14,
    student15,
    student16
  ];
}

function createStudent(
  id: string,
  name: string,
  gender: string,
  classLevel: string,
  eActivity: ExtracurricularActivityEntity,
  contactInfo: ContactInfoEntity
): StudentEntity {
  const student = new StudentEntity();

  student.id = id;
  student.name = name;
  student.gender = gender;
  student.classLevel = classLevel;
  student.contactInfo = contactInfo;
  student.eActivity = eActivity;

  return student;
}

function createEActivity(id: string, name: string): ExtracurricularActivityEntity {
  const eActivity = new ExtracurricularActivityEntity();
  eActivity.id = id;
  eActivity.name = name;
  return eActivity;
}

function createContactInfo(id: string, city: string, phoneNumber: string): ContactInfoEntity {
  const contactInfoEntity = new ContactInfoEntity();
  contactInfoEntity.id = id;
  contactInfoEntity.city = city;
  contactInfoEntity.phoneNumber = phoneNumber;

  return contactInfoEntity;
}

export const StudentService = new StudentServiceImpl();
