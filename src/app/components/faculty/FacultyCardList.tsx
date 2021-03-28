import React from "react";
import { FacultyService } from "./FacultyService";
import { FacultyEntity } from "../../entity/FacultyEntity";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { FacultyCard } from "./FacultyCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
    }
  })
);

export function FacultyCardList() {
  const [facultyList, setFacultyList] = React.useState<FacultyEntity[]>([]);

  React.useEffect(() => {
    FacultyService.getAllFaculties().then(response => {
      setFacultyList(response);
    });
  }, []);

  const classes = useStyles();

  const cards = facultyList.map(faculty => {
    return (
      <Grid item>
        <FacultyCard faculty={faculty} />
      </Grid>
    );
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {cards}
      </Grid>
    </div>
  );
}
