import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const EditStudentView = ({ student, editStudent }) => {
  const history = useHistory();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [gpa, setGpa] = useState("");
  const [campusId, setCampusId] = useState("");
  const [imageurl, setImageurl] = useState("");

  useEffect(() => {
    if (student && student.id) {
      setFirstname(student.firstname || "");
      setLastname(student.lastname || "");
      setEmail(student.email || "");
      setGpa(student.gpa || "");
      setCampusId(student.campusId || "");
      setImageurl(student.imageurl || "");
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await editStudent({
      id: student.id,
      firstname,
      lastname,
      email,
      gpa: gpa === "" ? null : gpa,
      campusId: campusId === "" ? null : campusId,
      imageurl: imageurl === "" ? null : imageurl,
    });

    history.push(`/student/${student.id}`);
  };

  if (!student || !student.id) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Student</h1>

      <form onSubmit={handleSubmit}>
        <input value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="First Name" />
        <br /><br />

        <input value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Last Name" />
        <br /><br />

        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <br /><br />

        <input type="number" step="0.01" min="0" max="4"
          value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="GPA" />
        <br /><br />

        <input value={campusId} onChange={(e) => setCampusId(e.target.value)} placeholder="Campus ID" />
        <br /><br />

        <input value={imageurl} onChange={(e) => setImageurl(e.target.value)} placeholder="Image URL" />
        <br /><br />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditStudentView;
