/*==================================================
AllStudentsContainer.js
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { 
  fetchAllStudentsThunk,
  deleteStudentThunk
} from '../../store/thunks';

import AllStudentsView from '../views/AllStudentsView';

class AllStudentsContainer extends Component {
  componentDidMount() {
    this.props.fetchAllStudents();
  }

  render(){
    return(
      <div>
        <Header />
        <AllStudentsView 
          students={this.props.allStudents}
          deleteStudent={this.props.deleteStudent}
        />
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    allStudents: state.allStudents,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchAllStudents: () => dispatch(fetchAllStudentsThunk()),
    deleteStudent: (studentId) => dispatch(deleteStudentThunk(studentId)),
  };
};

export default withRouter(connect(mapState, mapDispatch)(AllStudentsContainer));
