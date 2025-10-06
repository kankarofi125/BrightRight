import React from 'react';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ label, id, ...props }) => {
  const { value, className = '' } = props;

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 dark:text-white bg-gray-500/5 rounded-lg border border-gray-500/30 appearance-none focus:outline-none focus:ring-0 focus:border-brand-purple peer transition-colors duration-300"
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-light-card dark:bg-dark-card px-2 peer-focus:px-2 peer-focus:text-brand-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;