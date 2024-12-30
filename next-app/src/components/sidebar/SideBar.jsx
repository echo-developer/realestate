"use client"
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import UserLogoUpload from "../ModalData/UserLogoUpload";

const SideBar = () => {
    const { callApi, GetMemberId } = AuthUser();
    const [userData, setUserData] = useState();
    const router = useRouter();
    const { pathname } = router;
    const memberId = GetMemberId();
    const [show, setShow] = useState(false);
    const [userLogo, setUserLogo] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedLogo = localStorage.getItem('user_logo');
            setUserLogo(storedLogo);
        }
    }, []);

    const isActive = (path) => pathname === path;
    useEffect(() => {
        if (memberId) {
            FetchUserData();
        }
    }, [memberId]);

    const handleShow = () => setShow(true);

    const FetchUserData = async () => {
        let response;
        try {
            response = await callApi({
                api: `/get_user_data`,
                method: "GET",
                data: {
                    member_id: memberId,
                },
            });
            if (response && response.success === true) {
                setUserData(response.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(response.message);
        }
    };




    return (
        <React.Fragment>
            <aside className="col-lg-auto col-12">
                <div className="user-sidebar">
                    <div className="user-profile text-center">
                        <a href="#" id="toggleZ">
                            <i className="bi bi-chevron-left"></i>
                        </a>
                        <div className="avatar mb-3">
                            <img
                                src={userLogo || "/assets/images/user.jpg"}
                                alt="profile-photo"
                                height="100"
                                width="100"
                            />
                            <a
                               onClick={handleShow}
                                className="upload-file"
                                data-bs-toggle="modal"
                                data-bs-target="#profileModal"
                            >
                                <i className="bi bi-camera"></i>
                            </a>
                        </div>
                        <div className="user-profile-details">
                            <h4>{userData?.name || "User"}</h4>
                            <p>
                                <i className="icon-feather-map-pin text-site"></i>{" "}
                                India, West Bengal, Kolkata
                            </p>
                            <div className="d-grid columns-2 mb-3">
                                <a
                                    href="post.php"
                                    className="btn btn-outline-light"
                                >
                                    Post Project
                                </a>
                                <a
                                    href="profile.php"
                                    className="btn btn-outline-light"
                                >
                                    View Profile
                                </a>
                            </div>
                        </div>
                    </div>

                    <ul className="user-nav">
                        <li>
                            <a href="#" className="d-lg-none">
                                <i className="material-icons-outlined">
                                    local_mall
                                </i>{" "}
                                <span>Buy</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="d-lg-none">
                                <i className="material-icons-outlined">sell</i>{" "}
                                <span>Sell</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="d-lg-none">
                                <i className="material-icons-outlined">
                                    real_estate_agent
                                </i>{" "}
                                <span>Rent</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/dashboard"
                                className={
                                    isActive("/dashboard") ? "active" : ""
                                }
                            >
                                <i className="bi bi-speedometer"></i>{" "}
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="profile.php">
                                <i className="bi bi-person"></i>{" "}
                                <span>Profile</span>
                            </a>
                        </li>
                        <li>
                            <a href="review.php">
                                <i className="bi bi-chat-right-quote"></i>{" "}
                                <span>Reviews</span>
                            </a>
                        </li>
                        <li>
                            <a href="message.php">
                                <i className="bi bi-chat-square-text"></i>{" "}
                                <span>Message</span>
                            </a>
                        </li>
                        <li className="dropdown">
                            <a
                                href="#"
                                className="nav-toggle-1"
                                data-bs-toggle="dropdown"
                            >
                                <i className="bi bi-building"></i>{" "}
                                <span>Property CRM</span>{" "}
                                <i className="icon-line-awesome-angle-down ms-auto"></i>
                            </a>
                            <ul className="nav-hide-menu" id="hide-menu-1">
                                <li>
                                    <a href="enquiries/activities">
                                        <i className="icon-line-awesome-arrow-right"></i>{" "}
                                        Activities
                                    </a>
                                </li>
                                <li>
                                    <a href="enquiries/deals">
                                        <i className="icon-line-awesome-arrow-right"></i>{" "}
                                        Deals
                                    </a>
                                </li>
                                <li>
                                    <a href="enquiries/leads">
                                        <i className="icon-line-awesome-arrow-right"></i>{" "}
                                        Leads
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="/my-property-listing">
                                <i
                                    className={
                                        isActive("/my-property-listing")
                                            ? "active"
                                            : ""
                                    }
                                ></i>{" "}
                                <span>My Properties</span>
                            </a>
                        </li>
                        <li>
                            <a href="favorite.php">
                                <i className="bi bi-bookmark-star"></i>{" "}
                                <span>My Favourites</span>
                            </a>
                        </li>
                        <li>
                            <a href="membership.php">
                                <i className="bi bi-box"></i>{" "}
                                <span>Packages</span>
                            </a>
                        </li>
                        <li>
                            <a href="enquiries">
                                <i className="bi bi-question-circle"></i>{" "}
                                Enquiries
                            </a>
                        </li>
                        <li>
                            <a href="report.php">
                                <i className="bi bi-cursor"></i>{" "}
                                <span>User Report</span>
                            </a>
                        </li>
                        <li>
                            <a href="password.php">
                                <i className="bi bi-lock"></i>{" "}
                                <span>Change Password</span>
                            </a>
                        </li>
                        <li>
                            <a href="logout.php">
                                <i className="bi bi-box-arrow-right"></i>{" "}
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            {show && <UserLogoUpload show={show} setShow={setShow} setUserLogo={setUserLogo}/>}
        </React.Fragment>
    );
};

export default SideBar;
