import { useMemo } from "react";
import { ListGroup, ProgressBar } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";



const ProjectCompletionStatus = ({ projectData }) => {
  const fields = useMemo(
    () => [
      { key: "expected_price", label: "Price", weight: 10 },
      { key: "instruction", label: "Instruction", weight: 5 },
      { key: "address", label: "Address", weight: 10 },
      { key: "locality", label: "Locality", weight: 10 },
      { key: "project_name", label: "Project or Society Name", weight: 8 },
      { key: "area", label: "Area", weight: 10 },
      { key: "possession_status", label: "Possession Status", weight: 5 },
      { key: "project_furnish", label: "Furnished", weight: 20 },
      { key: "parking_availability", label: "Parking", weight: 8 },
      { key: "facing_direction", label: "Facing", weight: 15 },
      { key: "overlooking", label: "OverLooking", weight: 7 },
      { key: "flooring_style", label: "Flooring", weight: 10 },
      { key: "tower_details", label: "Tower & Unit Details", weight: 18 },
      { key: "water_available", label: "Water Availability", weight: 5 },
      {
        key: "electric_availability",
        label: "Status of Electricity",
        weight: 5,
      },
      { key: "type_of_ownership", label: "Type of Ownership", weight: 3 },
      { key: "landmarks", label: "Landmark", weight: 6 },
      { key: "galleries", label: "Gallery", weight: 7 },
    ],
    []
  );

  const completionData = fields.map(({ key, label, weight }) => ({
    label,
    status: projectData[key] ? "✔️ Completed" : "❌ Pending",
    weight: projectData[key] ? weight : 0,
  }));

  const completionPercentage = completionData.reduce(
    (acc, field) => acc + field.weight,
    0
  );

  const doughnutData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [
          completionData.reduce(
            (acc, item) => acc + (item.weight ? item.weight : 0),
            0
          ),
          100 - completionPercentage,
        ],
        backgroundColor: ["#4caf50", "#e53935"], // Green for completed, Red for pending
      },
    ],
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>Completion Status</h4>
      </div>
      <div className="card-body">
        <ProgressBar
          striped
          variant="success"
          animated
          now={completionPercentage}
          className="mb-3"
          style={{ height: "6px" }}
        />
        <p className="text-muted text-italic">
          Get 5 times more response! Just add the following
        </p>
        <div className="card-body">
          <div className="mx-auto" style={{ width: "250px", height: "250px" }}>
            <Doughnut data={doughnutData} />
          </div>
        </div>
        <ListGroup>
          {completionData.map((item, index) => (
            <ListGroup.Item
              key={index}
              className="d-flex justify-content-between"
            >
              <span>
                <i className="bi bi-info-circle"></i> {item.label}
              </span>
              <span
                className={
                  item.status.includes("Pending")
                    ? "text-danger"
                    : "text-success"
                }
              >
                {item.status}
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default ProjectCompletionStatus;
