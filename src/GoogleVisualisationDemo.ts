import { Student, StudentInstance } from "./api/entity/Student";
import { and, or, whereEq } from "./api/entity/QueryOperation";

class GoogleVisualisationDemoImpl {
  makeApiCall() {
    const criteria = and(
      or(
        whereEq(StudentInstance.name, "Stacy"),
        whereEq(StudentInstance.name, "Olivia")
      ),
      whereEq(StudentInstance.homeState, "NY")
    );

    Student.find(criteria, data => {
      console.log("WWW filtered data ", data);
    });
  }
}

export const GoogleVisualisationDemo = new GoogleVisualisationDemoImpl();
