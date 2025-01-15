"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import required styles

const Index = () => {
  const localizer = momentLocalizer(moment);

  // State for managing events
  const [myEventsList, setMyEventsList] = useState([
    {
      id: 1,
      title: "Meeting with team",
      start: new Date(2025, 0, 15, 10, 0), // Example date
      end: new Date(2025, 0, 15, 12, 0), // Example date
    },
    {
      id: 2,
      title: "Project deadline",
      start: new Date(2025, 0, 20, 9, 0),
      end: new Date(2025, 0, 20, 17, 0),
    },
  ]);

  // Handle adding a new event
  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Enter a title for your event:");
    if (title) {
      setMyEventsList((prevEvents) => [
        ...prevEvents,
        {
          id: prevEvents.length + 1,
          title,
          start,
          end,
        },
      ]);
    }
  };

  // Handle changing an event
  const handleSelectEvent = (event) => {
    const newTitle = prompt(
      "Edit the title of your event:",
      event.title
    );
    if (newTitle) {
      setMyEventsList((prevEvents) =>
        prevEvents.map((evt) =>
          evt.id === event.id ? { ...evt, title: newTitle } : evt
        )
      );
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h2>Calendar</h2>
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "500px" }}
          selectable 
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </DashboardLayout>
  );
};

export default Index;
