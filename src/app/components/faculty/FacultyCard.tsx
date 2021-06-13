import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FacultyEntity } from "../../entity/FacultyEntity";
import { FacultyService } from "./FacultyService";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 450
    },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: red[500]
    },
    description: {
      minHeight: 140
    },
    block: {
      display: "block"
    }
  })
);

export function FacultyCard({ faculty }: { faculty: FacultyEntity }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const [departmentNames, setDepartmentNames] = React.useState<string[]>([]);
  const [professorNames, setProfessorNames] = React.useState<string[]>([]);
  const [facultyClasses, setFacultyClasses] = React.useState<string[]>([]);

  React.useEffect(() => {
    FacultyService.getDepartmentNames(faculty.id).then(result => {
      setDepartmentNames(result);
    });

    FacultyService.getProfessorNames(faculty.id).then(result => {
      setProfessorNames(result);
    });

    FacultyService.getClassNames(faculty.id).then(result => {
      setFacultyClasses(result);
    });
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { name, phoneNumber, address, shortName, image, description } = faculty;

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {shortName}
          </Avatar>
        }
        title={name}
        subheader={address}
      />
      <CardMedia className={classes.media} image={image} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p" className={classes.description}>
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Status: </Typography>
          <Typography paragraph>
            Departments:
            <DataList data={departmentNames} />
          </Typography>
          <Typography paragraph>
            Professors:
            <DataList data={professorNames} />
          </Typography>
          <Typography paragraph>
            Classes:
            <DataList data={facultyClasses} />
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export function DataList({ data }: { data: string[] }) {
  const classes = useStyles();

  const components = data.map(element => {
    return (
      <span key={element} className={classes.block}>
        {element}
      </span>
    );
  });

  return <>{components}</>;
}
