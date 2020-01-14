import React from "react";
import { Link } from "react-router-dom";
import {
  Progress,
  Header,
  Button,
  Grid,
  Form,
  Message,
  Container,
  Icon,
  Loader
} from "semantic-ui-react";
import { css } from "@emotion/core";
import axios from 'axios';
import isEmail from 'validator/es/lib/isEmail';
import isEqual from 'validator/es/lib/equals'

import { createEmailPasswordUser } from '../Auth'
import { setLatLgnAirportsForFlights, renderFlightData } from '../utils/flight_data'

import firebaseApp from "../../firebase";



const step1 = (props) => {

  const { firstName, updateFirstName, lastName, updateLastName, department, updateDepartment, jobTitle, updateJobTitle, UpdateCurrentStep, currentStep } = { ...props }
  return <div>
    <div css={ css`display: flex; flex-direction: row; justify-content: flex-end; width: auto;` }>
      <Button
        color="green"
        inverted
        size="large"
        name="submit"
        onClick={ () => UpdateCurrentStep(currentStep + 1) }
      >
        Next
      </Button>
    </div>
    <Header><Icon name="info" />Let's get your basic information</Header>
    <div css={ css`display: flex; justify-content: center;` }>
      <Grid css={ css`width: 50%` }>
        <Grid.Row css={ css`margin-top: 15px;` }>
          <Grid.Column>
            <Form
              type=""
              size="big"
            >
              <Form.Field required>
                <label>First name</label>
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
              </Form.Field>
              <Form.Field required>
                <label>Last name</label>
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
              </Form.Field>
              <Form.Field>
                <label>Department</label>
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
              </Form.Field>
              <Form.Field>
                <label>Job Title</label>
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
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  </div>
}

const step2 = (props) => {

  const { email, updateEmail, validEmail, updateValidEmail, password, updatePassword, repeatPassword, updateRepeatPassword, UpdateCurrentStep, currentStep } = { ...props }

  return <div>
    <div css={ css`display: flex; flex-direction: row; justify-content: flex-end; width: auto;` }>
      <Button
        color="red"
        inverted
        size="large"
        name="submit"
        onClick={ () => UpdateCurrentStep(currentStep - 1) }
      >
        Back
      </Button>
      <Button
        color="green"
        inverted
        size="large"
        name="submit"
        onClick={ () => UpdateCurrentStep(currentStep + 1) }
      >
        Next
      </Button>
    </div>
    <Header>Now let's get your email (which acts as your username) set up</Header>
    <Form
      type=""
      size="big"
    >
      <Form.Field required>
        <label>Email</label>
        <Form.Input
          fluid
          iconPosition="left"
          placeholder="Email"
          value={ email }
          type="text"
          onBlur={ () => updateValidEmail(isEmail(email)) }
          error={ validEmail ? null : { content: 'Please enter a valid email', pointing: 'above' } }
          onChange={ e => {
            updateEmail(e.target.value);
          } }
        />
      </Form.Field>
      <Form.Field required>
        <label>Password</label>
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
      </Form.Field>
      <Form.Field required>
        <label>Repeat Password</label>
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
      </Form.Field>
    </Form>
  </div>
}

const step3 = (props) => {
  const { swausername, updateSWAUserName, swapassword, updateSWAPassword, swaFlightData, updateSwaFlightData, loading, updateLoading, UpdateCurrentStep, currentStep } = { ...props }

  const fetchFlightData = () => {
    updateLoading(true);
    console.log("fetching data - ", loading);
    axios({
      method: 'post',
      url: 'https://us-central1-nonrev-tracker.cloudfunctions.net/getSwaFlightData',
      data: {
        username: swausername,
        password: swapassword
      }
    }).then((response) => {
      const { updatedData } = setLatLgnAirportsForFlights(response.data)
      updateSwaFlightData(updatedData);
      updateLoading(false);
      console.log(response);
    });
  }

  return <div>
    <div css={ css`display: flex; flex-direction: row; justify-content: flex-end; width: auto;` }>
      <Button
        color="red"
        inverted
        size="large"
        name="submit"
        onClick={ () => UpdateCurrentStep(currentStep - 1) }
      >
        Back
      </Button>
      <Button
        color="green"
        inverted
        size="large"
        name="submit"
        onClick={ () => UpdateCurrentStep(currentStep + 1) }
      >
        Next
      </Button>
    </div>
    <Header>Now for the fun part!</Header>
    <p>Let's us get your flight data, so you don't have to worry about it.</p>
    <Form
      type=""
      size="big"
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
      <Button
        color="green"
        inverted
        size="large"
        name="submit"
        onClick={ () => { updateLoading(true); fetchFlightData() } }
      >
        Fetch Flight Data
        </Button>
    </Form>
    <div css={ css`margin-top:50px; margin-bottom: 20px;` }>
      <div>
        { swaFlightData ? renderFlightData(swaFlightData) :
          loading ? <Loader active inline /> : <p>no data yet</p> }
      </div>
    </div>
  </div >
}

const step4 = (props) => {

  const { firstName, lastName, department, jobTitle, email, password, swaFlightData, UpdateCurrentStep, currentStep } = { ...props }
  return <div>
    <div css={ css`display: flex; flex-direction: row; justify-content: flex-end; width: auto;` }>
      <Button
        color="red"
        inverted
        size="large"
        name="submit"
        onClick={ () => UpdateCurrentStep(currentStep - 1) }
      >
        Back
      </Button>
      <Button
        color="green"
        inverted
        size="large"
        name="submit"
        onClick={ () => { console.log(" creating account"); createEmailPasswordUser(email, password) } }
      >
        Create Account
      </Button>
    </div>
    <Header>Review and submit!</Header>
    <Grid columns={ 2 }>
      <Grid.Row>
        <Grid.Column>First Name : { firstName ? firstName : "" }</Grid.Column>
        <Grid.Column>Last Name : { lastName ? lastName : "" }</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>Department: { department ? department : "" }</Grid.Column>
        <Grid.Column>Job Title: { jobTitle ? jobTitle : "" }</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>Email: { email ? email : "" }</Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid.Row>
      <Grid.Row>
        { swaFlightData ? renderFlightData(swaFlightData) : <p>No Flight Data</p> }
      </Grid.Row>
    </Grid>
  </div >
}






const AccountCreation = () => {
  const [currentStep, UpdateCurrentStep] = React.useState(2);

  const [firstName, updateFirstName] = React.useState("");
  const [lastName, updateLastName] = React.useState("");
  const [department, updateDepartment] = React.useState("");
  const [jobTitle, updateJobTitle] = React.useState("");

  const [email, updateEmail] = React.useState("");
  const [validEmail, updateValidEmail] = React.useState(true)
  const [password, updatePassword] = React.useState("");
  const [repeatPassword, updateRepeatPassword] = React.useState("")

  const [swausername, updateSWAUserName] = React.useState("");
  const [swapassword, updateSWAPassword] = React.useState("");
  const [swaFlightData, updateSwaFlightData] = React.useState(null);
  const [loading, updateLoading] = React.useState(false);

  const step1props = {
    firstName, updateFirstName, lastName, updateLastName, department, updateDepartment, jobTitle, updateJobTitle, UpdateCurrentStep, currentStep
  }

  const step2props = {
    email, updateEmail, validEmail, updateValidEmail, password, updatePassword, repeatPassword, updateRepeatPassword, currentStep, UpdateCurrentStep
  }

  const step3props = {
    swausername, updateSWAUserName, swapassword, updateSWAPassword, swaFlightData, updateSwaFlightData, loading, updateLoading, UpdateCurrentStep, currentStep
  }

  const step4props = {
    firstName, lastName, department, jobTitle, email, password, swaFlightData, UpdateCurrentStep, currentStep
  }

  // const checkPassword = () => {

  // }

  const renderStep = (step) => {
    switch (step) {
      case 1:
        return step1(step1props)
      case 2:
        return step2(step2props)
      case 3:
        return step3(step3props)
      case 4:
        return step4(step4props)
    }
  }

  return <div css={ css`height: 100%` }>

    <Progress value={ currentStep } total="4" size="medium" color="green" active={ true } />

    <Container>
      {/* <div css={ css`display: flex; flex-direction: row; justify-content: flex-end; width: auto;` }>
        { (currentStep > 1 && currentStep < 5) &&
          <Button
            color="red"
            inverted
            size="large"
            name="submit"
            onClick={ () => currentStep == 1 ? null : UpdateCurrentStep(currentStep - 1) }
          >
            Back
          </Button> }
        { currentStep < 4 &&
          <Button
            color="green"
            inverted
            size="large"
            name="submit"

            onClick={ () => currentStep == 4 ? null : UpdateCurrentStep(currentStep + 1) }
          >
            Next
        </Button> }

        { currentStep === 4 &&
          <Button
            color="green"
            inverted
            size="large"
            name="submit"
            onClick={ () => createEmailPasswordUser(email, password) }
          >
            Create Account
        </Button> }

      </div> */}

      { renderStep(currentStep) }

    </Container>


  </div>


}

export default AccountCreation;