import React from "react";
import { CenterNotification, centerNotifcationReducer } from "../util/CenterNotification";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {InfoProviderSelection} from "./InfoProviderSelection";
import {SceneEditor} from "./SceneEditor";
import {ComponentContext} from "../ComponentProvider";
import {DataSource, Diagram, FrontendInfoProvider, uniqueId} from "../CreateInfoProvider/types";
import {DiagramInfo, HistorizedDataInfo, ImageBackendData, ImageFrontendData, InfoProviderData} from "./types";
import {hintContents} from "../util/hintContents";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import {StepFrame} from "../CreateInfoProvider/StepFrame";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@material-ui/core";
import {FullScene} from "../Dashboard/types";
import {CustomImage} from "./SceneEditor/types";

interface SceneCreationProps {
    sceneFromBackend?: FullScene;
    editId?: number;
}

/**
 * Wrapper component for the scene creation.
 */
export const SceneCreation: React.FC<SceneCreationProps> = (props) => {

    //const classes = useStyles();
    const components = React.useContext(ComponentContext);

    //the current step of the creation process, numbered by 0 to 1
    //setting one in editing is not necessary since the dialog will be displayed directly
    //TODO: document this behaviour!!!
    const [sceneEditorStep, setSceneEditorStep] = React.useState(props.sceneFromBackend !== undefined ? 1 : 0);
    //the list of all infoproviders fetched from the backend
    const [infoProviderList, setInfoProviderList] = React.useState<Array<InfoProviderData>>([]);
    //object of the infoprovider to be used in the scene creation, selected in first step
    const [infoProvider, setInfoProvider] = React.useState<FrontendInfoProvider>({} as FrontendInfoProvider);
    //lists that contain the extracted information of the infoprovider, used to have less computing
    const [selectedDataList, setSelectedDataList] = React.useState<Array<string>>([]);
    const [customDataList, setCustomDataList] = React.useState<Array<string>>([]);
    const [historizedDataList, setHistorizedDataList] = React.useState<Array<HistorizedDataInfo>>([]);
    const [arrayProcessingList, setArrayProcessingList] = React.useState<Array<string>>([]);
    const [stringReplacementList, setStringReplacementList] = React.useState<Array<string>>([]);
    const [diagramList, setDiagramList] = React.useState<Array<DiagramInfo>>([]);
    //list of paths of the images fetched from the backend
    const [imageList, setImageList] = React.useState<Array<ImageFrontendData>>([]);
    //list of paths of the background images fetched from the backend
    const [backgroundImageList, setBackgroundImageList] = React.useState<Array<ImageFrontendData>>([]);
    //true when the continue of step 0 is disabled - used for blocking the button until all fetches are done
    const [step0ContinueDisabled, setStep0ContinueDisabled] = React.useState(false);
    //stores the id currently selected infoprovider - 0 is forbidden by the backend so it can be used as a default value
    const [selectedId, setSelectedId] = React.useState(0);
    //true if the message for loading the data from the backend is displayed
    const [displayLoadMessage, setDisplayLoadMessage] = React.useState(false);
    //copy of the sceneFromBackend props and the editId props - necessary to not loose on reload in editing
    const [sceneFromBackend, setSceneFromBackend] = React.useState(props.sceneFromBackend);
    const [editId, setEditId] = React.useState(props.editId);



    /* mutable flag that is true when currently images are being fetched because of a reload
    * this is used to block the continueHandler call after successful fetches. This way,
    * no additional methods are required to fetch the images on reload.
    * This will also show a loading spinner while fetching.
    */
    const refetchingImages = React.useRef(false);
    // true when a spinner has to be displayed because of refetching - seperate variable because it might be inconstent with when rerenders are triggered
    const [displaySpinner, setDisplaySpinner] = React.useState(false);
    //true when the dialog for refetching images is opened
    //is also opened when starting editing mode first to fetch the images before entering the SceneEditor component - this will make them available from the start on
    //TODO: Document this!!
    const [fetchImageDialogOpen, setFetchImageDialogOpen] = React.useState(props.sceneFromBackend !== undefined);

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
    const handleContinue = React.useCallback(() => {
        setSceneEditorStep(sceneEditorStep + 1);
    }, [sceneEditorStep])

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
     * This type is needed because the answer of the backend consists of a list of infProviders.
     */
    type fetchAllBackendAnswer = Array<InfoProviderData>

    /**
     * Handles the success of the fetchAllInfoprovider()-method.
     * The json from the response will be transformed to an array of jsonRefs and saved in infoprovider.
     * @param jsonData the answer from the backend
     */
    const handleSuccessFetchAll = React.useCallback((jsonData: any) => {
        const data = jsonData as fetchAllBackendAnswer;
        setInfoProviderList(data);
    }, []);

    /**
     * Handles the error-message if an error appears.
     * @param err the shown error
     */
    const handleErrorFetchAll = React.useCallback((err: Error) => {
        //console.log('error');
        dispatchMessage({type: "reportError", message: 'Fehler: ' + err});
    }, [])


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
    }, [handleSuccessFetchAll, handleErrorFetchAll])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    React.useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);


    /**
     * Method block for fetching all background images from the backend
     */

    //mutable value to store the list of all background images - not in state because it needs to be changed without renders
    const allBackgroundImageList = React.useRef<Array<ImageBackendData>>([]);
    //mutable list of the paths of all background images received from the backend as blob - also not in state to change without renders
    const backgroundImageFetchResults = React.useRef<Array<ImageFrontendData>>([]);

    /**
     * Method that serves to recursively fetch all background images from the backend.
     * Checks if allBackgroundImageList still contains entries to be fetched. If there is an entry,
     * the fetch method is called for its ID and the method is removed.
     * If there are no background images left, the results are written to the state and fetching background images is started.
     */
    const fetchNextBackgroundImage = () => {
        //check if all images are fetched
        if(allBackgroundImageList.current.length === 0) {
            //set the state to the fetched list
            setBackgroundImageList(backgroundImageFetchResults.current);
            backgroundImageFetchResults.current = [];
            //console.log(backgroundImageFetchResults.current);
            //start fetching all diagram previews
            fetchNextDiagram();
        } else {
            //get the id of the next image to be fetched
            const nextId = allBackgroundImageList.current[0].image_id;
            const nextURL = allBackgroundImageList.current[0].path;
            //delete the image with this id from the images that still need to be fetched
            allBackgroundImageList.current  = allBackgroundImageList.current.filter((image) => {
                return image.image_id !== nextId;
            })
            //fetch the image with the id from the backend
            fetchBackgroundImageById(nextId, nextURL, handleBackgroundImageByIdSuccess, handleBackgroundImageByIdError);
        }
    }



    /**
     * Method that handles successful fetches of images from the backend
     * @param jsonData  The image as blob sent by the backend.
     * @param id Id of the background image in the backend
     * @param url Path of the image in the background
     */
    const handleBackgroundImageByIdSuccess = (jsonData: any, id: number, url: string) => {
        //create a URL for the blob image and store it in the list of background images
        backgroundImageFetchResults.current.push({
            image_id: id,
            image_backend_path: url,
            image_blob_url: URL.createObjectURL(jsonData)
        });
        //fetch the next background image afterwards
        fetchNextBackgroundImage();
    }

    /**
     * Method that handles errors for fetching am image from the backend.
     * @param err The error sent by the backend.
     */
    const handleBackgroundImageByIdError = (err: Error) => {
        reportError("Fehler beim Abrufen eines Hintergrundbildes: " + err);
        //enable the continue button again
        setStep0ContinueDisabled(false);
        refetchingImages.current = false;
        // deactivate the spinner
        setDisplaySpinner(false);
        setDisplayLoadMessage(false);
    }

    /**
     * Method to fetch a single image by id from the backend.
     * The standard hook "useCallFetch" is not used here since we want to pass an id
     * as additional argument (storing in state is no alternative because there wont be re-render).
     */
    const fetchBackgroundImageById = (id: number, image_url: string, successHandler: (jsonData: any, id: number, url: string) => void, errorHandler: (err: Error) => void) => {
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
            if (isMounted.current) successHandler(data, id, image_url)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) errorHandler(err)
        }).finally(() => clearTimeout(timer));
    }

    /*const fetchAllBackgroundImages = React.useCallback(() => {
        while(allBackgroundImageList.current.length !== 0) {
            while(requestRunning.current);
            const nextId = allBackgroundImageList.current[0].image_id;
            //delete the image with this id from the images that still need to be fetched
            allBackgroundImageList.current  = allBackgroundImageList.current.filter((image) => {
                return image.image_id !== nextId;
            })
            requestRunning.current = true;
            //fetch the image with the id from the backend
            fetchBackgroundImageById(nextId, handleBackgroundImageByIdSuccess, handleBackgroundImageByIdError);
        }
        //set the state to the fetched list
        setBackgroundImageList(backgroundImageFetchResults.current);
        console.log(backgroundImageFetchResults.current);
        //start fetching all diagram previews
        //fetchNextDiagram();
        setDisplayLoadMessage(false);
        handleContinue();
    }, [fetchBackgroundImageById, handleBackgroundImageByIdError, handleContinue])*/


    /**
     * Method that handles successful calls to the backend for fetching a list of all images.
     * Starts the fetching of all images id by id.
     * @param jsonData The list of all images returned by the backend.
     */
    const handleBackgroundImageListSuccess = (jsonData: any) => {
        allBackgroundImageList.current = jsonData as Array<ImageBackendData>;
        backgroundImageFetchResults.current = [];
        //fetchNextBackgroundImage();
        fetchNextBackgroundImage()
    }

    /**
     * Method that handles errors for fetching a list of all images.
     * @param err The error returned from the backend.
     */
    const handleBackgroundImageListError = React.useCallback((err: Error) => {
        reportError("Fehler beim Laden der Liste aller Hintergrundbilder: " + err);
        //enable the continue button again
        setStep0ContinueDisabled(false);
        refetchingImages.current = false;
        // deactivate the spinner
        setDisplaySpinner(false);
        setDisplayLoadMessage(false);
    }, [])


    /**
     * Method that fetches a list of all available images from the backend.
     */
    const fetchBackgroundImageList = () => {
        let url = "/visuanalytics/image/all/backgrounds"
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
            if (isMounted.current) handleBackgroundImageListSuccess(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleBackgroundImageListError(err)
        }).finally(() => clearTimeout(timer));
    }


    /**
     * Method block for fetching all images and background images from the backend.
     */

    //mutable value to store the list of all images - not in state because it needs to be changed without renders
    const allImageList = React.useRef<Array<ImageBackendData>>([]);
    //mutable list of the paths of all images received from the backend as blob - also not in state to change without renders
    const imageFetchResults = React.useRef<Array<ImageFrontendData>>([]);

    /**
     * Method that handles successful fetches of images from the backend.
     * @param jsonData The image as blob sent by the backend.
     * @param id The id of the image that was requested.
     * @param url The backend URL/path of the image requested
     */
    const handleImageByIdSuccess = (jsonData: any, id: number, url: string) => {
        //create a URL for the blob image and store it in the list of images
        imageFetchResults.current.push({
            image_id: id,
            image_backend_path: url,
            image_blob_url: URL.createObjectURL(jsonData)
        });
        //fetch the next image afterwards
        fetchNextImage();
        console.log("success fetching the image with id " + id)
    }

    /**
     * Method that handles errors for fetching am image from the backend.
     * @param err The error sent by the backend.
     */
    const handleImageByIdError = React.useCallback((err: Error) => {
        reportError("Fehler beim Abrufen eines Bildes: " + err);
        //enable the continue button again
        setStep0ContinueDisabled(false);
        refetchingImages.current = false;
        // deactivate the spinner
        setDisplaySpinner(false);
        setDisplayLoadMessage(false);
    }, [])








    /**
     * Method to fetch a single image by id from the backend.
     * The standard hook "useCallFetch" is not used here since we want to pass an id
     * as additional argument (storing in state is no alternative because there wont be re-render).
     */
    const fetchImageById = React.useCallback((id: number, image_url: string, successHandler: (jsonData: any, id: number, url: string) => void, errorHandler: (err: Error) => void) => {
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
            if (isMounted.current) successHandler(data, id, image_url)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) errorHandler(err)
        }).finally(() => clearTimeout(timer));
    }, [])

    /**
     * Method that serves to recursively fetch all images from the backend.
     * Checks if allImageList still contains entries to be fetched. If there is an entry,
     * the fetch method is called for its ID and the method is removed.
     * If there are no images left, the results are written to the state and fetching diagrams is started.
     */
    const fetchNextImage = () => {
        //check if all images are fetched
        if(allImageList.current.length === 0) {
            //set the state to the fetched list
            setImageList(imageFetchResults.current);
            imageFetchResults.current = []
            //start the fetching of all background images
            fetchBackgroundImageList();
        } else {
            //get the id of the next image to be fetched
            const nextId = allImageList.current[0].image_id;
            const nextURL = allImageList.current[0].path;
            //delete the image with this id from the images that still need to be fetched
            allImageList.current  = allImageList.current.filter((image) => {
                return image.image_id !== nextId;
            })
            //fetch the image with the id from the backend
            fetchImageById(nextId, nextURL, handleImageByIdSuccess, handleImageByIdError);
        }
    }

    /*const fetchAllImages = React.useCallback(() => {
        while(allBackgroundImageList.current.length !== 0) {
            //busy waiting until the last request has finished
            while(requestRunning.current);
            //get the id of the next image to be fetched
            const nextId = allImageList.current[0].image_id;
            const nextURL = allImageList.current[0].path;
            //delete the image with this id from the images that still need to be fetched
            allImageList.current  = allImageList.current.filter((image) => {
                return image.image_id !== nextId;
            })
            //set the blocking variable
            requestRunning.current = true;
            //fetch the image with the id from the backend
            console.log("starting to fetch for: " + nextId)
            fetchImageById(nextId, nextURL, handleImageByIdSuccess, handleImageByIdError);
        }
        //set the state to the fetched list
        setImageList(imageFetchResults.current);
        console.log(imageFetchResults.current);
        //start the fetching of all background images
        fetchBackgroundImageList();
    }, [fetchBackgroundImageList, fetchImageById, handleImageByIdSuccess, handleImageByIdError])*/

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
            reportError("Fehler beim Laden der Liste aller Bilder: " + err);
            //activate the continue button again
            setStep0ContinueDisabled(false);
            refetchingImages.current = false;
            // deactivate the spinner
            setDisplaySpinner(false);
            setDisplayLoadMessage(false);
        }



    /**
     * Method to fetch all images from the backend.
     */
    const fetchImageList = () => {
        let url = "/visuanalytics/image/all/pictures"
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
            if (isMounted.current) handleImageListSuccess(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleImageListError(err)
        }).finally(() => clearTimeout(timer));
    }

    /**
     * Method block for fetching previews of diagrams
     */

    //mutable value to store the list of all diagrams - not in state because it needs to be changed without renders
    const diagramsToFetch = React.useRef<Array<DiagramInfo>>([]);
    //mutable list of of all diagram with previews received from the backend as blob - also not in state to change without renders
    const diagramFetchResults = React.useRef<Array<DiagramInfo>>([]);

    /**
     * Method that serves to recursively fetch all images from the backend.
     * Checks if allImageList still contains entries to be fetched. If there is an entry,
     * the fetch method is called for its ID and the method is removed.
     * If there are no images left, the results are written to the state and continue handler is called.
     */
    const fetchNextDiagram = () => {
        //check if all images are fetched
        if(diagramsToFetch.current.length === 0) {
            //set the state to the fetched list
            setDiagramList(diagramFetchResults.current);
            diagramFetchResults.current = [];
            //enable the continue button again
            setStep0ContinueDisabled(false);
            //continue to the next step
            if(!refetchingImages.current) {
                handleContinue();
                setDisplayLoadMessage(false);
            }
            else {
                refetchingImages.current = false;
                // deactivate the spinner
                setDisplaySpinner(false);
            }
        } else {
            //get the id of the next image to be fetched
            const currentDiagram = diagramsToFetch.current[0];
            //delete the image with this id from the images that still need to be fetched
            diagramsToFetch.current  = diagramsToFetch.current.filter((diagram) => {
                return diagram.name !== currentDiagram.name
            })
            //fetch the image with the id from the backend
            fetchDiagramPreview(currentDiagram);
        }
    }

    /**
     * Method that handles successful calls for fetching a diagram preview from the backend.
     * @param jsonData The image returned from the backend as blob.
     * @param diagram The diagram object currently operated on.
     */
    const diagramPreviewSuccessHandler = (jsonData: any, diagram: DiagramInfo) => {
        // push a new object with the fetched image to the list of diagrams
        diagramFetchResults.current.push({
            ...diagram,
            url: URL.createObjectURL(jsonData)
        })
        //go over to fetch the next diagram
        fetchNextDiagram();
    }

    /**
     * Handler method for errors while fetching a diagram preview from the backend.
     * @param err
     */
    const diagramPreviewErrorHandler = (err: Error) => {
        reportError("Fehler beim Abrufen des Preview eines Diagramms: " + err);
        // activate the continue button again
        setStep0ContinueDisabled(false);
        refetchingImages.current = false;
        // deactivate the spinner
        setDisplaySpinner(false);
        setDisplayLoadMessage(false);
    }

    /**
     * Method to fetch the preview image for a single diagram from the backend by its name.
     * @param diagram The object of the diagram whose preview should be fetched.
     */
    const fetchDiagramPreview = (diagram: DiagramInfo) => {
        //("fetcher called");
        //differentiates between the source of the infoprovider name wether a new diagram is created or one is edited
        let url = "/visuanalytics/infoprovider/" + (sceneFromBackend !== undefined ? sceneFromBackend.used_infoproviders[0] : selectedId) + "/" + diagram.name;
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "GET",
            headers: {},
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.blob();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) diagramPreviewSuccessHandler(data, diagram)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) diagramPreviewErrorHandler(err)
        }).finally(() => clearTimeout(timer));
    }

    const sceneFromBackendMutable = React.useRef(props.sceneFromBackend)


    /**
     * Calls for sessionStorage handling
     */
    React.useEffect(() => {
        //step
        setSceneEditorStep(Number(sessionStorage.getItem("sceneEditorStep-" + uniqueId)||0));
        //infoProviderList
        setInfoProviderList(sessionStorage.getItem("infoProviderList-" + uniqueId) === null ? new Array<InfoProviderData>() : JSON.parse(sessionStorage.getItem("infoProviderList-" + uniqueId)!));
        //infoProvider
        setInfoProvider(sessionStorage.getItem("infoProvider-" + uniqueId )=== null ? new Array<DataSource>() : JSON.parse(sessionStorage.getItem("infoProvider-" + uniqueId)!));
        //selectedDataList
        setSelectedDataList(sessionStorage.getItem("selectedDataList-" + uniqueId )=== null ? new Array<string>() : JSON.parse(sessionStorage.getItem("selectedDataList-" + uniqueId)!))
        //selectedDataList
        setCustomDataList(sessionStorage.getItem("customDataList-" + uniqueId )=== null ? new Array<string>() : JSON.parse(sessionStorage.getItem("customDataList-" + uniqueId)!))
        //selectedDataList
        setHistorizedDataList(sessionStorage.getItem("historizedDataList-" + uniqueId )=== null ? new Array<HistorizedDataInfo>() : JSON.parse(sessionStorage.getItem("historizedDataList-" + uniqueId)!))
        //diagramList
        setDiagramList(sessionStorage.getItem("diagramList-" + uniqueId )=== null ? new Array<DiagramInfo>() : JSON.parse(sessionStorage.getItem("diagramList-" + uniqueId)!))
        //selectedId
        setSelectedId(Number(sessionStorage.getItem("selectedId-" + uniqueId)||0));

        //TODO: document this
        //dont set the data for editing when fetching first
        if (sessionStorage.getItem("firstSceneCreationEntering-" + uniqueId) !== null) {
            //fetchImageDialogOpen
            setFetchImageDialogOpen(sessionStorage.getItem("fetchImageDialogOpen-" + uniqueId) === "true");
            //editId
            setEditId(Number(sessionStorage.getItem("editId-" + uniqueId)));
            //sceneFromBackend
            setSceneFromBackend(sessionStorage.getItem("sceneFromBackend-" + uniqueId) === null ? undefined : JSON.parse(sessionStorage.getItem("sceneFromBackend-" + uniqueId)!))
            sceneFromBackendMutable.current = sessionStorage.getItem("sceneFromBackend-" + uniqueId) === null ? undefined : JSON.parse(sessionStorage.getItem("sceneFromBackend-" + uniqueId)!)
        } else {
            //leave a marker in the sessionStorage to identify if this is the first entering
            sessionStorage.setItem("firstSceneCreationEntering-" + uniqueId, "false");
        }

        // Reload all images, background images and diagram previews when reloading the component
        // only do this when currently in the editor itself
        if (Number(sessionStorage.getItem("sceneEditorStep-" + uniqueId)||0) === 1) {
            // set the list of diagrams to fetch by getting the data from sessionStorage:
            diagramsToFetch.current = sessionStorage.getItem("diagramList-" + uniqueId )=== null ? new Array<DiagramInfo>() : JSON.parse(sessionStorage.getItem("diagramList-" + uniqueId)!);
            // setting this variable will block the continueHandler at the end of the fetching
            refetchingImages.current = true;
            // activate the spinner
            setDisplaySpinner(true);
            //open the dialog with the button to fetch the images
            //fetchImageList()
            setFetchImageDialogOpen(true);
        } else if(Number(sessionStorage.getItem("sceneEditorStep-" + uniqueId)) === 0) {
            // when step 0 is loaded, reload the list of infoproviders from backend
            fetchAllInfoprovider();
        }
    }, [fetchAllInfoprovider])

    //store step in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("sceneEditorStep-" + uniqueId, sceneEditorStep.toString());
    }, [sceneEditorStep])
    //store infoProviderList in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("infoProviderList-" + uniqueId, JSON.stringify(infoProviderList));
    }, [infoProviderList])
    //store infoProvider in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("infoProvider-" + uniqueId, JSON.stringify(infoProvider));
    }, [infoProvider])
    //store selectedDataList in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("selectedDataList-" + uniqueId, JSON.stringify(selectedDataList));
    }, [selectedDataList])
    //store customDataList in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("customDataList-" + uniqueId, JSON.stringify(customDataList));
    }, [customDataList])
    //store historizedDataList in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("historizedDataList-" + uniqueId, JSON.stringify(historizedDataList));
    }, [historizedDataList])
    //store diagramList in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("diagramList-" + uniqueId, JSON.stringify(diagramList));
    }, [diagramList])
    //store imageList in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("imageList-" + uniqueId, JSON.stringify(imageList));
    }, [imageList])
    //store selectedId in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("selectedId-" + uniqueId, selectedId.toString());
    }, [selectedId])
    //store fetchImageDialogOpen in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("fetchImageDialogOpen-" + uniqueId, fetchImageDialogOpen ? "true" : "false");
    }, [fetchImageDialogOpen])
    //store sceneFromBackend in sessionStorage
    React.useEffect(() => {
        //storing is only necessary if the value is defined
        if(sceneFromBackend !== undefined)
            sessionStorage.setItem("sceneFromBackend-" + uniqueId, JSON.stringify(sceneFromBackend));
    }, [sceneFromBackend])
    //store editId in sessionStorage
    React.useEffect(() => {
        //storing is only necessary if the value is defined
        if(editId !==undefined)
            sessionStorage.setItem("editId-" + uniqueId, editId.toString());
    }, [editId])

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
        sessionStorage.removeItem("imageList-" + uniqueId);
        sessionStorage.removeItem("selectedId-" + uniqueId);
        sessionStorage.removeItem("fetchImageDialogOpen-" + uniqueId);
        sessionStorage.removeItem("firstSceneCreationEntering-" + uniqueId);
        sessionStorage.removeItem("sceneFromBackend-" + uniqueId);
        sessionStorage.removeItem("editId-" + uniqueId);
    }


    /**
     * Method that is used for calculating a list of diagrams in the
     * representation a scene needs them. Used for restoring the
     * diagrams in the editing mode.
     * @param diagrams
     */
    const getDiagramFetchList = React.useCallback((diagrams: Array<Diagram>) => {
        //go through all diagrams
        const diagramList: Array<DiagramInfo> = [];
        diagrams.forEach((diagram) => {
            //transforms the type into a readable form
            let typeString = "";
            switch(diagram.variant) {
                case "pieChart": {
                    typeString = "Tortendiagramm";
                    break;
                }
                case "lineChart": {
                    typeString = "Liniendiagramm";
                    break;
                }
                case "horizontalBarChart": {
                    typeString = "Balkendiagramm";
                    break;
                }
                case "verticalBarChart": {
                    typeString = "Säulendiagramm";
                    break;
                }

                case "dotDiagram":
                    typeString = "Punktdiagramm";
            }
            diagramList.push({
                name: diagram.name,
                type: typeString,
                url: ""
            })
        })
        return diagramList;
    }, [])

    //extract the sceneFromBackend from the props - necessary to dont have endless loop
    //which results of the usage of the state variable
    const propsSceneFromBackend = props.sceneFromBackend;

    /**
     * When loading in editing mode, find all images in the items array
     * and reset their Image HTML element to empty source.
     * This is necessary to prevent failures.
     * Also sets the diagramList to the list extracted from the backend data.
     */
    React.useEffect(() => {
        //console.log("cleaning of image elements")
        //check if editing is active
        if(sceneFromBackendMutable.current !== undefined) {
            const sceneItemsCopy = sceneFromBackendMutable.current.scene_items.slice();
            for (let index = 0; index < sceneItemsCopy.length; index++) {
                //check if the current item is an image
                if(sceneItemsCopy[index].hasOwnProperty("image")) {
                    let castedItem = sceneItemsCopy[index] as CustomImage;
                    //create a new image
                    castedItem.image = new window.Image();
                    //if it is a diagram, we need to find it in the diagramList instead of the imageList
                    castedItem.image.src = "";
                    sceneItemsCopy[index] = castedItem;
                }
            }
            setSceneFromBackend({
                ...sceneFromBackendMutable.current,
                scene_items: sceneItemsCopy
            })
            if(sceneFromBackendMutable.current.infoProvider !== undefined) {
                diagramsToFetch.current = getDiagramFetchList(sceneFromBackendMutable.current.infoProvider.diagrams)
            }
            //console.log(diagramsToFetch.current);
        }
    }, [propsSceneFromBackend, getDiagramFetchList])

    /**
     * Sets a warning for reloading in step 1.
     */
    React.useEffect(() => {
        const leaveAlert = (e: BeforeUnloadEvent) => {
            //uses sessionStorage to avoid dependency to step since it would not safely trigger this handler
            //dirty workaround but should be okay
            if(Number(sessionStorage.getItem("sceneEditorStep-" + uniqueId) || 0) === 1) {
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
     * Returns the rendered component based on the current step.
     * @param step The number of the current step
     */
    const selectContent = (step: number) => {
        switch (step) {
            case 0:
                return props.sceneFromBackend !==undefined ? (
                    <React.Fragment></React.Fragment>
                ) : (
                    <InfoProviderSelection
                        continueHandler={() => setSceneEditorStep(step+1)}
                        backHandler={() => handleBack()}
                        infoProviderList={infoProviderList}
                        reportError={reportError}
                        setInfoProvider={(infoProvider: FrontendInfoProvider) => setInfoProvider(infoProvider)}
                        setSelectedDataList={(list: Array<string>) => setSelectedDataList(list)}
                        setCustomDataList={(list: Array<string>) => setCustomDataList(list)}
                        setHistorizedDataList={(list: Array<HistorizedDataInfo>) => setHistorizedDataList(list)}
                        setArrayProcessingList={(list: Array<string>) => setArrayProcessingList(list)}
                        setStringReplacementList={(list: Array<string>) => setStringReplacementList(list)}
                        setDiagramList={(list: Array<DiagramInfo>) => setDiagramList(list)}
                        fetchImages={() => fetchImageList()}
                        step0ContinueDisabled={step0ContinueDisabled}
                        setStep0ContinueDisabled={(disabled: boolean) => setStep0ContinueDisabled(disabled)}
                        selectedId={selectedId}
                        setSelectedId={(id: number) => setSelectedId(id)}
                        diagramsToFetch={diagramsToFetch}
                        displayLoadMessage={displayLoadMessage}
                        setDisplayLoadMessage={(display: boolean) => setDisplayLoadMessage(display)}
                    />
                )
            case 1:
                // if the application is currently refetching images, display a spinner
                if(displaySpinner) {
                    return (
                        <StepFrame
                            heading={"Szenen-Editor"}
                            hintContent={hintContents.typeSelection}
                            large={"xl"}
                        >
                            {!fetchImageDialogOpen &&
                                <React.Fragment>
                                    <Typography>
                                        Bilder, Hintergrundbilder und Diagramme werden erneut geladen...
                                    </Typography>
                                    <CircularProgress/>
                                </React.Fragment>
                            }
                        </StepFrame>
                    )
                } else {
                    return (
                        <SceneEditor
                            continueHandler={() => handleContinue()}
                            backHandler={() => handleBack()}
                            infoProvider={infoProvider}
                            infoProviderId={selectedId}
                            selectedDataList={selectedDataList}
                            customDataList={customDataList}
                            historizedDataList={historizedDataList}
                            arrayProcessingList={arrayProcessingList}
                            stringReplacementList={stringReplacementList}
                            diagramList={diagramList}
                            imageList={imageList}
                            setImageList={(images: Array<ImageFrontendData>) => setImageList(images)}
                            backgroundImageList={backgroundImageList}
                            setBackgroundImageList={(backgrounds: Array<ImageFrontendData>) => setBackgroundImageList(backgrounds)}
                            editMode={false}
                            reportError={(message: string) => reportError(message)}
                            fetchImageById={fetchImageById}
                            fetchBackgroundImageById={fetchBackgroundImageById}
                            sceneFromBackend={sceneFromBackend !== undefined ? sceneFromBackend : props.sceneFromBackend}
                            sessionStorageFullClear={clearSessionStorage}
                            editId={editId !== undefined ? editId : props.editId}
                        />
                    )
                }
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
            { !fetchImageDialogOpen &&
                selectContent(sceneEditorStep)
            }
            <CenterNotification
                handleClose={() => dispatchMessage({ type: "close" })}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
            { fetchImageDialogOpen &&
                <StepFrame
                    heading={"Szenen-Editor"}
                    hintContent={hintContents.typeSelection}
                    large={"xl"}
                >
                    <Dialog
                        aria-labelledby="backDialog-title"
                            open={fetchImageDialogOpen}>
                        <DialogTitle id="backDialog-title">
                            Bilder erneut laden
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography gutterBottom>
                                Durch das Neuladen der Seite müssen alle Bilder, Hintergrundbilder und Diagramme erneut geladen werden.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Grid container justify="space-around">
                                <Grid item>
                                    <Button variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                setFetchImageDialogOpen(false);
                                                fetchImageList();
                                            }}
                                    >
                                        Laden starten
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Dialog>
                </StepFrame>
            }
        </React.Fragment>
    );
}
