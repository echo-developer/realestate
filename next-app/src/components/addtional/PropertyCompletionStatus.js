import { useMemo } from "react";
import { ListGroup } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import useTranslation from "@/hooks/useTranslation";


const PropertyCompletionStatus = ({ propertyData }) => {
    const translation = useTranslation();
    const groupedFields = useMemo(() => ({
       "General Information": [
            { key: "expected_price", label: "Price", weight: 10 },
            { key: "buyer_message", label: "Message to Buyer", weight: 5 },
            { key: "address", label: "Address", weight: 10 },
            { key: "locality", label: "Locality", weight: 10 },
            { key: "project_name", label: "Project or Society Name", weight: 8 },
        ],
        "Property Details": [
            { key: "configuration", label: "Configuration", weight: 12, value: propertyData.rooms ? Object.keys(propertyData.rooms).length : 0 },
            { key: "area", label: "Area", weight: 10, value: (propertyData.carpet_area || propertyData.super_area) ? 1 : 0 },
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
            { key: "landmarks", label: "Landmark", weight: 6, value: Array.isArray(propertyData.landmarks) ? propertyData.landmarks.length : Object.keys(propertyData.landmarks || {}).length },
            { key: "galleries", label: "Gallery", weight: 7, value: propertyData.galleries?.some(g => g.images?.length > 0) ? 1 : 0 },
            { key: "total_floor", label: "Tower & Unit Details", weight: 18 },
        ]
    }), [propertyData]);

    const completionData = Object.entries(groupedFields).reduce((acc, [group, fields]) => {
        acc[group] = fields.map(({ key, label, weight, value }) => ({
            label,
            isCompleted: Boolean(propertyData[key]) || (value !== undefined && value > 0),
            weight: (propertyData[key] || (value !== undefined && value > 0)) ? weight : 0
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
        labels: [
            `${translation?.completed || "Completed"}`, `${translation?.completed || "Pending"}`
        ], 
        datasets: [
            {
                data: [
                    completionPercentage,
                    100 - completionPercentage,
                ],
                backgroundColor: ["#4caf50", "#e53935"],
                position: "bottom",
            },
        ],
    };      

    return (
        <>
        <h5 className="text-uppercase">{translation?.completion_status || "Completion Status"}</h5>
        <div className="card">
            <div className="card-body">
                <p className="text-help">
                    {translation?.boost_response || "Get 5 times more response! Just add the following"}
                </p>
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

export default PropertyCompletionStatus;
