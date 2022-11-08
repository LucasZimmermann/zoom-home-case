import React from "react";
import {
  computeSlotStartDate,
  computeSlotEndDate,
  convertSlotHeightInPxToMin,
  formatToReadableDate,
} from "./utils/calendarHelper";
import { createZoomMeeting } from "./utils/zoom";
import { MEETING_CONFIRMED_COLOUR } from "./utils/constants";
import "./CreateMeetingModal.css";

const ModalButtonGroup = ({ onConfirm, onCancel }) => (
  <div className="modal-button-container">
    <button className="modal-button" onClick={onConfirm}>
      Confirm
    </button>
    <button className="modal-button" onClick={onCancel}>
      Cancel
    </button>
  </div>
);

export const Modal = ({ children, title }) => (
  <div className="modal-container">
    <div className="modal">
      <h2>{title}</h2>
      {children}
    </div>
  </div>
);

const CreateMeetingModal = ({
  slotWeekDayNumber,
  currentSlotRef,
  setShowCreateMeetingModal,
  showCreateMeetingModal,
  setCurrentSlotRef,
  setZoomMeetingData,
}) => {
  if (!showCreateMeetingModal) return;

  const slotStartDate = computeSlotStartDate(slotWeekDayNumber, currentSlotRef);
  const slotEndDate = computeSlotEndDate(slotStartDate, currentSlotRef);
  const slotDuration = convertSlotHeightInPxToMin(
    currentSlotRef.current.style.height
  );

  return (
    <Modal title="Set up a meeting on Zoom">
      <div className="modal-body">
      <h4>Meeting scheduled:</h4>
        <div>{`Starts at: ${formatToReadableDate(slotStartDate)}`}</div>
        <div>{`Ends at: ${formatToReadableDate(slotEndDate)}`}</div>
      </div>
      <ModalButtonGroup
        onConfirm={async () => {
          const zoomDataResponse = await createZoomMeeting(
            slotStartDate,
            slotDuration
          );
          setZoomMeetingData(zoomDataResponse);
          setShowCreateMeetingModal(false);
          currentSlotRef.current.style.background = MEETING_CONFIRMED_COLOUR;
        }}
        onCancel={() => {
          setShowCreateMeetingModal(false);
          currentSlotRef.current.style.height = '0px';
          setCurrentSlotRef(undefined);
        }}
      />
    </Modal>
  );
};

export default CreateMeetingModal;
