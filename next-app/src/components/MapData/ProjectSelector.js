import React from "react";

const ProjectSelector = ({ formData, setFormData, projectList }) => {
  const handleChange = (e) => {
    const selectedProject = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      project: selectedProject,
    }));
  };

  return (
    <div>
      <label>Project</label>
      <select
        className="form-control"
        name="project"
        value={formData.project || ""}
        onChange={handleChange}
      >
        <option value="">Select a Project</option>
        {projectList.map((project, index) => (
          <option key={index} value={project}>
            {project}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelector;
