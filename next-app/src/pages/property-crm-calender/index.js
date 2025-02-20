"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AuthUser from "@/components/Authentication/AuthUser";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import withAuth from "@/utils/withAuth";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const localizer = momentLocalizer(moment);
  const [calenderData, setCalenderData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const memberId = GetMemberId();


  useEffect(() => {
    FetchCalenderData();
  }, [memberId]);


  const FetchCalenderData = async () => {
    try {
      const response = await callApi({
        api: "/crm_calender",
        method: "GET",
        data: {
          user_id: memberId,
        },
      });

      if (response && response.status === 1) {
        const data = convertToCalendarEvents(response?.data);
        setCalenderData(data);
      } 
    } catch (error) {
      toast.error("Error fetching calendar data.");
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };


  const convertToCalendarEvents = (apiData) => {
    return apiData.flatMap((entry) =>
      entry.list.map((item) => {
        const [year, month, day] = entry.date.split("-").map(Number);
        const [hours, minutes, seconds] = item.schedule_time
          .split(":")
          .map(Number);
  
        return {
          title: item.remarks || "No Title",
          start: new Date(year, month - 1, day, hours, minutes, seconds),
          end: new Date(year, month - 1, day, hours + 1, minutes, seconds), // Default 1-hour event
          allDay: false,
        };
      })
    );
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h2>Calendar</h2>
        <Calendar
          localizer={localizer}
          events={calenderData}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "500px" }}
          onSelectEvent={handleSelectEvent}
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p><strong>Title:</strong> {selectedEvent.title}</p>
              <p><strong>Scheduled Date:</strong> {moment(selectedEvent.start).format("YYYY-MM-DD HH:mm")}</p>
              <p><strong>Remarks:</strong> {selectedEvent.title}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default withAuth(Index);
