import PropTypes from "prop-types";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const NewCampusView = ({ addCampus }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [imageurl, setImageurl] = useState("");
    const [submitError, setSubmitError] = useState(null);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        const newCampus = { name, address, description, imageurl: imageurl || null };
        const created = await addCampus(newCampus);
        if (created && created.id) {
            history.push("/campuses");
        }
        else {
            history.push("/campuses");
        }
    };

    return (
        <div>
            <h1>Add New Campus</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} required/>
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
                    {imageurl && (
                        <div style={{ marginTop: 8 }}>
                            <img
                                src={imageurl}
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
                <button type="submit">Create Campus</button>
            </form>
        </div>
    );
};

NewCampusView.propTypes = { addCampus: PropTypes.func.isRequired };
export default NewCampusView;

