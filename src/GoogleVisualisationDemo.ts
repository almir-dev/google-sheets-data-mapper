import { Student } from "./api/entity/Student";

class GoogleVisualisationDemoImpl {
  makeApiCall() {
    Student.findAll(data => {
      console.log("WWW data", data);
    });
  }
}

export const GoogleVisualisationDemo = new GoogleVisualisationDemoImpl();
