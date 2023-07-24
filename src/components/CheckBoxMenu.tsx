import React, { useState } from 'react';

type CheckBoxMenuProps = {
  options: string[];
  onChange: (selectedOptions: string[]) => void;
};
const CheckBoxMenu: React.FC<CheckBoxMenuProps> = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (option: string) => {
    const updateOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updateOptions);
    onChange(updateOptions);
  };

  return (
    <div className='p-2'>
      {options.map((option) => (
        <label
          htmlFor=''
          key={option}
          className='flex items-center flex-row p-2 gap-x-3 '
        >
          <input
            type='checkbox'
            checked={selectedOptions.includes(option)}
            onChange={() => handleOptionChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default CheckBoxMenu;
