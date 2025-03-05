import { useMemo } from "react";
import { ListGroup } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";

const PropertyCompletionStatus = ({ propertyData }) => {
    const groupedFields = useMemo(() => ({
        "General Information": [
            { key: "expected_price", label: "Price", weight: 10 },
            { key: "buyer_message", label: "Message to Buyer", weight: 5 },
            { key: "address", label: "Address", weight: 10 },
            { key: "locality", label: "Locality", weight: 10 },
            { key: "project_name", label: "Project or Society Name", weight: 8 },
        ],
        "Property Details": [
            { key: "configuration", label: "Configuration", weight: 12 },
            { key: "area", label: "Area", weight: 10 },
            { key: "possession_status", label: "Possession Status", weight: 5 },
            { key: "property_furnish", label: "Furnished", weight: 20 },
            { key: "parking_availability", label: "Parking", weight: 8 },
            { key: "facing_direction", label: "Facing", weight: 15 },
            { key: "overlooking", label: "OverLooking", weight: 7 },
            { key: "flooring", label: "Flooring", weight: 10 },
            { key: "floor_details", label: "Floor Details", weight: 8 },
        ],
        "Additional Features": [
            { key: "water_available", label: "Water Availability", weight: 5 },
            { key: "electric_available", label: "Status of Electricity", weight: 5 },
            { key: "ownership_type", label: "Type of Ownership", weight: 3 },
            { key: "landmarks", label: "Landmark", weight: 6 },
            { key: "galleries", label: "Gallery", weight: 7 },
            { key: "total_floor", label: "Tower & Unit Details", weight: 18 },
        ]
    }), []);

    const completionData = Object.entries(groupedFields).reduce((acc, [group, fields]) => {
        acc[group] = fields.map(({ key, label, weight }) => ({
            label,
            isCompleted: Boolean(propertyData[key]),
            weight: propertyData[key] ? weight : 0
        }));
        return acc;
    }, {});

    const completionPercentage = Object.values(completionData).flat().reduce((acc, field) => acc + field.weight, 0);

    const doughnutData = {
        labels: ["Completed", "Pending"],
        datasets: [
            {
                data: [
                    completionPercentage,
                    100 - completionPercentage
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
                <p className="text-muted text-italic">
                    Get 5 times more response! Just add the following
                </p>
                <div className="card-body">
                    <div className="mx-auto" style={{ width: "250px", height: "250px" }}>
                        <Doughnut data={doughnutData} />
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
    );
};

export default PropertyCompletionStatus;
