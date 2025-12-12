/*==================================================
StudentView.js
================================================== */
import { Link } from "react-router-dom";

const StudentView = (props) => {
  const { student } = props;

  if (!student.id) {
    return <p>Loading student...</p>;
  }

  return (
    <div>
      <h1>{student.firstname} {student.lastname}</h1>

      {student.campus ? (
        <div>
          <h3>Campus: {student.campus.name}</h3>
          <Link to={`/campus/${student.campus.id}`}>View Campus</Link>
        </div>
      ) : (
        <h3>This student is not enrolled in a campus.</h3>
      )}

      <p>Email: {student.email}</p>
      <p>GPA: {student.gpa}</p>

      <br />
      <Link to={`/student/${student.id}/edit`}>
        <button>Edit Student</button>
      </Link>

      <br />
      <Link to="/students">← Back to All Students</Link>
    </div>
  );
};

export default StudentView;
