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
import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const { callApi, GetMemberId } = AuthUser();
  const localizer = momentLocalizer(moment);
  const [calenderData, setCalenderData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const memberId = GetMemberId();
  const translation = useTranslation();
  const [start_end_data, setStartEndDate] = useState({
    start_date: "",
    end_date: ""
  })

  useEffect(() => {
    const startDate = moment().startOf("month").format("YYYY-MM-DD");
    const endDate = moment().endOf("month").format("YYYY-MM-DD");
    setStartEndDate({
      start_date: startDate,
      end_date: endDate
    })
    FetchCalenderData(startDate, endDate);
  }, [memberId]);


  const FetchCalenderData = async (start_date, end_date) => {
    try {
      const res = await callApi({
        api: "/lead-schedule-calendar",
        method: "GET",
        data: {
          user_id: memberId,
          start_date,
          end_date
        },
      });
      if (res && res.status === 1) {
        const data = convertToCalendarEvents(res?.data);
        setCalenderData(data);
      }
    } catch (error) {
      toast.error("Error fetching calendar data.");
    }
  };


  const convertToCalendarEvents = (apiData) => {
    if (!Array.isArray(apiData)) return [];
  
    return apiData.map((item) => ({
      title: `${item?.count || 0} meetings`,
      start: new Date(`${item?.date || "1970-01-01"}T00:00:00`),
      end: new Date(`${item?.date || "1970-01-01"}T23:59:59`),
      allDay: true
    }));
  };
  

  const handleRangeChange = (range) => {
    let startDate, endDate;
  
    if (Array.isArray(range)) {
      // Week or Day view
      startDate = moment.utc(range[0]).startOf("day").format("YYYY-MM-DD");
      endDate = moment.utc(range[range.length - 1]).endOf("day").format("YYYY-MM-DD");
    } else {
      // Month view
      startDate = moment.utc(range.start).startOf("month").format("YYYY-MM-DD");
      endDate = moment.utc(range.end).endOf("month").format("YYYY-MM-DD");
    }
  
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  
    setStartEndDate({
      start_date: startDate,
      end_date: endDate,
    });
  
    FetchCalenderData(startDate, endDate);
  };
  


  const handleSelectEvent = (event) => {
    const schedule_date = moment(event.start).format('YYYY-MM-DD')
    if(schedule_date) {
      router.push(`/schedule-meetings?date=${schedule_date}`);
    }
  };



  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
        <div className="p-4">
          <h1 className="h3 text-primary mb-4">{translation?.calendar || "Calendar"}</h1>
          <Calendar
            localizer={localizer}
            events={calenderData}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "500px" }}
            // onSelectEvent={handleSelectEvent}
            onSelectEvent={handleSelectEvent}
            selectable
            onRangeChange={handleRangeChange}
          />
        </div>
      </aside>
    </DashboardLayout>
  );
};

export default withAuth(Index);
