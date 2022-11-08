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

export const computeDateFromSlot = (weekDayNumber, minutes) => {
  const date = new Date(BASE_DATE_UTC);
  date.setHours(0);
  date.setMinutes(minutes + weekDayNumber * MINUTES_IN_DAY);

  return date;
};

export const modifySlotPositionAndHeight = (
  meetingDuration,
  currentSlotRef,
  slotBaseCalendarYPos
) => {
  if (meetingDuration > 0)
    currentSlotRef.current.style.height = `${meetingDuration}px`;
  else {
    currentSlotRef.current.style.top = `${
      slotBaseCalendarYPos + meetingDuration - MINIMUM_SLOT_DURATION
    }px`;
    currentSlotRef.current.style.height = `${
      -meetingDuration + 2 * MINIMUM_SLOT_DURATION
    }px`;
  }
};
