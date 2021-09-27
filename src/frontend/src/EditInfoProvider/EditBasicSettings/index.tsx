import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useStyles } from "../style";
import {
  ArrayProcessingData,
  Diagram,
  ListItemRepresentation,
  Schedule,
  SelectedDataItem,
  StringReplacementData,
} from "../../CreateInfoProvider/types";
import { BasicSettings } from "../../CreateInfoProvider/BasicSettings";
import { FormelObj } from "../../CreateInfoProvider/DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";

interface EditBasicSettingsProps {
  continueHandler: (index: number) => void;
  backHandler: (index: number) => void;
  checkNameDuplicate: (name: string) => boolean;
  query: string;
  setQuery: (query: string) => void;
  apiKeyInput1: string;
  setApiKeyInput1: (key: string) => void;
  apiKeyInput2: string;
  setApiKeyInput2: (key: string) => void;
  noKey: boolean;
  setNoKey: (noKey: boolean) => void;
  method: string;
  setMethod: (method: string) => void;
  apiName: string;
  setApiName: (apiName: string) => void;
  reportError: (message: string) => void;
  setSelectedData: (selectedData: SelectedDataItem[]) => void;
  setCustomData: (customData: FormelObj[]) => void;
  setHistorizedData: (historizedData: string[]) => void;
  setSchedule: (schedule: Schedule) => void;
  setHistorySelectionStep: (historySelectionStep: number) => void;
  diagrams: Array<Diagram>;
  setDiagrams: (diagrams: Array<Diagram>) => void;
  setListItems: (array: Array<ListItemRepresentation>) => void;
  setArrayProcessingsList: (processings: Array<ArrayProcessingData>) => void;
  setStringReplacementList: (
    replacements: Array<StringReplacementData>
  ) => void;
}

export const EditBasicSettings: React.FC<EditBasicSettingsProps> = (props) => {
  const classes = useStyles();

  // Saving old values of states. This is needed when the user clickes the back button
  const [oldApiName] = React.useState(props.apiName);
  const [oldQuery] = React.useState(props.query);
  const [oldMethod] = React.useState(props.method);
  const [oldApiKeyInput1] = React.useState(props.apiKeyInput1);
  const [oldApiKeyInput2] = React.useState(props.apiKeyInput2);
  const [oldNoKey] = React.useState(props.noKey);

  // This state is needed to open or close the dialog when the user goes back
  const [openBackDialog, setOpenBackDialog] = React.useState(false);

  /**
   * This method proceeds to the next component
   */
  const continueHandler = () => {
    props.continueHandler(1);
  };

  /**
   * This method checks if there were any changes to the settings in the basic settings
   * If yes it opens a dialog
   * If not, it goes back one step in the process of editing an infoprovider
   */
  const backHandler = () => {
    if (dataHasChanged()) setOpenBackDialog(true);
    else props.backHandler(1);
  };

  /**
   * This method is used to go back, if the dialog was shown
   * This method gets called by the button in the dialog
   */
  const confirmBack = () => {
    props.setApiName(oldApiName);
    props.setNoKey(oldNoKey);
    props.setApiKeyInput1(oldApiKeyInput1);
    props.setApiKeyInput2(oldApiKeyInput2);
    props.setMethod(oldMethod);
    props.setQuery(oldQuery);
    setOpenBackDialog(false);
    props.backHandler(1);
  };

  /**
   * Checks if any data has changed
   * The states beginning with the word "old" are compared against the current values
   */
  const dataHasChanged = () => {
    return (
      oldApiName !== props.apiName ||
      oldQuery !== props.query ||
      oldMethod !== props.method ||
      oldApiKeyInput1 !== props.apiKeyInput1 ||
      oldApiKeyInput2 !== props.apiKeyInput2 ||
      oldNoKey !== props.noKey
    );
  };
  return (
    <React.Fragment>
      <BasicSettings
        continueHandler={continueHandler}
        backHandler={backHandler}
        checkNameDuplicate={props.checkNameDuplicate}
        query={props.query}
        setQuery={props.setQuery}
        apiKeyInput1={props.apiKeyInput1}
        setApiKeyInput1={props.setApiKeyInput1}
        apiKeyInput2={props.apiKeyInput2}
        setApiKeyInput2={props.setApiKeyInput2}
        noKey={props.noKey}
        setNoKey={props.setNoKey}
        method={props.method}
        setMethod={props.setMethod}
        apiName={props.apiName}
        setApiName={props.setApiName}
        reportError={props.reportError}
        setSelectedData={props.setSelectedData}
        setCustomData={props.setCustomData}
        setHistorizedData={props.setHistorizedData}
        setSchedule={props.setSchedule}
        setHistorySelectionStep={props.setHistorySelectionStep}
        diagrams={props.diagrams}
        setDiagrams={props.setDiagrams}
        setListItems={props.setListItems}
        setArrayProcessingsList={props.setArrayProcessingsList}
        setStringReplacementList={props.setStringReplacementList}
        isInEditMode={true}
      />
      <Dialog
        onClose={() => setOpenBackDialog(false)}
        aria-labelledby="backDialog"
        open={openBackDialog}
      >
        <DialogTitle id="backDialog-Title">Änderungen verwerfen?</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Wenn Sie zurück gehen, gehen ihre hier eingestellten Änderungen
            verloren.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Grid container justify="space-between">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenBackDialog(false)}
              >
                nein, nicht zurück gehen
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={confirmBack}
                className={classes.redButton}
              >
                ja, zurück gehen
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
