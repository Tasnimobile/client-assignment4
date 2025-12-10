/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

// Take in props data to construct the component
const CampusView = (props) => {
  const { campus } = props;
  const history = useHistory();
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // If container provided a fetchAllStudents function (for assigning existing students), call it once
  useEffect(() => {
    if (props.fetchAllStudents) props.fetchAllStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!campus) return <div>Loading campus...</div>;

  const handleRemoveStudent = (student) => {
    if (window.confirm(`Remove ${student.firstname} ${student.lastname} from this campus?`)) {
      // If you want to only unassign (not delete), call editStudent with campusId null
      if (props.editStudent) {
        props.editStudent({ ...student, campusId: null });
      } else if (props.deleteStudent) {
        // fallback: delete the student entirely if edit isn't available
        props.deleteStudent(student.id);
      } else {
        console.warn('No editStudent or deleteStudent prop provided');
      }
    }
  };

  const handleAssignExisting = () => {
    if (!selectedStudentId) return;
    const id = parseInt(selectedStudentId, 10);
    const studentObj = (props.allStudents || []).find(s => s.id === id);
    if (!studentObj) return;
    // assign student to this campus
    if (props.editStudent) {
      props.editStudent({ ...studentObj, campusId: campus.id });
      setSelectedStudentId("");
    } else {
      console.warn('editStudent prop not provided');
    }
  };

  const handleDeleteCampus = () => {
    if (!window.confirm('Delete this campus? This action cannot be undone.')) return;
    if (props.deleteCampus) {
      props.deleteCampus(campus.id);
      history.push('/campuses');
    } else {
      console.warn('deleteCampus prop not provided');
    }
  };

  return (
    <div>
      <h1>{campus.name}</h1>
      {campus.id && <h4>Campus id: {campus.id}</h4>}
      {campus.address && <p>{campus.address}</p>}
      {campus.description && <p>{campus.description}</p>}

      <div style={{ textAlign: 'center' }}>
        <h3>Enrolled Students</h3>
        {!campus.students || campus.students.length === 0 ? (
          <div>There are no students enrolled at this campus.</div>
        ) : (
          campus.students.map(student => {
            let name = student.firstname + " " + student.lastname;
            return (
              <div key={student.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Link to={`/student/${student.id}`}>
                  <h4 style={{ margin: 0 }}>{name}</h4>
                </Link>
                <button onClick={() => handleRemoveStudent(student)}>Remove</button>
              </div>
            );
          })
        )}
      </div>

      <br />
      <div>
        <Link to={`/newstudent?campusId=${campus.id}`}>
          <button>Add New Student</button>
        </Link>
        {' '}
        {props.allStudents && props.allStudents.length > 0 && (
          <span style={{ marginLeft: 16 }}>
            <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
              <option value="">-- Assign existing student --</option>
              {props.allStudents.filter(s => !campus.students.some(cs => cs.id === s.id)).map(s => (
                <option key={s.id} value={s.id}>{s.firstname} {s.lastname}</option>
              ))}
            </select>
            <button onClick={handleAssignExisting} style={{ marginLeft: 8 }}>Assign</button>
          </span>
        )}
      </div>

      <br />
      <div>
        <Link to={`/campus/${campus.id}/edit`}>
          <button>Edit Campus</button>
        </Link>
        {' '}
        <button onClick={handleDeleteCampus} style={{ marginLeft: 8 }}>Delete Campus</button>
      </div>
    </div>
  );
};

CampusView.propTypes = {
  campus: PropTypes.object.isRequired,
  allStudents: PropTypes.array,
  fetchAllStudents: PropTypes.func,
  editStudent: PropTypes.func,
  deleteStudent: PropTypes.func,
  deleteCampus: PropTypes.func,
};

export default CampusView;