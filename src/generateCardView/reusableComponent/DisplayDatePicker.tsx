import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DisplayDatePicker = ({
  value,
  onChange,
  dateFormat,
  className,
  id,
  placeholder,
  minDate,
  maxDate,
  ...props
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat: string;
  className?: string;
  id?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  [key: string]: any;
  isMultiple?: boolean;
}) => {
  // Format date nicely
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <DatePicker
      id={id}
      selected={value}
      onChange={(date) => onChange(date as any)}
      dateFormat={dateFormat}
      className={className}
      placeholderText={ formatDate(value)}
      {...(minDate && { minDate })}
      {...(maxDate && { maxDate })}
      selectsMultiple={true}
      {...props}
    />
  );
};

export default DisplayDatePicker;
