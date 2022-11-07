import React from "react";
import "./App.css";

function App() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [slotRef, setSlotRef] = React.useState(undefined);
  const [showModal, setShowModal] = React.useState(undefined);
  const [baseY, setBaseY] = React.useState(0);

  const mondayRef = React.useRef();
  const tuesdayRef = React.useRef();
  const modalRef = React.useRef();

  const handleDrag = (e) => {
    if (!isDragging) return;

    const meetingDuration = e.clientY - baseY - ((e.clientY - baseY) % 25);

    if (meetingDuration > 0)
      slotRef.current.style.height = `${meetingDuration}px`;
    else {
      slotRef.current.style.top = `${baseY + meetingDuration}px`;
      slotRef.current.style.height = `${-meetingDuration}px`;
    }
  };

  return (
    <>
      <div className="top-bar">Calendar</div>
      <div
        className="calendar"
        onPointerMove={(e) => handleDrag(e)}
        onPointerDown={(e) => setIsDragging(true)}
        onPointerUp={(e) => {
          setIsDragging(false);
          const meetingDuration = e.clientY - baseY - ((e.clientY - baseY) % 25);
          console.log(`Slot starting height: ${slotRef.current.offsetTop}px`);
          console.log(`Slot height: ${slotRef.current.style.height}`);
          if (Math.abs(meetingDuration) > 25) setShowModal(true);
        }}
        onPointerLeave={(e) => {
          setIsDragging(false);
          if (slotRef && !showModal) {
            slotRef.current.style.height = 0;
            setSlotRef(undefined);
          }
        }}
      >
        <div
          className="calendar-day"
          onPointerDown={(e) => {
            setSlotRef(mondayRef);
            setBaseY(e.clientY - e.clientY % 25);
            mondayRef.current.style.top = `${e.clientY}px`;
          }}
        >
          Monday
          <div className="calendar-slot" ref={mondayRef}></div>
        </div>
        <div
          className="calendar-day"
          onPointerDown={(e) => {
            setSlotRef(tuesdayRef);
            setBaseY(e.clientY - e.clientY % 25);
            tuesdayRef.current.style.top = `${e.clientY}px`;
          }}
        >
          Tuesday
          <div className="calendar-slot" ref={tuesdayRef} />
        </div>
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
                  if (slotRef) {
                    slotRef.current.style.height = "0px";
                    setSlotRef(undefined);
                  }
                }}
              >
                Valider
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (slotRef) {
                    slotRef.current.style.height = "0px";
                    setSlotRef(undefined);
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
