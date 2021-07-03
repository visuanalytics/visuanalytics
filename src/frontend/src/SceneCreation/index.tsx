import React from "react";
import { CenterNotification, centerNotifcationReducer } from "../util/CenterNotification";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {InfoProviderSelection} from "./InfoProviderSelection";
import {SceneEditor} from "./SceneEditor";
import {ComponentContext} from "../ComponentProvider";
import {DataSource, FrontendInfoProvider, uniqueId} from "../CreateInfoProvider/types";
import {DiagramInfo, HistorizedDataInfo, ImageBackendData, InfoProviderData} from "./types";
import {useCallFetch} from "../Hooks/useCallFetch";


//TODO: when merged with the new type structure, put this into a global file

/**
 * Wrapper component for the scene creation.
 */
export const SceneCreation = () => {

    //const classes = useStyles();
    const components = React.useContext(ComponentContext);

    //the current step of the creation process, numbered by 0 to 1
    const [sceneEditorStep, setSceneEditorStep] = React.useState(0);
    //the list of all infoproviders fetched from the backend
    const [infoProviderList, setInfoProviderList] = React.useState<Array<InfoProviderData>>([]);
    //object of the infoprovider to be used in the scene creation, selected in first step
    const [infoProvider, setInfoProvider] = React.useState<FrontendInfoProvider>({} as FrontendInfoProvider);
    //lists that contain the extracted information of the infoprovider, used to have less computing
    const [selectedDataList, setSelectedDataList] = React.useState<Array<string>>([]);
    const [customDataList, setCustomDataList] = React.useState<Array<string>>([]);
    const [historizedDataList, setHistorizedDataList] = React.useState<Array<HistorizedDataInfo>>([]);
    const [diagramList, setDiagramList] = React.useState<Array<DiagramInfo>>([]);
    //list of paths of the images fetched from the backend
    const [imageList, setImageList] = React.useState<Array<string>>([]);
    //true when the continue of step 0 is disabled - used for blocking the button until all fetches are done
    const [step0ContinueDisabled, setStep0ContinueDisabled] = React.useState(false);

    React.useEffect(() => {
        //step - disabled since it makes debugging more annoying TODO: restore when finished!!
        setSceneEditorStep(Number(sessionStorage.getItem("sceneEditorStep-" + uniqueId)||0));
        //infoProviderList
        setInfoProviderList(sessionStorage.getItem("infoProviderList-" + uniqueId) === null ? new Array<InfoProviderData>() : JSON.parse(sessionStorage.getItem("infoProviderList-" + uniqueId)!));
        //infoProvider
        setInfoProvider(sessionStorage.getItem("infoProvider-" + uniqueId )=== null ? new Array<DataSource>() : JSON.parse(sessionStorage.getItem("infoProvider-" + uniqueId)!));
        //selectedDataList
        setSelectedDataList(sessionStorage.getItem("selectedDataList-" + uniqueId )=== null ? new Array<string>() : JSON.parse(sessionStorage.getItem("selectedDataList-" + uniqueId)!))
        //selectedDataList
        setSelectedDataList(sessionStorage.getItem("customDataList-" + uniqueId )=== null ? new Array<string>() : JSON.parse(sessionStorage.getItem("customDataList-" + uniqueId)!))
        //selectedDataList
        setSelectedDataList(sessionStorage.getItem("historizedDataList-" + uniqueId )=== null ? new Array<HistorizedDataInfo>() : JSON.parse(sessionStorage.getItem("historizedDataList-" + uniqueId)!))
        //selectedDataList
        setSelectedDataList(sessionStorage.getItem("diagramList-" + uniqueId )=== null ? new Array<DiagramInfo>() : JSON.parse(sessionStorage.getItem("diagramList-" + uniqueId)!))
    }, [])
    //store step in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("sceneEditorStep-" + uniqueId, sceneEditorStep.toString());
    }, [sceneEditorStep])

    React.useEffect(() => {
        sessionStorage.setItem("infoProviderList-" + uniqueId, JSON.stringify(infoProviderList));
    }, [infoProviderList])

    React.useEffect(() => {
        sessionStorage.setItem("infoProvider-" + uniqueId, JSON.stringify(infoProvider));
    }, [infoProvider])

    React.useEffect(() => {
        sessionStorage.setItem("selectedDataList-" + uniqueId, JSON.stringify(selectedDataList));
    }, [selectedDataList])

    React.useEffect(() => {
        sessionStorage.setItem("customDataList-" + uniqueId, JSON.stringify(customDataList));
    }, [customDataList])

    React.useEffect(() => {
        sessionStorage.setItem("historizedDataList-" + uniqueId, JSON.stringify(historizedDataList));
    }, [historizedDataList])

    React.useEffect(() => {
        sessionStorage.setItem("diagramList-" + uniqueId, JSON.stringify(diagramList));
    }, [diagramList])

    /**
     * Removes all items of this component from the sessionStorage.
     */
    const clearSessionStorage = () => {
        sessionStorage.removeItem("sceneEditorStep-" + uniqueId);
        sessionStorage.removeItem("infoProviderList-" + uniqueId);
        sessionStorage.removeItem("infoProvider-" + uniqueId);
        sessionStorage.removeItem("selectedDataList-" + uniqueId);
        sessionStorage.removeItem("customDataList-" + uniqueId);
        sessionStorage.removeItem("historizedDataList-" + uniqueId);
        sessionStorage.removeItem("diagramList-" + uniqueId);
    }

    // contains the names of the steps to be displayed in the stepper
    const steps = [
        "Infoprovider-Auswahl",
        "Szenen-Erstellung"
    ];


    // setup for error notification
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    const reportError = (message: string) => {
        dispatchMessage({ type: "reportError", message: message });
    };

    /**
     * Handler for back button that is passed to all sub-components as props.
     * Decrements the step or returns to the dashboard if the step was 0.
     */
    const handleContinue = () => {
        setSceneEditorStep(sceneEditorStep + 1);
    }

    /**
     * Handler for back button that is passed to all sub-components as props.
     * Decrements the step or returns to the dashboard if the step was 0.
     */
    const handleBack = () => {
        if(sceneEditorStep===0) {
            clearSessionStorage();
            components?.setCurrent("dashboard");
        }
        setSceneEditorStep(sceneEditorStep-1)
    }

    /**
     * Handles the error-message if an error appears.
     * @param err the shown error
     */
    const handleErrorFetchAll = (err: Error) => {
        //console.log('error');
        dispatchMessage({type: "reportError", message: 'Fehler: ' + err});
    }

    /**
     * This type is needed because the answer of the backend consists of a list of infProviders.
     */
    type fetchAllBackendAnswer = Array<InfoProviderData>

    /**
     * Handles the success of the fetchAllInfoprovider()-method.
     * The json from the response will be transformed to an array of jsonRefs and saved in infoprovider.
     * @param jsonData the answer from the backend
     */
    const handleSuccessFetchAll = (jsonData: any) => {
        const data = jsonData as fetchAllBackendAnswer;
        setInfoProviderList(data);
    }

    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = React.useRef(true);

    /**
     * Method to fetch all infoproviders from the backend.
     * The standard hook "useCallFetch" is not used here since the fetch function has to be memorized
     * with useCallback in order to be used in useEffect.
     */
    const fetchAllInfoprovider = React.useCallback(() => {
        let url = "/visuanalytics/infoprovider/all"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            },
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handleSuccessFetchAll(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleErrorFetchAll(err)
        }).finally(() => clearTimeout(timer));
    }, [])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    React.useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);


    /**
     * Method block for fetching all images from the backend.
     */

    //mutable value to store the list of all images - not in state because it needs to be changed without renders
    const allImageList = React.useRef<Array<ImageBackendData>>([]);
    //mutable list of the paths of all images received from the backend as blob - also not in state to change without renders
    const imageFetchResults = React.useRef<Array<string>>([]);

    /**
     * Method that serves to recursively fetch all images from the backend.
     * Checks if allImageList still contains entries to be fetched. If there is an entry,
     * the fetch method is called for its ID and the method is removed.
     * If there are no images left, the results are written to the state and continue handler is called.
     */
    const fetchNextImage = () => {
        //check if all images are fetched
        if(allImageList.current.length === 0) {
            //set the state to the fetched list
            setImageList(imageFetchResults.current);
            console.log(imageFetchResults.current);
            //enable the continue button again
            setStep0ContinueDisabled(false);
            //continue since this is called from finishing step 1
            handleContinue();
        } else {
            //get the id of the next image to be fetched
            const nextId = allImageList.current[0].image_id;
            //delete the image with this id from the images that still need to be fetched
            allImageList.current  = allImageList.current.filter((image) => {
                return image.image_id !== nextId;
            })
            //fetch the image with the id from the backend
            fetchImageById(nextId);
        }
    }

    /**
     * Method that handles successful fetches of images from the backend
     * @param jsonData  The image as blob sent by the backend.
     */
    const handleImageByIdSuccess = (jsonData: any) => {
        //create a URL for the blob image and store it in the list of images
        imageFetchResults.current.push(URL.createObjectURL(jsonData));
        //fetch the next image afterwards
        fetchNextImage();
    }

    /**
     * Method that handles errors for fetching am image from the backend.
     * @param err The error sent by the backend.
     */
    const handleImageByIdError = (err: Error) => {
       reportError("Fehler beim Abrufen eines Bildes: " + err);
        //enable the continue button again
        setStep0ContinueDisabled(false);
    }

    /**
     * Method to fetch a single image by id from the backend.
     * The standard hook "useCallFetch" is not used here since we want to pass an id
     * as additional argument (storing in state is no alternative because there wont be re-render).
     */
    const fetchImageById = (id: number) => {
        let url = "/visuanalytics/image/" + id;
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            },
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.blob();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handleImageByIdSuccess(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleImageByIdError(err)
        }).finally(() => clearTimeout(timer));
    }

    /**
     * Method that handles successful calls to the backend for fetching a list of all images.
     * Starts the fetching of all images id by id.
     * @param jsonData The list of all images returned by the backend.
     */
    const handleImageListSuccess = (jsonData: any) => {
        allImageList.current = jsonData as Array<ImageBackendData>;
        imageFetchResults.current = [];
        fetchNextImage();
    }

    /**
     * Method that handles errors for fetching a list of all images.
     * @param err The error returned from the backend.
     */
    const handleImageListError = (err: Error) => {
        reportError("Fehler beim Laden der Liste aller Bilder: " + err)
    }

    /**
     * Method that fetches a list of all available images from the backend.
     */
    const fetchImageList = useCallFetch("/visuanalytics/image/all",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }, handleImageListSuccess, handleImageListError
    )


    React.useEffect(() => {
        const leaveAlert = (e: BeforeUnloadEvent) => {
            if(sceneEditorStep) {
                e.preventDefault();
                e.returnValue = "";
            }
        }
        window.addEventListener("beforeunload", leaveAlert);
        return () => {
            window.removeEventListener("beforeunload", leaveAlert);
        }
    }, [])

    /**
     * The list of infoproviders is generated automatically when the component is shown.
     */
    React.useEffect(() => {
            //console.log("Fetcher hook here")
            fetchAllInfoprovider();
        }, [fetchAllInfoprovider]
    );


    /**
     * Returns the rendered component based on the current step.
     * @param step The number of the current step
     */
    const selectContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <InfoProviderSelection
                        continueHandler={() => setSceneEditorStep(step+1)}
                        backHandler={() => handleBack()}
                        infoProviderList={infoProviderList}
                        reportError={reportError}
                        setInfoProvider={(infoProvider: FrontendInfoProvider) => setInfoProvider(infoProvider)}
                        setSelectedDataList={(list: Array<string>) => setSelectedDataList(list)}
                        setCustomDataList={(list: Array<string>) => setCustomDataList(list)}
                        setHistorizedDataList={(list: Array<HistorizedDataInfo>) => setHistorizedDataList(list)}
                        setDiagramList={(list: Array<DiagramInfo>) => setDiagramList(list)}
                        fetchImageList={() => fetchImageList()}
                        step0ContinueDisabled={step0ContinueDisabled}
                        setStep0ContinueDisabled={(disabled: boolean) => setStep0ContinueDisabled(disabled)}
                    />
                )
            case 1:
                return (
                    <SceneEditor
                        continueHandler={() => handleContinue()}
                        backHandler={() => handleBack()}
                        infoProvider={infoProvider}
                        selectedDataList={selectedDataList}
                        customDataList={customDataList}
                        historizedDataList={historizedDataList}
                        diagramList={diagramList}
                        imageList={imageList}
                        setImageList={(images: Array<string>) => setImageList(images)}
                        editMode={false}
                    />
                )
        }
    }

    return (
        <React.Fragment>
            <Container maxWidth={"md"}>
                <Stepper activeStep={sceneEditorStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Container>
            {selectContent(sceneEditorStep)}
            <CenterNotification
                handleClose={() => dispatchMessage({ type: "close" })}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
        </React.Fragment>
    );
}
