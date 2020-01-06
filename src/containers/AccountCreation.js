import React from "react";
import { Link } from "react-router-dom";
import {
  Progress,
  Header,
  Modal,
  Button,
  Grid,
  Form,
  Message,
  Container,
  Icon
} from "semantic-ui-react";
import { css } from "@emotion/core";
import firebaseApp from "../../firebase";

const AccountCreation = () => {
  const [currentStep, UpdateCurrentStep] = React.useState(3);

  const [firstName, updateFirstName] = React.useState("");
  const [lastName, updateLastName] = React.useState("");
  const [department, updateDepartment] = React.useState("");
  const [jobTitle, updateJobTitle] = React.useState("");

  const [username, updateUserName] = React.useState("");
  const [password, updatePassword] = React.useState("");
  const [repeatPassword, updateRepeatPassword] = React.useState("")

  const [swausername, updateSWAUserName] = React.useState("");
  const [swapassword, updateSWAPassword] = React.useState("");

  const checkPassword = () => {

  }

  const step1 = () => {
    return <div>
      <Header><Icon name="info" />Let's get your basic information</Header>
      <Grid>
        <Grid.Row>
          <Grid.Column width={ 8 }>
            <Form
              type=""
              size="small"
            >
              <Form.Input
                fluid
                iconPosition="left"
                placeholder="First Name"
                value={ firstName }
                type="text"
                onChange={ e => {
                  updateFirstName(e.target.value);
                } }
              />
              <Form.Input
                fluid
                iconPosition="left"
                placeholder="Last Name"
                value={ lastName }
                type="text"
                onChange={ e => {
                  updateLastName(e.target.value);
                } }
              />
            </Form>
          </Grid.Column>
          <Grid.Column width={ 8 }>
            <Form
              type=""
              size="small"
            >
              <Form.Input
                fluid
                iconPosition="left"
                placeholder="Department"
                value={ department }
                type="text"
                onChange={ e => {
                  updateDepartment(e.target.value);
                } }
              />

              <Form.Input
                fluid
                iconPosition="left"
                placeholder="Job Title"
                value={ jobTitle }
                type="text"
                onChange={ e => {
                  updateJobTitle(e.target.value);
                } }
              />
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>

    </div>
  }

  const step2 = () => {
    return <div>
      <Header>Now let's get your username set up</Header>
      <Form
        type=""
        size="small"
      >
        <Form.Input
          fluid
          iconPosition="left"
          placeholder="Username"
          value={ username }
          type="text"
          onChange={ e => {
            updateUserName(e.target.value);
          } }
        />
        <Form.Input
          fluid
          iconPosition="left"
          placeholder="Password"
          value={ password }
          type="password"
          onChange={ e => {
            updatePassword(e.target.value);
          } }
        />
        <Form.Input
          fluid
          iconPosition="left"
          placeholder="Password"
          value={ repeatPassword }
          type="password"
          onChange={ e => {
            updateRepeatPassword(e.target.value);
          } }
        />
      </Form>
    </div>
  }

  const step3 = () => {
    return <div><Header>Now for the fun part!</Header>
      <p>Let's us get your flight data, so you don't have to worry about it.</p>
      <Form
        type=""
        size="small"
      >
        <Form.Input
          fluid
          iconPosition="left"
          placeholder="SWA EID"
          value={ swausername }
          type="text"
          onChange={ e => {
            updateSWAUserName(e.target.value);
          } }
        />
        <Form.Input
          fluid
          iconPosition="left"
          placeholder="SWA Password"
          value={ swapassword }
          type="password"
          onChange={ e => {
            updateSWAPassword(e.target.value);
          } }
        />
        <Message size="tiny"><Icon name="dont" />Don't worry, we don't store this login information </Message>
      </Form>
    </div>
  }

  const step4 = () => {
    return <div>Step4</div>
  }

  const step5 = () => {
    return <div>Step5</div>
  }

  const renderStep = (step) => {
    switch (step) {
      case 1:
        return step1()
      case 2:
        return step2()
      case 3:
        return step3()
      case 4:
        return step4()
      case 5:
        return step5()
    }
  }

  return <div>

    <Progress value={ currentStep } total="5" size="medium" color="green" active={ true } />

    <Container>
      { renderStep(currentStep) }

      <div css={ css`display: flex; flex-direction: row; justify-content: space-between; width: 100%` }>
        <Button
          color="red"
          inverted
          size="large"
          name="submit"
          onClick={ () => currentStep == 1 ? null : UpdateCurrentStep(currentStep - 1) }
        // css={ css`justify-content: flex-start;` }
        >
          Back
      </Button>
        <Button
          color="green"
          inverted
          size="large"
          name="submit"
          onClick={ () => currentStep == 5 ? null : UpdateCurrentStep(currentStep + 1) }
        // css={ css`margin-left: auto` }
        >
          Next
      </Button>
      </div>
    </Container>


  </div>


}

export default AccountCreation;