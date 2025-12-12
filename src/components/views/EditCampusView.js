import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const EditCampusView = ({ campus, editCampus }) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (campus) {
      setName(campus.name || "");
      setAddress(campus.address || "");
      setDescription(campus.description || "");
      setImageurl(campus.imageurl || "");
    }
  }, [campus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const updated = { id: campus.id, name, address, description, imageurl: imageurl || null };
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
        <div>
          <label>Image URL</label>
          <input
            type="text"
            value={imageurl}
            onChange={e => setImageurl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {(imageurl || campus.imageurl) && (
            <div style={{ marginTop: 8 }}>
              <img
                src={imageurl || campus.imageurl || "https://via.placeholder.com/300x200?text=No+Image"}
                alt="Campus preview"
                style={{ width: 300, height: 200, objectFit: "cover", borderRadius: 6 }}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; }}
                loading="lazy"
              />
            </div>
          )}
        </div>

        {submitError && (
          <div style={{ color: "red", marginTop: 10 }}>
            {submitError}
          </div>
        )}
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
