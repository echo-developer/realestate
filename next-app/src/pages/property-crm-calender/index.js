"use client"
import React from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'



const index = (props) => {

  const localizer = momentLocalizer(moment)

  return (
    <DashboardLayout>
      <div>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
    </DashboardLayout>
  )
}

export default index
