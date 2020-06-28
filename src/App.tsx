import React from "react";
import "reflect-metadata";
import { Student } from "./api/entity/Student";

export class App extends React.Component {
  render() {
    return <button onClick={this.clickHandler}>{"Hello world!"}</button>;
  }

  private readonly clickHandler = () => {
    Student.findAll().then(response => {
      console.log("WWW result is ", response);
    });
  };
}

export default App;
