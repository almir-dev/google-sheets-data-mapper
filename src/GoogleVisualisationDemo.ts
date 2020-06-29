import { Student, StudentInstance } from "./api/entity/Student";
import { whereEq } from "./api/entity/Criteria";

class GoogleVisualisationDemoImpl {
  makeApiCall() {
    const criteria = whereEq(StudentInstance.name, "Stacy");

    Student.find(criteria, data => {
      console.log("WWW filtered data ", data);
    });
  }
}

export const GoogleVisualisationDemo = new GoogleVisualisationDemoImpl();
