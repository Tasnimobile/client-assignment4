import Header from "./Header";
import React from "react";
import { connect } from "react-redux";
import { addCampusThunk } from "../../store/thunks";
import { NewCampusView } from "../views";

const NewCampusContainer = (props) => {
  const { addCampus } = props;

  return (
    <div>
      <Header />
      <NewCampusView addCampus={addCampus} />
    </div>
  );
};

const mapDispatch = (dispatch) => {
  return {
    addCampus: (campus) => dispatch(addCampusThunk(campus)),
  };
};

export default connect(null, mapDispatch)(NewCampusContainer);