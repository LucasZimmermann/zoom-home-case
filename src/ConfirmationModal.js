import React from "react";
import {
  computeSlotStartDate,
  computeSlotEndDate,
  convertSlotHeightInPxToMin,
} from "./utils/calendarHelper";
import { createZoomMeeting } from "./utils/zoom";
import "./ConfirmationModal.css"

const ConfirmationModal = ({
  slotWeekDayNumber,
  currentSlotRef,
  setShowConfirmationModal,
  setCurrentSlotRef,
}) => {
  const slotStartDate = computeSlotStartDate(slotWeekDayNumber, currentSlotRef);
  const slotEndDate = computeSlotEndDate(slotStartDate, currentSlotRef);
  const slotDuration = convertSlotHeightInPxToMin(currentSlotRef.current.style.height)

  return (
    <div className="modal-container">
      <div className="modal">
        <h2>Set up a meeting on Zoom</h2>
        <div className="modal-body">
          <h4>{`Starts at: ${slotStartDate}`}</h4>
          <h4>{`Ends at: ${slotEndDate}`}</h4>
        </div>
        <div className="modal-button-container">
          <button
            className="modal-button"
            onClick={async () => {
              await createZoomMeeting(
                slotStartDate,
                slotDuration
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
  );
};

export default ConfirmationModal;
