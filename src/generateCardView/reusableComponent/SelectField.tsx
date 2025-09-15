import { Select , Spin } from "antd";
import React from "react";
import Style from "../styles/selectfield.module.css";

interface SelectField {
  label?: any;
  name: string;
  value: any;
  options: any[];
  handleChange: (name: string, val: any) => void;
  onBlur?: (name: string, value: any) => void; // Add onBlur prop
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  fetching?: boolean;
  allowClear?: boolean;
  [key: string]: any; // for extra props like `mode`, `maxTagCount`, etc.
}
const SelectField: React.FC<SelectField> = ({
  label,
  name,
  value,
  placeholder,
  onBlur,
  handleChange,
  className = "",
  options = [],
  disabled = false,
  fetching = false,
  allowClear = true,
  ...rest // spread props here
}) => {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
 
  return (
    <>
    <div className="w-100 d-flex flex-column gap-2" onMouseDown={(e) => {
    e.stopPropagation();
  }} >
      {label && (
        <div className="font-size-body-14 font-weight-medium">{label}</div>
      )}
      <div onClick={handleClick}>
        <Select
        className={`${Style.customSelect} ${className}`} 
        onChange={(val) => {
          handleChange(name, val);
        }} //  handle format should take name, val as parameter
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        style={{ width: "100%" }}
        onBlur={() => {
          onBlur(name, value);
        }
        } //  handle format should take name, val as parameter
        value={value} // Value is returned as [xyz], make sure to handle that in your handler
        disabled={disabled}
        showSearch
        placeholder={placeholder} // Keep value as undefined to reflect placeholder
        options={options} // options format -> [{value : '' , label : ''}]
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...rest}
        allowClear={allowClear}
      />
      </div>
    </div>
    </>
  );
};

export default SelectField;
