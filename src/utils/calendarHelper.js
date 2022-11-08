import {
  MINIMUM_SLOT_DURATION,
  BASE_DATE_UTC,
  MINUTES_IN_DAY,
} from "./constants";

export const computeSlotDurationInMin = (
  relativeTopSlotYPos,
  bottomSlotYPos,
  topCalendarYPos
) => {
  const relativeBottomSlotYPos = bottomSlotYPos - topCalendarYPos;

  const meetingDuration =
    relativeBottomSlotYPos -
    relativeTopSlotYPos -
    ((relativeBottomSlotYPos - relativeTopSlotYPos) % MINIMUM_SLOT_DURATION) +
    MINIMUM_SLOT_DURATION;

  return meetingDuration;
};

export const computeYPosRelativeToCalendar = (yPos, calendarRef) => {
  const relativeTopSlotYpos = yPos - calendarRef.current.offsetTop;

  return relativeTopSlotYpos - (relativeTopSlotYpos % MINIMUM_SLOT_DURATION);
};

export const convertSlotHeightInPxToMin = (heightInPx) =>
  Number(heightInPx.replace("px", ""));

export const computeSlotStartDate = (slotWeekDayNumber, currentSlotRef) => {
  const date = new Date(BASE_DATE_UTC);
  date.setHours(0);
  const timeOffsetInMin =
    convertSlotHeightInPxToMin(currentSlotRef.current.style.top) +
    slotWeekDayNumber * MINUTES_IN_DAY;

  date.setMinutes(timeOffsetInMin);

  return date;
};

export const computeSlotEndDate = (slotStartDate, currentSlotRef) => {
  const endDate = new Date(slotStartDate);
  endDate.setMinutes(
    convertSlotHeightInPxToMin(currentSlotRef.current.style.height)
  );

  return endDate;
};

export const formatToReadableDate = (date) =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

export const modifySlotPositionAndHeight = (
  meetingDuration,
  currentSlotRef,
  slotBaseCalendarYPos
) => {
  if (meetingDuration > 0)
    currentSlotRef.current.style.height = `${meetingDuration}px`;
  else {
    currentSlotRef.current.style.top = `${
      slotBaseCalendarYPos + meetingDuration - 2 * MINIMUM_SLOT_DURATION
    }px`;
    currentSlotRef.current.style.height = `${
      -meetingDuration + 3 * MINIMUM_SLOT_DURATION
    }px`;
  }
};
