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

    Student.find(criteria).then(data => {
      console.log("WWW hahaha", data);
    });
  }
}

export const GoogleVisualisationDemo = new GoogleVisualisationDemoImpl();
