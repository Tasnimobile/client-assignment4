import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const EditCampusView = ({ campus, editCampus }) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (campus) {
      setName(campus.name || "");
      setAddress(campus.address || "");
      setDescription(campus.description || "");
    }
  }, [campus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = { id: campus.id, name, address, description };
    if (editCampus) {
      await editCampus(updated);
      history.push(`/campus/${campus.id}`);
    } else {
      console.warn('editCampus prop not provided');
    }
  };

  if (!campus) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Campus</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

EditCampusView.propTypes = {
  campus: PropTypes.object,
  editCampus: PropTypes.func.isRequired,
};

export default EditCampusView;
