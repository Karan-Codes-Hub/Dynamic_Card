import * as React from "react";

interface TextFieldProps {
  id: string; // Unique ID for the input field
  label?: string; // Optional label for the input
  type?: string; // Input type (e.g., text, email, password, etc.)
  value?: string; // Controlled value
  placeholder?: string; // Placeholder text
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
  required?: boolean; // Whether the field is required
  disabled?: boolean; // Whether the field is disabled
  errorMessage?: string; // Optional error message
  icon?: React.ReactNode; // Optional icon to display
  externalClassofInputBox?: string; // Optional external class for input box
  autoComplete?: string; // Auto-complete attribute
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Blur handler
}

const TextInputField: React.FC<TextFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  placeholder = "",
  onChange,
  onBlur = () => {},
  required = false,
  disabled = false,
  errorMessage = "",
  autoComplete = "off",
  icon,
  externalClassofInputBox = "text-field",
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className={`input-group ${externalClassofInputBox}`}>
        {icon && <span className="input-group-text">{icon}</span>}
        <input
          type={type}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          onBlur={onBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`form-control ${errorMessage ? "is-invalid" : ""} ${externalClassofInputBox}`}
        />
      </div>
      {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
    </div>
  );
};

export default TextInputField;
