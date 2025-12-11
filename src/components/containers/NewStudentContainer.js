/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewStudentView from '../views/NewStudentView';
import { addStudentThunk } from '../../store/thunks';

class NewStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "", 
      campusId: null, 
      redirect: false, 
      redirectId: null,
      errorMessage: null,
      email: "",
      gpa: "",
      imageurl: ""
    };
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    let student = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        campusId: this.state.campusId,
        email: this.state.email,
        gpa: this.state.gpa,
        imageurl: this.state.imageurl
    };

    // Validate email
    const email = this.state.email;
    if (email) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        this.setState({
          redirect: false,
          redirectId: null,
          errorMessage: 'Please enter a valid email address.'
        });
        return;
      }
    }

    // Validate GPA
    let payloadGpa = null;
    const rawGpa = this.state.gpa;

    // allow blank -> null
    if (rawGpa !== "" && rawGpa != null) {
      const n = Number(rawGpa);
      if (Number.isNaN(n) || n < 0 || n > 4) {
        this.setState({
          redirect: false,
          redirectId: null,
          errorMessage: 'GPA must be a number between 0.0 and 4.0.'
        });
        return;
      }
      // round to 2 decimals
      payloadGpa = Math.round(n * 100) / 100;
    }

    //validate imageurl
    let payloadImage = null;
    const rawImage = this.state.imageurl;
    if (rawImage && rawImage !== "") {
      try {
        // will throw if invalid
        new URL(rawImage);
        payloadImage = rawImage;
      } catch (err) {
        this.setState({
          redirect: false,
          redirectId: null,
          errorMessage: 'Please enter a valid image URL.'
        });
        return;
      }
    } else {
      payloadImage = null; // explicit null so backend receives the field
    }

    //validate campusid
    let payloadCampusId = null;
    const rawCampusId = this.state.campusId;
    if (rawCampusId && rawCampusId !== "") {
      const n = Number(rawCampusId);
      if (Number.isNaN(n) || !Number.isInteger(n) || n < 1) {
        this.setState({
          redirect: false,
          redirectId: null,
          errorMessage: 'Campus ID must be a positive integer.'
        });
        return;
      }
      payloadCampusId = n;
    } else {
      payloadCampusId = null; // allow blank -> null
    }


    
    try {
      // Add new student in back-end database
      let newStudent = await this.props.addStudent(student);

      if (newStudent && newStudent.id) {
        // Update state, and trigger redirect to show the new student
        this.setState({
          firstname: "",
          lastname: "",
          campusId: null,
          redirect: true,
          redirectId: newStudent.id,
          errorMessage: null
        });
      } else {
        console.error("Failed to add student:", newStudent);
        // Handle error (e.g., show an error message)
        this.setState({
          redirect: false,
          redirectId: null,
          errorMessage: 'Unable to add student. Please check the input and try again.'
        });
      }
    } catch (error) {
      console.error("Error adding student:", error);
      // Handle error (e.g., show an error message)
      // Log server-provided message for debugging, but show a friendly message to the user
      const serverMessage = error?.response?.data?.error ?? error?.response?.data?.message ?? null;
      if (serverMessage) console.error('Server message:', serverMessage);
      this.setState({
        redirect: false,
        redirectId: null,
        errorMessage: 'Unable to add student. Please check the input and try again.'
      });
    }
  }

  // Unmount when the component is being removed from the DOM:
  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      // Do not call setState on unmount; no cleanup required here.
  }
  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}  
          errorMessage={this.state.errorMessage}
          imageurl={this.state.imageurl}
        />
      </div>          
    );
  }
}

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        addStudent: (student) => dispatch(addStudentThunk(student)),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(null, mapDispatch)(NewStudentContainer);