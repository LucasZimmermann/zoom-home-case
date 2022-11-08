import React from "react";
import "./App.css";

const MINIMUM_SLOT_DURATION = 15;
const MINUTES_IN_DAY = 24 * 60;

const convertSlotHeightInPxToMin = (heightInPx) =>
  Number(heightInPx.replace("px", ""));

const computedDate = (weekDayNumber, minutes) => {
  const date = new Date("2023-01-02");
  date.setHours(0);
  date.setMinutes(minutes + weekDayNumber * MINUTES_IN_DAY);

  return date;
};

const CalendarHeader = () => (
  <div className="calendar-header">
    {[
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].map((dayLabel) => (
      <div key={dayLabel} className="calendar-header-day-label">
        {dayLabel}
      </div>
    ))}
  </div>
);

const TopBar = () => (
  <div className="top-bar">
    <h1>Calendar</h1>
  </div>
);

const CalendarHours = () => {
  const hours = 24;
  return [...Array(hours)].map((hour, index) => (
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
      {[...Array(hours)].map((hour, index) => (
        <div key={index} className="calendar-hour-label">
          {`${index}H00`}
        </div>
      ))}
    </div>
  );
};

function App() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [currentSlotRef, setCurrentSlotRef] = React.useState(undefined);
  const [slotWeekDayNumber, setSlotWeekDayNumber] = React.useState(undefined);
  const [showModal, setShowModal] = React.useState(undefined);
  const [baseY, setBaseY] = React.useState(0);

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

    const relativeY = e.pageY - calendarRef.current.offsetTop;
    const meetingDuration =
      relativeY - baseY - ((relativeY - baseY) % MINIMUM_SLOT_DURATION);

    if (meetingDuration > 0)
      currentSlotRef.current.style.height = `${meetingDuration}px`;
    else {
      currentSlotRef.current.style.top = `${baseY + meetingDuration}px`;
      currentSlotRef.current.style.height = `${-meetingDuration}px`;
    }
  };

  const CalendarDay = ({ daySlotRef, weekDayNumber }) => (
    <div
      className="calendar-day"
      onPointerDown={(e) => {
        setIsDragging(true);
        setCurrentSlotRef(daySlotRef);
        const relativeY = e.pageY - calendarRef.current.offsetTop;
        const computedBaseY = relativeY - (relativeY % MINIMUM_SLOT_DURATION);
        daySlotRef.current.style.top = `${computedBaseY}px`;
        setSlotWeekDayNumber(weekDayNumber);
        setBaseY(computedBaseY);
      }}
    >
      <CalendarHours />
      <div className="calendar-slot" ref={daySlotRef} />
    </div>
  );

  console.log(baseY);

  return (
    <>
      <TopBar />
      <CalendarHeader />
      <div className="calendar-container">
        <CalendarHourLabels />
        <div
          ref={calendarRef}
          className="calendar"
          onPointerMove={(e) => handleDrag(e)}
          onPointerUp={(e) => {
            setIsDragging(false);
            setShowModal(true);
          }}
          onPointerLeave={(e) => setIsDragging(false)}
        >
          {daySlotRefs.map((daySlotRef, index) => (
            <CalendarDay
              key={index}
              daySlotRef={daySlotRef}
              weekDayNumber={index}
            />
          ))}
        </div>
      </div>
      {showModal && (
        <div className="modal-container">
          <div className="modal">
            <h2>Set up a meeting on Zoom</h2>
            <div className="modal-body">
              <h4>{`Starts at: ${computedDate(slotWeekDayNumber, baseY)}`}</h4>
              <h4>{`Ends at: ${computedDate(
                slotWeekDayNumber,
                baseY +
                  convertSlotHeightInPxToMin(
                    currentSlotRef.current.style.height
                  ) +
                  MINIMUM_SLOT_DURATION
              )}`}</h4>
            </div>
            <div className="modal-button-container">
              <button
                className="modal-button"
                onClick={() => {
                  alert("Call Zoom");
                  setShowModal(false);
                }}
              >
                Confirm
              </button>
              <button
                className="modal-button"
                onClick={() => {
                  setShowModal(false);
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
