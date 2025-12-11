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
  const PLACEHOLDER = "https://via.placeholder.com/300x200?text=No+Image";

  // If container provided a fetchAllStudents function (for assigning existing students), call it once
  useEffect(() => {
    if (props.fetchAllStudents) props.fetchAllStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug: log when campus prop changes to help diagnose refresh issues
  useEffect(() => {
    console.log('CampusView: campus prop updated', props.campus);
  }, [props.campus]);

  if (!campus) return <div>Loading campus...</div>;

  // const handleRemoveStudent = (student) => {
  //   if (window.confirm(`Remove ${student.firstname} ${student.lastname} from this campus?`)) {
  //     // If you want to only unassign (not delete), call editStudent with campusId null
  //     if (props.editStudent) {
  //       props.editStudent({ ...student, campusId: null });
  //     } else if (props.deleteStudent) {
  //       // fallback: delete the student entirely if edit isn't available
  //       props.deleteStudent(student.id);
  //     } else {
  //       console.warn('No editStudent or deleteStudent prop provided');
  //     }
  //   }
  // };
  const handleRemoveStudent = async (student) => {
    if (!window.confirm(`Remove ${student.firstname} ${student.lastname} from this campus?`)) return;

    // Prefer unassign (edit student -> campusId: null). If editStudent not available, fallback to deleteStudent.
    if (props.editStudent) {
      try {
        console.log('CampusView: unassigning student', student.id, 'from campus', campus.id);
        await props.editStudent({ ...student, campusId: null });
        console.log('CampusView: editStudent resolved for unassign');
        if (props.fetchCampus) {
          const refreshed = await props.fetchCampus(campus.id);
          console.log('CampusView: fetchCampus result after unassign', refreshed);
        } else if (props.fetchAllStudents) {
          const refreshedAll = await props.fetchAllStudents();
          console.log('CampusView: fetchAllStudents result after unassign', refreshedAll);
        }
      } catch (err) {
        console.error('Unassign student failed:', err);
      }
    } else if (props.deleteStudent) {
      try {
        await props.deleteStudent(student.id);
        if (props.fetchCampus) {
          await props.fetchCampus(campus.id);
        } else if (props.fetchAllStudents) {
          await props.fetchAllStudents();
        }
      } catch (err) {
        console.error('Delete student failed:', err);
      }
    } else {
      console.warn('No editStudent or deleteStudent prop provided');
    }
  };

  // const handleAssignExisting = () => {
  //   if (!selectedStudentId) return;
  //   const id = parseInt(selectedStudentId, 10);
  //   const studentObj = (props.allStudents || []).find(s => s.id === id);
  //   if (!studentObj) return;
  //   // assign student to this campus
  //   if (props.editStudent) {
  //     props.editStudent({ ...studentObj, campusId: campus.id });
  //     setSelectedStudentId("");
  //   } else {
  //     console.warn('editStudent prop not provided');
  //   }
  // };
  const handleAssignExisting = async () => {
    if (!selectedStudentId) return;
    const id = parseInt(selectedStudentId, 10);
    const studentObj = (props.allStudents || []).find(s => s.id === id);
    if (!studentObj) return;

    if (props.editStudent) {
      try {
        console.log('CampusView: assigning student', studentObj.id, 'to campus', campus.id);
        // update server
        await props.editStudent({ ...studentObj, campusId: campus.id });
        console.log('CampusView: editStudent resolved for assign');
        // re-fetch campus so campus.students is updated in the store and view
        if (props.fetchCampus) {
          const refreshed = await props.fetchCampus(campus.id);
          console.log('CampusView: fetchCampus result after assign', refreshed);
        } else if (props.fetchAllStudents) {
          // fallback: refresh all students list if single-campus fetch not available
          const refreshedAll = await props.fetchAllStudents();
          console.log('CampusView: fetchAllStudents result after assign', refreshedAll);
        }
        setSelectedStudentId("");
      } catch (err) {
        console.error('Assign student failed:', err);
      }
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

      <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
        <img
          src={campus.imageurl || PLACEHOLDER}
          alt={`${campus.name} `}
          style={{ width: 300, height: 200, objectFit: "cover", borderRadius: 6 }}
          onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
          loading="lazy"
        />
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