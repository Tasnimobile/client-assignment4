import PropTypes from "prop-types";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const NewCampusView = ({ addCampus }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newCampus = { name, address, description };
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
                <button type="submit">Create Campus</button>
            </form>
        </div>
    );
};

NewCampusView.propTypes = { addCampus: PropTypes.func.isRequired };
export default NewCampusView;

