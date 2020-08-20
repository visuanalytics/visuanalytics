import React, { useEffect } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { useStyles } from "./style";
import { ContinueButton } from "./ContinueButton";
import { BackButton } from "./BackButton";
import { ParamSelection } from "./ParamSelection";
import { TopicSelection, Topic } from "./TopicSelection";
import { GreyDivider } from "./GreyDivider";
import {
  Param,
  ParamValues,
  trimParamValues,
  getInvalidParamValues,
  initSelectedValues,
  toTypedValues,
} from "../util/param";
import { Fade, Grid, Typography } from "@material-ui/core";
import { useCallFetch } from "../Hooks/useCallFetch";
import {
  Schedule,
  withFormattedDates,
  validateSchedule,
} from "../util/schedule";
import { getUrl } from "../util/fetchUtils";
import { HintButton } from "../util/HintButton";
import { ComponentContext } from "../ComponentProvider";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { DeleteSchedule } from "../util/deleteSchedule";
import { SettingsPage } from "../util/SettingsPage";
import { hintContents } from "../util/hintContents";
import { Notification, notifcationReducer } from "../util/Notification";

export default function JobCreate() {
  const classes = useStyles();
  const components = React.useContext(ComponentContext);

  const timeout = React.useRef<NodeJS.Timeout>();
  const countertimeout = React.useRef<NodeJS.Timeout>();

  const [counter, setCounter] = React.useState(0);
  // states for stepper logic
  const [activeStep, setActiveStep] = React.useState(0);
  const [finished, setFinished] = React.useState(false);

  // states for topic selection logic
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [jobName, setJobName] = React.useState("");
  const [invalidJobName, setInvalidJobName] = React.useState(false);
  const [multipleTopics, setMultipleTopics] = React.useState(false);
  const multipleRef = React.useRef(false);

  // state for param selection logic
  const [paramLists, setParamLists] = React.useState<Param[][] | undefined>(
    undefined
  );
  const [paramValues, setParamValues] = React.useState<ParamValues[]>([]);
  const [invalidValues, setInvalidValues] = React.useState<string[][]>([]);

  // state for Load Failed
  const [loadFailed, setLoadFailed] = React.useState(false);

  // state for schedule selection logic
  const [schedule, setSchedule] = React.useState<Schedule>({
    type: "daily",
    time: new Date(),
  });

  // state for deleteSchedule selection logic
  const [deleteSchedule, setDeleteSchedule] = React.useState<DeleteSchedule>({
    type: "noDeletion",
  });

  // for error notifications
  const [message, dispatchMessage] = React.useReducer(notifcationReducer, {
    open: false,
    message: "",
    severity: "success",
  });

  const [hintState, setHintState] = React.useState(0);

  // initialize callback for add job functionality
  const addJob = useCallFetch(getUrl("/add"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      topicValues: topics.map((t, idx) => {
        return {
          topicId: t.topicId,
          values: toTypedValues(trimParamValues(paramValues[idx]), paramLists ? paramLists[idx] : [])
        }
      }),
      jobName: jobName,
      schedule: withFormattedDates(schedule),
      deleteSchedule: deleteSchedule
    })
  });

  // handler for param Load failed
  const handleLoadParamsFailed = React.useCallback(() => {
    setLoadFailed(true);
  }, []);

  // handler for param selection logic
  const handleFetchParams = React.useCallback((params: Param[]) => {
    setParamLists((p) => {
      if (p !== undefined) {
        return [...p, params];
      }
      return [params];
    });
    setParamValues((v) => {
      if (v !== undefined) {
        return [...v, initSelectedValues(params)];
      }
      return [initSelectedValues(params)];
    });
  }, []);

  // initialize callback for get params
  const fetchParams = useCallFetch(
    getUrl("/params/") + topics[topics.length - 1]?.topicId,
    undefined,
    handleFetchParams,
    handleLoadParamsFailed
  );

  // handler for reloading params
  const handleReloadParams = React.useCallback(() => {
    if (!multipleRef.current) {
      setParamLists(undefined);
      setParamValues([]);
    }
    setLoadFailed(false);
    fetchParams();
  }, [fetchParams]);

  useEffect(() => {
    if (activeStep === 3) {
      setActiveStep(4);
      setFinished(true);
      addJob();
    }
  }, [activeStep, addJob]);

  // when a new topic is selected, fetch params
  useEffect(() => {
    if (topics.length > 0) {
      handleReloadParams();
    }
  }, [topics, handleReloadParams]);

  useEffect(() => {
    multipleRef.current = multipleTopics;
    if (!multipleTopics) {
      setTopics([]);
      setParamLists(undefined);
      setParamValues([]);
    }
  }, [multipleTopics]);

  useEffect(() => {
    if (counter > 0) {
      countertimeout.current = setTimeout(() => setCounter(counter - 1), 1000);
    }
    return (() => {
      if (countertimeout.current !== undefined ) {
        clearTimeout(countertimeout.current);
      }
      if (timeout.current !== undefined ) {
        clearTimeout(timeout.current);
      }
    });
  }, [counter]);

  const delay = () => {
    setCounter(5);
    timeout.current = setTimeout(() => {
      components?.setCurrent("home");
    }, 5000);
  };

  const reportError = (message: string) => {
    dispatchMessage({ type: "reportError", message: message });
  };

  // handlers for stepper logic
  const handleNext = () => {
    switch (activeStep) {
      case 0:
        if (topics.length <= 0) {
          reportError("Es muss mindestens ein Thema ausgewählt werden");
          return;
        }
        if (jobName.trim() === "") {
          setInvalidJobName(true);
          reportError("Job-Name nicht ausgefüllt");
          return;
        }
        setInvalidJobName(false);
        break;
      case 1:
        const invalid = paramLists?.map((l, idx) => getInvalidParamValues(paramValues[idx], l));
        setInvalidValues(invalid ? invalid : []);
        const paramsValid = invalid?.every(t => t.length === 0);
        if (!paramsValid) {
          reportError("Parameter nicht korrekt gesetzt")
          return;
        }
        break;
      case 2:
        const scheduleValid = validateSchedule(schedule);
        if (!scheduleValid) {
          reportError("Es muss mindestens ein Wochentag gesetzt werden");
          return;
        }
        break;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    handleHintState(activeStep + 1);
    if (activeStep === 2) {
      delay();
    }
  };

  const handleBack = () => {
    setInvalidValues([]);
    setInvalidJobName(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    handleHintState(activeStep - 1);
  };

  // handlers for topic selection logic
  const handleResetTopics = () => {
    setTopics([]);
  };

  const handleAddTopic = (topic: Topic) => {
    setTopics([...topics, topic]);
  };

  const handleSetSingleTopic = (topic: Topic) => {
    setTopics([topic]);
  };

  const handleEnterJobName = (jobName: string) => {
    setJobName(jobName);
  };

  const handleToggleMultiple = () => {
    setMultipleTopics(!multipleTopics);
  };

  // handler for param selection logic
  const handleSelectParam = (key: string, value: any, idx: number) => {
    const updated = [...paramValues];
    updated[idx][key] = value;
    setParamValues(updated);
  };

  // handler for schedule selection logic
  const handleSelectSchedule = (schedule: Schedule) => {
    setSchedule(schedule);
  };

  // handler fpr deleteSchedule selection logic
  const handleSelectDeleteSchedule = (deleteSchedule: DeleteSchedule) => {
    setDeleteSchedule(deleteSchedule);
  };

  const handleHintState = (hint: number) => {
    setHintState(hint);
  };

  // stepper texts
  const steps = [
    "Thema auswählen",
    "Parameter festlegen",
    "Zeitplan auswählen",
  ];
  const descriptions = [
    "Zu welchem Thema sollen Videos generiert werden?",
    "Parameter auswählen für: '" + jobName + "'",
    "Wann sollen neue Videos generiert/gelöscht werden?",
  ];
  const hintContent = [
    <div>
      <Typography variant="h5" gutterBottom>
        Themenauswahl
      </Typography>
      <Typography gutterBottom>
        Auf dieser Seite können Sie auswählen zu welchem der Themen Ihnen ein
        Video generiert werden soll.
      </Typography>
    </div>,
    <div>
      <Typography variant="h5" gutterBottom>
        Parameterauswahl
      </Typography>
      <Typography gutterBottom>
        Auf dieser Seite können Sie bestimmte Parameter auswahlen.
      </Typography>
    </div>,
    hintContents.time,
    hintContents.delete,
  ];

  // based on active step, render specific selection panel
  const getSelectPanel = (step: number) => {
    switch (step) {
      case 0:
        return (
          <TopicSelection
            topics={topics}
            jobName={jobName}
            multipleTopics={multipleTopics}
            toggleMultipleHandler={handleToggleMultiple}
            resetTopicsHandler={handleResetTopics}
            setSingleTopicHandler={handleSetSingleTopic}
            addTopicHandler={handleAddTopic}
            enterJobNameHandler={handleEnterJobName}
            invalidJobName={invalidJobName} />
        );
      case 1:
        return (
          <ParamSelection
            topicNames={topics.map(t => t.topicName)}
            values={paramValues}
            params={paramLists}
            loadFailedProps={{
              hasFailed: loadFailed,
              name: "Parameter",
              onReload: handleReloadParams
            }}
            selectParamHandler={handleSelectParam}
            invalidValues={invalidValues} />
        )
      case 2:
        return (
          <SettingsPage
            offset={0}
            schedule={schedule}
            deleteSchedule={deleteSchedule}
            selectScheduleHandler={handleSelectSchedule}
            selectDeleteScheduleHandler={handleSelectDeleteSchedule}
            handleHintState={handleHintState}
            paramSelectionProps={undefined}
          />
        )
      default:
        return "";
    }
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div className={classes.jobCreateBox}>
        {!finished ? (
          <div>
            <div>
              <Grid container>
                <Grid item sm={1} xs={1} />
                <Grid item sm={10} xs={9} className={classes.SPaddingTB}>
                  <h3 className={classes.header}>{descriptions[activeStep]}</h3>
                </Grid>
                <Grid container item sm={1} xs={2}>
                  <HintButton content={hintContent[hintState]} />
                </Grid>
              </Grid>
            </div>
            <GreyDivider />
            {getSelectPanel(activeStep)}
            <GreyDivider />
            <div className={classes.LPaddingTB}>
              <span>
                <BackButton
                  onClick={handleBack}
                  style={{ marginRight: 20 }}
                  disabled={activeStep <= 0}
                >
                  {"Zurück"}
                </BackButton>
                <ContinueButton
                  onClick={handleNext}
                  style={{ marginLeft: 20 }}
                >
                  {activeStep < steps.length - 1 ? "WEITER" : "ERSTELLEN"}
                </ContinueButton>
              </span>
            </div>
          </div>
        ) : (
            <Fade in={true}>
              <div className={classes.MPaddingTB}>
                <Grid container spacing={2}>
                  <Grid container item justify="center">
                    <CheckCircleIcon
                      className={classes.checkIcon}
                      color={"disabled"}
                      fontSize={"default"}
                    />
                  </Grid>
                  <Grid container item justify="center">
                    <Typography>Job '{jobName}' erfolgreich erstellt!</Typography>
                  </Grid>
                  <Grid container item justify="center">
                    <Typography>
                      Sie werden in {counter} Sekunden zur Startseite
                    weitergeleitet.
                  </Typography>
                  </Grid>
                  <Grid container item justify="center">
                    <ContinueButton
                      onClick={() => components?.setCurrent("home")}
                    >
                      STARTSEITE
                  </ContinueButton>
                  </Grid>
                </Grid>
              </div>
            </Fade>
          )}
      </div>
      <Notification
        handleClose={() => dispatchMessage({ type: "close" })}
        open={message.open}
        message={message.message}
        severity={message.severity}
      />
    </div>
  );
}