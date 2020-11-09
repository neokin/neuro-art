import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PickArtist from "./PickArtist";
import UploadPhoto from "./UploadPhoto";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
// custom icons for stepper
// import Check from "@material-ui/icons/Check";
// import SettingsIcon from "@material-ui/icons/Settings";
// import GroupAddIcon from "@material-ui/icons/GroupAdd";
// import VideoLabelIcon from "@material-ui/icons/VideoLabel";
// import StepConnector from "@material-ui/core/StepConnector";
import Button from "@material-ui/core/Button";
import StyledPhoto from "./StyledPhoto";

const SUBMIT_PHOTO_ENDPOINT = "";
const artistList = ["Monet", "Picasso", "Van Gogh"];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// These are the steps to be shown in the stepper
function getSteps() {
  return ["Pick a style to apply", "Upload your image", "Become an artist"];
}

function Canvas() {
  // Styles Hook
  const classes = useStyles();
  // Local State
  const [artist, setArtist] = useState(artistList[0]);
  const [picture, setPicture] = useState([]);
  const [styledPicture, setStyledPicture] = useState(null);
  const [rating, setRating] = useState(0);
  // Local State utilities
  const [loadingImage, setLoadingImage] = useState(false);

  // OnChange Controllers for Local State
  const handleArtistChange = (event) => {
    setArtist(event.target.value);
  };
  const onDrop = (pictureFiles, pictureDataURLs) => {
    setPicture((prevPics) => [...prevPics, ...pictureFiles]);
  };
  const handleRatingChange = (event, value) => {
    setRating(value);
  };

  // Send Photo to back
  const submitPhoto = async (picture) => {
    try {
      setLoadingImage(true);
      let bodyFormData = new FormData();
      if (picture.type === "image/jpeg") {
        bodyFormData.append("image", picture);
        const { data } = await axios.post(
          SUBMIT_PHOTO_ENDPOINT,
          bodyFormData
          );
          
          setStyledPicture(data);
          setLoadingImage(false);
      }
    } catch (e) {}
  };

  // Stepper Component
  // This is the content on each step
  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <>
            {" "}
            <PickArtist
              style={classes}
              artistList={artistList}
              artist={artist}
              handleArtistChange={handleArtistChange}
            />
          </>
        );
      case 1:
        return (
          <>
            {" "}
            <UploadPhoto onDrop={onDrop} />
          </>
        );
      case 2:
        return (
          <>
            <StyledPhoto handleRatingChange={handleRatingChange} />
          </>
        );
      default:
        return "Unknown stepIndex";
    }
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Navbar />
      <Container>
        {/* TODO: Make separate components out of each */}
        <Grid container spacing={3}>
          <Grid item md={12}>
            <div className={classes.root}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div>
                {activeStep === steps.length ? (
                  <div>
                    <Typography className={classes.instructions}>
                      Don't forget to share!
                    </Typography>
                    <Button onClick={handleReset}>Try again</Button>
                  </div>
                ) : (
                  <Grid
                    container
                    style={{ height: "100%", textAlign: "center" }}
                  >
                    {getStepContent(activeStep)}

                    <Grid
                      item
                      xs={12}
                      style={{ height: "100%", textAlign: "center" }}
                    >
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.backButton}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                      >
                        {activeStep === steps.length - 1
                          ? "Send Rating"
                          : "Next"}
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={3}></Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Canvas;
