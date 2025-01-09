// import React from "react";


// const AdvanceFilterComponent = ({ filterOptions, selectedFilter, subfilterOptions, handleFilterSelection, handleSubFilterSelection, selectedSubFilters }) => {
//     return (
//         <div
//             style={{
//                 display: "inline-flex",
//                 background: "white",
//                 padding: "1rem",
//                 marginTop: "2px",
//                 position: "absolute",
//                 right: "0px",
//                 width: "700px",
//                 border: "1px solid rgb(221, 221, 221)",
//                 columnGap: "1rem",
//             }}
//         >
//             {/* Filter List */}
//             <div>
//                 <ul className="list-group">
//                     {filterOptions.map((area) => (
//                         <li
//                             className="list-group-item"
//                             key={area.key}
//                             onClick={() => handleFilterSelection(area.key)}
//                             style={{
//                                 cursor: "pointer",
//                                 fontWeight: selectedFilter === area.key ? "bold" : "normal",
//                             }}
//                         >
//                             {area.name}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Sub Filter Options */}
//             <div>
//                 {selectedFilter && subfilterOptions[selectedFilter] && (
//                     <div>
//                         <h4>
//                             Sub Filters for{" "}
//                             {
//                                 filterOptions.find((f) => f.key === selectedFilter).name
//                             }
//                         </h4>
//                         <div>
//                             {subfilterOptions[selectedFilter].map((subFilter) => (
//                                 <div key={subFilter.key} style={{ marginBottom: "8px" }}>
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedSubFilters.includes(subFilter.key)}
//                                         onChange={() => handleSubFilterSelection(subFilter.key)}
//                                     />
//                                     {subFilter.name}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AdvanceFilterComponent;
