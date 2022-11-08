import React from "react";
import "./Calendar.css";

import { createZoomMeeting } from "./utils/zoom";
import { WEEK_DAY_LABELS } from "./utils/constants";
import {
  computeSlotDurationInMin,
  computeDateFromSlot,
  computeYPosRelativeToCalendar,
  modifySlotPositionAndHeight,
} from "./utils/calendarHelper";

const convertSlotHeightInPxToMin = (heightInPx) =>
  Number(heightInPx.replace("px", ""));

const TopBar = () => (
  <div className="top-bar">
    <h1>Calendar</h1>
  </div>
);

const CalendarHeader = () => (
  <div className="calendar-header">
    {WEEK_DAY_LABELS.map((dayLabel) => (
      <div key={dayLabel} className="calendar-header-day-label">
        {dayLabel}
      </div>
    ))}
  </div>
);

const CalendarDay = React.forwardRef(
  (
    {
      weekDayNumber,
      setIsDragging,
      setCurrentSlotRef,
      setSlotWeekDayNumber,
      setSlotBaseCalendarYPos,
      calendarRef,
    },
    ref
  ) => (
    <div
      className="calendar-day"
      onPointerDown={(e) => {
        setIsDragging(true);
        setCurrentSlotRef(ref);
        setSlotWeekDayNumber(weekDayNumber);
        const slotYPos = computeYPosRelativeToCalendar(e.pageY, calendarRef);
        ref.current.style.top = `${slotYPos}px`;
        setSlotBaseCalendarYPos(slotYPos);
      }}
    >
      <CalendarHours />
      <div className="calendar-slot" ref={ref} />
    </div>
  )
);

const CalendarHours = () => {
  const hours = 24;

  return [...Array(hours)].map((_, index) => (
    <div key={index} className="calendar-hour">
      <div className="calendar-hour-subdivision" />
      <div className="calendar-hour-subdivision" />
      <div className="calendar-hour-subdivision" />
      <div className="calendar-hour-subdivision" />
    </div>
  ));
};

const CalendarHourLabels = () => {
  const hours = 24;

  return (
    <div className="calendar-hour-labels-container">
      {[...Array(hours)].map((_, index) => (
        <div key={index} className="calendar-hour-label">
          {`${index}H00`}
        </div>
      ))}
    </div>
  );
};

const Calendar = React.forwardRef(
  ({ children, setShowConfirmationModal, setIsDragging, handleDrag }, ref) => (
    <div
      ref={ref}
      className="calendar"
      onPointerMove={(e) => handleDrag(e)}
      onPointerUp={() => {
        setIsDragging(false);
        setShowConfirmationModal(true);
      }}
      onPointerLeave={() => {
        setIsDragging(false);
      }}
    >
      {children}
    </div>
  )
);

function App() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [currentSlotRef, setCurrentSlotRef] = React.useState(undefined);
  const [slotWeekDayNumber, setSlotWeekDayNumber] = React.useState(undefined);
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(undefined);
  const [slotBaseCalendarYPos, setSlotBaseCalendarYPos] = React.useState(0);

  const mondaySlotRef = React.useRef();
  const tuesdaySlotRef = React.useRef();
  const wednesdaySlotRef = React.useRef();
  const thursdaySlotRef = React.useRef();
  const fridaySlotRef = React.useRef();
  const saturdaySlotRef = React.useRef();
  const sundaySlotRef = React.useRef();

  const calendarRef = React.useRef();

  const daySlotRefs = [
    mondaySlotRef,
    tuesdaySlotRef,
    wednesdaySlotRef,
    thursdaySlotRef,
    fridaySlotRef,
    saturdaySlotRef,
    sundaySlotRef,
  ];

  const handleDrag = (e) => {
    if (!isDragging) return;

    const meetingDuration = computeSlotDurationInMin(
      slotBaseCalendarYPos,
      e.pageY,
      calendarRef.current.offsetTop
    );
    
    modifySlotPositionAndHeight(
      meetingDuration,
      currentSlotRef,
      slotBaseCalendarYPos
    );
  };

  return (
    <>
      <TopBar />
      <CalendarHeader />
      <div className="calendar-container">
        <CalendarHourLabels />
        <Calendar
          ref={calendarRef}
          setShowConfirmationModal={setShowConfirmationModal}
          setIsDragging={setIsDragging}
          handleDrag={handleDrag}
        >
          {daySlotRefs.map((daySlotRef, index) => (
            <CalendarDay
              ref={daySlotRef}
              key={index}
              weekDayNumber={index}
              setIsDragging={setIsDragging}
              setCurrentSlotRef={setCurrentSlotRef}
              setSlotWeekDayNumber={setSlotWeekDayNumber}
              setSlotBaseCalendarYPos={setSlotBaseCalendarYPos}
              calendarRef={calendarRef}
            />
          ))}
        </Calendar>
      </div>
      {showConfirmationModal && (
        <div className="modal-container">
          <div className="modal">
            <h2>Set up a meeting on Zoom</h2>
            <div className="modal-body">
              <h4>{`Starts at: ${computeDateFromSlot(
                slotWeekDayNumber,
                slotBaseCalendarYPos
              )}`}</h4>
              <h4>{`Ends at: ${computeDateFromSlot(
                slotWeekDayNumber,
                slotBaseCalendarYPos +
                  convertSlotHeightInPxToMin(
                    currentSlotRef.current.style.height
                  )
              )}`}</h4>
            </div>
            <div className="modal-button-container">
              <button
                className="modal-button"
                onClick={async () => {
                  await createZoomMeeting(
                    computeDateFromSlot(
                      slotWeekDayNumber,
                      slotBaseCalendarYPos
                    ),
                    convertSlotHeightInPxToMin(
                      currentSlotRef.current.style.height
                    )
                  );
                  setShowConfirmationModal(false);
                }}
              >
                Confirm
              </button>
              <button
                className="modal-button"
                onClick={() => {
                  setShowConfirmationModal(false);
                  currentSlotRef.current.style.height = "0px";
                  setCurrentSlotRef(undefined);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
