import React from "react";
import "./App.css";

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

function App() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [currentSlotRef, setCurrentSlotRef] = React.useState(undefined);
  const [showModal, setShowModal] = React.useState(undefined);
  const [baseY, setBaseY] = React.useState(0);

  const mondaySlotRef = React.useRef();
  const tuesdaySlotRef = React.useRef();
  const wednesdaySlotRef = React.useRef();
  const thursdaySlotRef = React.useRef();
  const fridaySlotRef = React.useRef();
  const saturdaySlotRef = React.useRef();
  const sundaySlotRef = React.useRef();

  const modalRef = React.useRef();

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

    const meetingDuration = e.clientY - baseY - ((e.clientY - baseY) % 25);

    if (meetingDuration > 0)
      currentSlotRef.current.style.height = `${meetingDuration}px`;
    else {
      currentSlotRef.current.style.top = `${baseY + meetingDuration}px`;
      currentSlotRef.current.style.height = `${-meetingDuration}px`;
    }
  };

  const CalendarDay = ({ daySlotRef }) => (
    <div
      className="calendar-day"
      onPointerDown={(e) => {
        setCurrentSlotRef(daySlotRef);
        setBaseY(e.clientY - (e.clientY % 25));
        daySlotRef.current.style.top = `${e.clientY - (e.clientY % 25)}px`;
      }}
    >
      <div className="calendar-slot" ref={daySlotRef} />
    </div>
  );

  return (
    <>
      <TopBar />
      <CalendarHeader />
      <div
        className="calendar"
        onPointerMove={(e) => handleDrag(e)}
        onPointerDown={(e) => setIsDragging(true)}
        onPointerUp={(e) => {
          setIsDragging(false);
          const meetingDuration =
            e.clientY - baseY - ((e.clientY - baseY) % 25);
          console.log(
            `Slot starting height: ${currentSlotRef.current.offsetTop}px`
          );
          console.log(`Slot height: ${currentSlotRef.current.style.height}`);
          if (Math.abs(meetingDuration) > 25) setShowModal(true);
        }}
        onPointerLeave={(e) => {
          setIsDragging(false);
          if (currentSlotRef && !showModal) {
            currentSlotRef.current.style.height = 0;
            setCurrentSlotRef(undefined);
          }
        }}
      >
        {daySlotRefs.map((daySlotRef, index) => <CalendarDay key={index} daySlotRef={daySlotRef} />)}
      </div>
      {showModal && (
        <div className="modal-container" ref={modalRef}>
          <div className="modal">
            <div>Modal with meeting info</div>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <button
                onClick={() => {
                  alert("Call Zoom");
                  setShowModal(false);
                  if (currentSlotRef) {
                    currentSlotRef.current.style.height = "0px";
                    setCurrentSlotRef(undefined);
                  }
                }}
              >
                Valider
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (currentSlotRef) {
                    currentSlotRef.current.style.height = "0px";
                    setCurrentSlotRef(undefined);
                  }
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
