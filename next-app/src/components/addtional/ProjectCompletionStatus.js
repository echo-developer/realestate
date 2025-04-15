import { useMemo } from "react";
import { ListGroup, ProgressBar } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import useTranslation from "@/hooks/useTranslation";

const ProjectCompletionStatus = ({ projectData }) => {
  const groupedFields = useMemo(
    () => ({
      "Basic Details": [
        { key: "expected_price", label: "Price", weight: 10 },
        { key: "instruction", label: "Instruction", weight: 5 },
        { key: "address", label: "Address", weight: 10 },
        { key: "locality", label: "Locality", weight: 10 },
        { key: "project_name", label: "Project or Society Name", weight: 8 },
      ],
      "Project Features": [
        { key: "area", label: "Area", weight: 10, value: (projectData.occupied_area || projectData.total_area) ? 1 : 0 },
        { key: "possession_status", label: "Possession Status", weight: 5 },
        { key: "project_furnish", label: "Furnished", weight: 20 },
        { key: "parking_availability", label: "Parking", weight: 8 },
        { key: "facing_direction", label: "Facing", weight: 15 },
        { key: "overlooking", label: "OverLooking", weight: 7 },
        { key: "flooring_style", label: "Flooring", weight: 10 },
        { key: "tower_details", label: "Unit Details", weight: 18, value: projectData.total_units },
      ],
      "Additional Features": [
        { key: "water_available", label: "Water Availability", weight: 5, value: parseInt(projectData.water_available) || 0 },
        { key: "electric_availability", label: "Status of Electricity", weight: 5 },
        { key: "type_of_ownership", label: "Type of Ownership", weight: 3 },
        { key: "landmarks", label: "Landmark", weight: 6 },
        { key: "galleries", label: "Gallery", weight: 7, value: projectData.gallery?.some(g => g.images?.length > 0) ? 1 : 0 },
      ],
    }),
    []
  );
  const translation = useTranslation();
  const completionData = Object.entries(groupedFields).reduce((acc, [group, fields]) => {
    acc[group] = fields.map(({ key, label, weight, value }) => ({
      label,
      isCompleted: Boolean(projectData[key]) || (value !== undefined && value > 0),
      weight: (projectData[key] || (value !== undefined && value > 0)) ? weight : 0
    }));
    return acc;
  }, {});

  const completionPercentage = Object.values(completionData).flat().reduce((acc, field) => acc + field.weight, 0);

  const doughnutOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle", // ✅ circle bullets!
        },
      },
    },
  };

  const doughnutData = {
    labels: [`${translation?.completed || "Completed"}`, `${translation?.pending || "Pending"}`],
    datasets: [
      {
        data: [completionPercentage, 100 - completionPercentage],
        backgroundColor: ["#4caf50", "#e53935"],
      },
    ],
  };

  return (
    <>
    <h5 className="text-uppercase">{translation?.completion_status || "Completion Status"}</h5>
    <div className="card">
      
      <div className="card-body">
        <p className="text-help"> {translation?.get_more_response || "Get 5 times more response! Just add the following"}</p>
        <div className="card-body">
          <div className="mx-auto" style={{ width: "240px", height: "240px" }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
        {Object.entries(completionData).map(([group, fields]) => (
          <div key={group} className="mb-3">
            <h5 className="text-primary">{group}</h5>
            <ListGroup>
              {fields.map((item, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between">
                  <span>
                    <i className="bi bi-info-circle me-2"></i> {item.label}
                  </span>
                  <span className={item.isCompleted ? "text-success" : "text-danger"}>
                    <i className={`bi ${item.isCompleted ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i>
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ProjectCompletionStatus;
