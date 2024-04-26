import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
const DatePickerInput = ({
    value,
    setValue,
    visibility = true,
    dismiss = () => {
        console.log("Dismissed!");
    },
}) => {
    const onDatePickerChange = ({ type }, selectedDate) => {
        dismiss();
        if (type === "set") {
            setValue(selectedDate);
        }
    };

    if (!visibility) return;

    return (
        <DateTimePicker
            mode="date"
            display="spinner"
            value={value}
            onChange={onDatePickerChange}
            dateFormat="month year"
        />
    );
};

export default DatePickerInput;
