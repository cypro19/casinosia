import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { DateRange } from "react-date-range";
import { formatDateYMD } from "../../utils/dateFormatter";
import useOutsideClick from "../../utils/useOutsideClick";
import "./DateRangePicker.css";

const DateRangePicker = ({ state, setState, size, width = "333px" }) => {
  const { ref, isVisible, setIsVisible } = useOutsideClick(false);

  return (
    <div className="custom-container">
      <input
        readOnly
        className={
          size ? `form-control form-control-${size}` : "custom-input-field"
        }
        style={{ width }}
        onClick={() => setIsVisible(!isVisible)}
        value={`${formatDateYMD(state[0]?.startDate)} to ${formatDateYMD(
          state[0]?.endDate
        )}`}
      />

      {isVisible && (
        <div ref={ref} style={{ zIndex: "9999", maxWidth: "350px" }}>
          <DateRange
            editableDateInputs
            onChange={(item) => {
              setState([item.selection]);
            }}
            moveRangeOnFirstSelection={false}
            ranges={state}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

export const DateRangePickerWithoutInput = ({ state, setState }) => {
  const { ref, isVisible, setIsVisible } = useOutsideClick(false);
  return (
    <div className="custom-container date d-flex align-items-center">
      <span
        className="mt-2 d-flex "
        style={{ cursor: "pointer" }}
        onClick={() => setIsVisible(!isVisible)}
      >
        {formatDateYMD(state?.[0].startDate)} -{" "}
        {formatDateYMD(state?.[0].endDate)}&nbsp; PERIOD &nbsp;{" "}
        <FontAwesomeIcon icon={faCalendarAlt} className="mt-1" /> &nbsp;
      </span>

      {isVisible && (
        <div
          ref={ref}
          style={{
            zIndex: "9999",
            position: "absolute",
            top: "40px",
            right: "0px",
          }}
        >
          <DateRange
            editableDateInputs
            onChange={(item) => {
              setState([item.selection]);
            }}
            moveRangeOnFirstSelection={false}
            ranges={state}
          />
        </div>
      )}
    </div>
  );
};
