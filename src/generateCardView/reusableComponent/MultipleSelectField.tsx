import { Select } from "antd";
import React from "react";
import Style from "../styles/selectfield.module.css";

interface MultipleSelectField {
  label?: any;
  name: string;
  value: any;
  options: any[];
  handleChange: (name: string, val: any) => void;
  onBlur?: (name: string, value: any) => void; // Add onBlur prop
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}


const MultipleSelectField: React.FC<MultipleSelectField> = ({
  label,
  name,
  value,
  placeholder,
  handleChange,
  onBlur, // Accept onBlur as a prop
  className = "",
  options = [],
  disabled = false,
}) => {
  return (
    <div className="w-100 d-flex flex-column gap-2">
      {label && (
        <div className="font-size-body-14 font-weight-medium">{label}</div>
      )}
      <Select
        className={`${Style.customSelect} ${className}`}
        onChange={(val) => {
          handleChange(name, val); // Call handleChange with name and val
        }}
        maxTagCount={"responsive"}
        onBlur={() => {
          if (onBlur) {
            onBlur(name, value); // Trigger onBlur if provided, passing name and value
          }
        }}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        size="large"
        value={value}
        disabled={disabled}
        allowClear={true}
        showSearch
        placeholder={placeholder} // Keep value as undefined to reflect placeholder
        options={options} // options format -> [{value : '' , label : ''}]
        mode="multiple"
      />
    </div>
  );
};

export default MultipleSelectField;
