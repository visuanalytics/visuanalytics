import React from "react";
import {useStyles} from "../style";
import {Collapse, Grid, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {DiagramInfo} from "../../types";


interface DiagramListProps {
    diagramList: Array<DiagramInfo>
    handleDiagramClick: () => void;
}

export const DiagramList: React.FC<DiagramListProps> = (props) => {

    const classes = useStyles();
    // true if the background image section is shown (used for collapse)
    const [showDiagrams, setShowDiagrams] = React.useState(false);

    /**
     * Method that renders a single entry in the list of all available diagrams
     * @param diagram The object containing the diagrams information.
     * @param index The index of the image (used to make keys unique)
     */
    const renderDiagramEntry = (diagram: DiagramInfo, index: number) => {
        return (
            <Grid key={diagram.name} item container xs={6} justify="space-around" className={index === 0 ? classes.firstImage : index === 1 ? classes.secondImage : index % 2 === 0 ? classes.leftImage : classes.rightImage}>
                <Grid item xs={10}>
                    <img src={diagram.url} className={classes.imageInList} alt={"Image Nr." +  index} onClick={() => /*props.handleDiagramClick()*/ console.log("DIAGRAM CLICK EVENT YET TO BE IMPLEMENTED!!!")}/>
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="body1">
                        diagram.name
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="body1">
                        diagram.type
                    </Typography>
                </Grid>
            </Grid>
        )
    }



    return (
        <React.Fragment>
            <Grid item container xs={12} className={classes.elementExtraLargeMargin}>
                <Grid item xs={10}>
                    <Typography variant={"h4"} align={"center"}>
                        DIAGRAMME
                    </Typography><br/>
                </Grid>
                <Grid item xs={2}>
                    {!showDiagrams &&
                    <IconButton aria-label="Diagramm-Liste ausklappen" onClick={() => setShowDiagrams(!showDiagrams)}>
                        <ExpandMore/>
                    </IconButton>
                    }
                    {showDiagrams &&
                    <IconButton aria-label="Diagramm-Liste einklappen" onClick={() => setShowDiagrams(!showDiagrams)}>
                        <ExpandLess/>
                    </IconButton>
                    }
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Collapse in={showDiagrams} className={classes.fullWidthCollapse}>
                    <Grid item container xs={12} className={classes.elementLargeMargin}>
                        {props.diagramList.map((diagram, index) => renderDiagramEntry(diagram, index))}
                    </Grid>
                </Collapse>
            </Grid>
        </React.Fragment>
    )
}
