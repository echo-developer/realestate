import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AuthUser from "../Authentication/AuthUser";
import { Landmark_tab } from "../post/PropertyData";

const EditLandmarkData = ({ value, onChange }) => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const { project_id } = router.query;
  const [projectDetails, setProjectDetails] = useState({});
  const [selectedLandmark, setSelectedLandmark] = useState("");
  const [selectedLandmarkDetails, setSelectedLandmarkDetails] = useState(null);
  const [landmarkEditMode, setLandmarkEditMode] = useState(null);
  const [newLandmarks, setNewLandmarks] = useState([{ landmark_value: "", distance: "" }]);

  useEffect(() => {
    if (project_id) {
      fetchProjectData(project_id);
    }
  }, [project_id]);

  const fetchProjectData = async (project_id) => {
    try {
      const response = await callApi({
        api: `/get_unique_project/${project_id}`,
        method: "GET",
      });
      if (response) {
        setProjectDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  const handleLandmarkClick = (name) => {
    setSelectedLandmark(name);
    const landmark = projectDetails.landmarks?.find((l) => l.landmark_name === name);
    setSelectedLandmarkDetails(landmark || { details: [] });
  };

  const handleLandmarkValueChange = (e, index, field) => {
    if (!selectedLandmarkDetails) return;
    const updatedDetails = [...selectedLandmarkDetails.details];
    updatedDetails[index] = { ...updatedDetails[index], [field]: e.target.value };
    setSelectedLandmarkDetails({
      ...selectedLandmarkDetails,
      details: updatedDetails,
    });
  };

  const handleNewLandmarkChange = (e, index, field) => {
    const updatedNewLandmarks = [...newLandmarks];
    updatedNewLandmarks[index][field] = e.target.value;
    setNewLandmarks(updatedNewLandmarks);
  };

  const addNewLandmarkField = () => {
    setNewLandmarks([...newLandmarks, { landmark_value: "", distance: "" }]);
  };

  const handleLandmarkSave = () => {
    if (!selectedLandmarkDetails) {
      console.error("Selected landmark details are not available");
      return;
    }

    // Filter out new landmarks that have both landmark_value and distance
    const validNewLandmarks = newLandmarks.filter(
      (item) => item.landmark_value && item.distance
    );

    // Update the selected landmark with new landmarks
    const updatedSelectedLandmark = {
      ...selectedLandmarkDetails,
      details: [...selectedLandmarkDetails.details, ...validNewLandmarks],
    };

    // Check if the selected landmark exists in the project details
    const landmarkExists = projectDetails.landmarks.some(
      (landmark) => landmark.landmark_name === selectedLandmark
    );

    let finalLandmarks;

    if (landmarkExists) {
      finalLandmarks = projectDetails.landmarks.map((landmark) =>
        landmark.landmark_name === selectedLandmark
          ? updatedSelectedLandmark
          : landmark
      );
    } else {
      finalLandmarks = [
        ...projectDetails.landmarks,
        { landmark_name: selectedLandmark, ...updatedSelectedLandmark },
      ];
    }

    // Update the parent state through onChange
    onChange(finalLandmarks);

    // Exit edit mode and reset new landmarks
    setLandmarkEditMode(null);
    setNewLandmarks([{ landmark_value: "", distance: "" }]);
  };

  const renderLandmarkEditMode = (index, field) => (
    <input
      type="text"
      className="form-control"
      value={selectedLandmarkDetails?.details[index][field] || ""}
      onChange={(e) => handleLandmarkValueChange(e, index, field)}
    />
  );

  return (
    <div>
      <React.Fragment>
        <div>
          <ul className="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
            {Landmark_tab.map((landmark, index) => (
              <li className="nav-item" key={index}>
                <a
                  onClick={() => handleLandmarkClick(landmark.key)}
                  className={`nav-link ${selectedLandmark === landmark.key ? "active" : ""}`}
                >
                  <span className="btn btn-info text-light mb-1 ml-0" style={{ marginRight: "10px" }}>
                    {landmark.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {selectedLandmarkDetails ? (
            <ul>
              {selectedLandmarkDetails.details.map((detail, index) => (
                <li key={index}>
                  Landmark:
                  {landmarkEditMode === `landmark_value_${index}` ? (
                    renderLandmarkEditMode(index, "landmark_value")
                  ) : (
                    <>
                      {detail.landmark_value}
                      <i
                        style={{ marginLeft: "20px" }}
                        className="icon-feather-edit"
                        onClick={() => setLandmarkEditMode(`landmark_value_${index}`)}
                      ></i>
                    </>
                  )}
                  <br />
                  Distance:
                  {landmarkEditMode === `distance_${index}` ? (
                    renderLandmarkEditMode(index, "distance")
                  ) : (
                    <>
                      {detail.distance}
                      <i
                        style={{ marginLeft: "20px" }}
                        className="icon-feather-edit"
                        onClick={() => setLandmarkEditMode(`distance_${index}`)}
                      ></i>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div>No Record Found</div>
          )}

          {selectedLandmark && (
            <>
              <h4>Add New Landmark Data:</h4>
              {newLandmarks.map((landmark, index) => (
                <div key={index} className="row mb-3">
                  <div className="col-sm-6">
                    <label className="form-label">Landmark</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Landmark Name"
                      value={landmark.landmark_value}
                      onChange={(e) =>
                        handleNewLandmarkChange(e, index, "landmark_value")
                      }
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Distance (KM)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Distance"
                      value={landmark.distance}
                      onChange={(e) =>
                        handleNewLandmarkChange(e, index, "distance")
                      }
                    />
                  </div>
                </div>
              ))}
              <button className="btn btn-primary" onClick={addNewLandmarkField}>
                Add More
              </button>
              <br />
              <button className="btn btn-success mt-3" onClick={handleLandmarkSave}>
                Save Landmarks
              </button>
            </>
          )}
        </div>
      </React.Fragment>
    </div>
  );
};

export default EditLandmarkData;
