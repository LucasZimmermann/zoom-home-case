import React from "react";
import { Modal } from "./CreateMeetingModal";
import { formatToReadableDate } from "./utils/calendarHelper"
import "./CreateMeetingModal.css";

const ConfirmationModal = ({ zoomMeetingData, setZoomMeetingData }) => {
  return (
    <Modal title="Your meeting has been scheduled ✅">
      <h4>Your meeting informations:</h4>
      <div>{`Topic: ${zoomMeetingData.topic}`}</div>
      <div>{`Agenda: ${zoomMeetingData.agenda}`}</div>
      <div>{`Start time: ${formatToReadableDate(new Date(zoomMeetingData.start_time))}`}</div>
      <div>{`Duration: ${zoomMeetingData.duration} minutes`}</div>
      <div>URL: <a href={zoomMeetingData.join_url}>{zoomMeetingData.join_url}</a></div>
      <div>{`Password: ${zoomMeetingData.password}`}</div>
      <div>{`Host email: ${zoomMeetingData.host_email}`}</div>
      <div className="modal-button-container">
        <button
          className="modal-button"
          onClick={() => {
            setZoomMeetingData(null);
          }}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
