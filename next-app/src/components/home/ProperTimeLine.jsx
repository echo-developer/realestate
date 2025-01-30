// import React from "react";
// import {
//   VerticalTimeline,
//   VerticalTimelineElement,
// } from "react-vertical-timeline-component";
// import "react-vertical-timeline-component/style.min.css";
// import {
//   Calendar,
//   List,
//   Search,
//   HandshakeFill,
//   BagCheckFill,
// } from "react-bootstrap-icons";

// const timelines = [
//   {
//     title: "For Buyers",
//     description:
//       "Looking for your dream property? Follow these simple steps to find your ideal home or investment",
//     steps: [
//       { icon: <Calendar />, label: "Schedule Viewings" },
//       { icon: <List />, label: "Get Detailed Listings" },
//       { icon: <Search />, label: "Search for Properties" },
//       { icon: <Search />, label: "Close the Deal" },
//       { icon: <BagCheckFill />, label: "Make Offers with Confidence" },
//     ],
//   },
//   {
//     title: "For Sellers",
//     description:
//       "Ready to sell your property? Our platform makes the selling process smooth and efficient",
//     steps: [
//       { icon: <Calendar />, label: "Create a Listing" },
//       { icon: <List />, label: "Get Maximum Exposure" },
//       { icon: <Search />, label: "Connect with Buyers" },
//       { icon: <Search />, label: "Negotiate & Accept Offers" },
//       { icon: <BagCheckFill />, label: "Close the Sale" },
//     ],
//   },
//   {
//     title: "For Renters",
//     description: "Finding your next rental has never been easier",
//     steps: [
//       { icon: <Calendar />, label: "Contact Landlords or Agents" },
//       { icon: <List />, label: "Explore Rental Listings" },
//       { icon: <Search />, label: "Search for Rentals" },
//       { icon: <Search />, label: "Apply for a Lease" },
//     ],
//   },
// ];

// const ProperTimeLine = () => {
//   return (
//     <section className="section">
//       <div className="container">
//         <h2 className="text-center mb-4">How It Works</h2>
//         <VerticalTimeline>
//           {timelines.map((timeline, index) => (
//             <VerticalTimelineElement
//               key={index}
//               className="timeline-container"
//               contentStyle={{ background: "#fff", color: "#000" }}
//               contentArrowStyle={{ borderRight: "7px solid #fff" }}
//               iconStyle={{ background: "#007bff", color: "#fff" }}
//             >
//               <h3 className="vertical-timeline-element-title">
//                 {timeline.title}
//               </h3>
//               <p>{timeline.description}</p>
//               <div>
//                 {timeline.steps.map((step, stepIndex) => (
//                   <div
//                     key={stepIndex}
//                     className="mb-3 d-flex align-items-center"
//                   >
//                     <span
//                       className="me-2"
//                       style={{ fontSize: "1.5rem", color: "#007bff" }}
//                     >
//                       {step.icon}
//                     </span>
//                     <span>{step.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </VerticalTimelineElement>
//           ))}
//           <VerticalTimelineElement
//             iconStyle={{ background: "#6c757d", color: "#fff" }}
//             contentStyle={{ textAlign: "center" }}
//           >
//             <p>And More!</p>
//           </VerticalTimelineElement>
//         </VerticalTimeline>
//       </div>
//     </section>
//   );
// };

// export default ProperTimeLine;

import React from 'react'

const ProperTimeLine = () => {
  return (
    <section className="section">
  <div className="container">
    <div className="timeline-container">
      <div className="row gx-lg-5 align-items-center timeline">
        <aside className="col-lg col-12">
          <div className="section-headline text-end">
            <h3>For Buyers</h3>
            <p>Looking for your dream property? Follow these simple steps to find your ideal home or investment.</p>
          </div>
          <div className="row gx-3 flex-row-reverse">
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-calendar.png" alt="Schedule property viewings" height="32" width="32" className="mb-2"/>
                  <h4>Schedule Viewings</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-listing.png" alt="View detailed listings" height="32" width="32" className="mb-2"/>
                  <h4>Get Detailed Listings</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-search.png" alt="Search for available properties" height="32" width="32" className="mb-2"/>
                  <h4>Search for Properties</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-deal.png" alt="Finalize the deal" height="32" width="32" className="mb-2"/>
                  <h4>Close the Deal</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-offer.png" alt="Make offers confidently" height="32" width="32" className="mb-2"/>
                  <h4>Make Offers with Confidence</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box bg-white">
                <div className="card-body">
                  <a href="#" className="btn btn-primary">Know More</a>
                </div>
              </div>
            </article>
          </div>
        </aside>
        <aside className="col-lg col-12 d-none d-lg-block">
          <img src="/assets/images/icons/buyer.png" alt="Buyer image" className="img-fluid"/>
        </aside>
      </div>
      <div className="row gx-lg-5 align-items-center timeline">
        <aside className="col-lg col-12 d-none d-lg-block text-end">
          <img src="/assets/images/icons/seller.png" alt="Seller image" className="img-fluid"/>
        </aside>
        <aside className="col-lg col-12">
          <div className="section-headline">
            <h3>For Sellers</h3>
            <p>Ready to sell your property? Our platform makes the selling process smooth and efficient.</p>
          </div>
          <div className="row gx-3">
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-calendar.png" alt="Create a listing for your property" height="32" width="32" className="mb-2"/>
                  <h4>Create a Listing</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-listing.png" alt="Get maximum exposure for your listing" height="32" width="32" className="mb-2"/>
                  <h4>Get Maximum Exposure</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-search.png" alt="Connect with potential buyers" height="32" width="32" className="mb-2"/>
                  <h4>Connect with Buyers</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-deal.png" alt="Negotiate and accept offers" height="32" width="32" className="mb-2"/>
                  <h4>Negotiate & Accept Offers</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-offer.png" alt="Finalize and close the sale" height="32" width="32" className="mb-2"/>
                  <h4>Close the Sale</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box bg-white">
                <div className="card-body">
                  <a href="#" className="btn btn-primary">Know More</a>
                </div>
              </div>
            </article>
          </div>
        </aside>
      </div>
      <div className="row gx-lg-5 align-items-center timeline">
        <aside className="col-lg col-12">
          <div className="section-headline text-end">
            <h3>For Renters</h3>
            <p>Finding your next rental has never been easier.</p>
          </div>
          <div className="row gx-3 flex-row-reverse">
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-calendar.png" alt="Contact landlords or agents" height="32" width="32" className="mb-2"/>
                  <h4>Contact Landlords or Agents</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-listing.png" alt="Explore rental listings" height="32" width="32" className="mb-2"/>
                  <h4>Explore Rental Listings</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-search.png" alt="Search for rental properties" height="32" width="32" className="mb-2"/>
                  <h4>Search for Rentals</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box">
                <div className="card-body">
                  <img src="/assets/images/icons/icon-deal.png" alt="Apply for a lease" height="32" width="32" className="mb-2"/>
                  <h4>Apply for a Lease</h4>
                </div>
              </div>
            </article>
            <article className="col-lg-4 col-sm-6 col-12">
              <div className="card card-how-box bg-white">
                <div className="card-body">
                  <a href="#" className="btn btn-primary">Know More</a>
                </div>
              </div>
            </article>
          </div>
        </aside>
        <aside className="col-lg col-12 d-none d-lg-block">
          <img src="/assets/images/icons/renters.png" alt="Renters image" className="img-fluid"/>
        </aside>
      </div>
    </div>
  </div>
</section>

  )
}

export default ProperTimeLine
