import style from "./StudentView.module.scss";
import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

export function Filters() {
  const [studentNames, setStudentName] = React.useState<string[]>([]);
  React.useEffect(() => {}, []);

  return <FilterContent studentNames={studentNames} />;
}

interface FilterContentProps {
  studentNames: string[];
}

export function FilterContent({ studentNames }: FilterContentProps) {
  return (
    <div className={style.filterSection}>
      <Autocomplete
        options={studentNames}
        getOptionLabel={option => option}
        style={{ width: 300 }}
        id="debug"
        renderInput={params => <TextField {...params} label="Student Name" margin="normal" />}
      />
    </div>
  );
}
