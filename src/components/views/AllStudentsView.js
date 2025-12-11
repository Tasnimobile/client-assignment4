/*==================================================
AllStudentsView.js
================================================== */
import { Link } from "react-router-dom";

const AllStudentsView = (props) => {
  const { students, deleteStudent } = props;

  if (!students.length) {
    return (
      <div>
        <p>There are no students.</p>
        <Link to="/newstudent">
          <button>Add New Student</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>All Students</h1>

      {students.map((student) => {
        let name = student.firstname + " " + student.lastname;
        return (
          <div key={student.id}>
            <Link to={`/student/${student.id}`}>
              <h2>{name}</h2>
            </Link>

            <button onClick={() => deleteStudent(student.id)}>
              Delete
            </button>

            <hr />
          </div>
        );
      })}

      <br />
      <Link to="/newstudent">
        <button>Add New Student</button>
      </Link>
    </div>
  );
};

export default AllStudentsView;
