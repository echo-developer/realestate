"use client";
import React, { useEffect, useState , useRef } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import UserLogoUpload from "../ModalData/UserLogoUpload";
import Link from "next/link";

const SideBar = () => {
    const { callApi, GetMemberId, logout } = AuthUser();
    const [userData, setUserData] = useState();
    const router = useRouter();
    const { pathname } = router;
    const memberId = GetMemberId();
    const [show, setShow] = useState(false);
    const [userLogo, setUserLogo] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedLogo = localStorage.getItem("user_logo");
            setUserLogo(storedLogo);
        }
    }, []);

    const toggleDropdown = (e) => {
        e.preventDefault();
        setShowDropDown((prev) => !prev);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropDown(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
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
            if (response && response.success === 1) {
                setUserData(response.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("data not found");
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
                                <Link
                                    href="/postproject"
                                    className="btn btn-outline-light"
                                >
                                    Post Project
                                </Link>
                                <Link
                                    href="/my-profile"
                                    className="btn btn-outline-light"
                                >
                                    View Profile
                                </Link>
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
                            <Link href="/my-profile">
                                <i className="bi bi-person"></i>{" "}
                                <span>Profile</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/review">
                                <i className="bi bi-chat-right-quote"></i>{" "}
                                <span>Reviews</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/message">
                                <i className="bi bi-chat-square-text"></i>{" "}
                                <span>Message</span>
                            </Link>
                        </li>
                        <li
                            className={`dropdown ${showDropDown ? "open" : ""}`}
                            ref={dropdownRef}
                        >
                            <a
                                href="#"
                                className="nav-toggle-1"
                                onClick={toggleDropdown}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ")
                                        toggleDropdown(e);
                                }}
                                role="button"
                                aria-expanded={showDropDown}
                            >
                                <i className="bi bi-building"></i>{" "}
                                <span>Property CRM</span>{" "}
                                <i className="icon-line-awesome-angle-down ms-auto"></i>
                            </a>
                            <ul
                                className="nav-hide-menu"
                                id="hide-menu-1"
                                style={{
                                    display: showDropDown ? "block" : "none",
                                }}
                            >
                                <li>
                                    <a href="/property-crm">
                                        <i className="icon-line-awesome-arrow-right"></i>{" "}
                                        Leads
                                    </a>
                                </li>
                                {/* <li>
                                    <a href="/property-crm-schedule">
                                        <i className="icon-line-awesome-arrow-right"></i>{" "}
                                        Schedule
                                    </a>
                                </li> */}
                                <li>
                                    <a href="/property-crm-timeline">
                                        <i className="icon-line-awesome-arrow-right"></i>{" "}
                                        TimeLine
                                    </a>
                                </li>
                                <li>
                                    <a href="/property-crm-calender">
                                        <i className="icon-line-awesome-arrow-right"></i>{" "}
                                        Calender
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link href="/my-property-listing">
                                <i className="bi bi-bookmark-star"></i>{" "}
                                <span>My Properties</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/my-project">
                                <i className="bi bi-bookmark-star"></i>{" "}
                                <span>My Projects</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/my-favourite-list">
                                <i className="bi bi-bookmark-star"></i>{" "}
                                <span>My Favourites</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/membership">
                                <i className="bi bi-box"></i>{" "}
                                <span>Packages</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/enquiry-list">
                                <i clLinkssName="bi bi-box"></i> Enquiries
                            </Link>
                        </li>
                        <li>
                            <Link href="/report">
                                <i className="bi bi-cursor"></i>{" "}
                                <span>User Report</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/update-password">
                                <i className="bi bi-lock"></i>{" "}
                                <span>Change Password</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/" onClick={logout}>
                                <i className="bi bi-box-arrow-right"></i>{" "}
                                <span>Logout</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>

            {show && (
                <UserLogoUpload
                    show={show}
                    setShow={setShow}
                    setUserLogo={setUserLogo}
                />
            )}
        </React.Fragment>
    );
};

export default SideBar;
