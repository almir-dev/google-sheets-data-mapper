import React from "react";
import "reflect-metadata";
import { GoogleVisualisationDemo } from "./GoogleVisualisationDemo";

export class App extends React.Component {
  render() {
    return <button onClick={this.clickHandler}>{"Hello world!"}</button>;
  }

  private readonly clickHandler = () => {
    GoogleVisualisationDemo.makeApiCall();
  };
}

export default App;
