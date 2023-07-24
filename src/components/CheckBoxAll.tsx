import React, { useState, useEffect } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

type CheckBoxAllProps = {
    options: { student_id: number, first_name: string; last_name: string; icon: React.ReactNode }[];
    onChange: (selectedOptions: number[], selectAll: boolean) => void;
};

const CheckBoxAll: React.FC<CheckBoxAllProps> = ({ options, onChange }) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
  
    useEffect(() => {
      const initialOptions = options.map((option) => option.student_id);
      setSelectedOptions(initialOptions);
      setSelectAll(false);
    }, [options]);
  
    useEffect(() => {
      const allSelected = options.every((option) => selectedOptions.includes(option.student_id));
      setSelectAll(allSelected);
    }, [selectedOptions, options]);
  
    const handleOptionChange = (option: number) => {
        const updatedOptions = selectedOptions.includes(option)
          ? selectedOptions.filter((item) => item !== option)
          : [...selectedOptions, option];
      
        setSelectedOptions(updatedOptions);
        const allSelected = options.every((option) => updatedOptions.includes(option.student_id));
        setSelectAll(allSelected);
        onChange(updatedOptions, allSelected);
      };
  
    const handleSelectAll = () => {
      const updatedOptions = selectAll ? [] : options.map((option) => option.student_id);
      setSelectedOptions(updatedOptions);
      onChange(updatedOptions, !selectAll);
    };
  
    return (
      <div className="p-2">
        <label className="flex items-center flex-row gap-x-2 text-base">
          <input className="mt-1" type="checkbox" checked={selectAll} onChange={handleSelectAll} />
          Chọn tất cả
        </label>
        <br />
        {options.map((option) => (
          <label key={option.student_id} className="flex items-center flex-row p-2 gap-x-2">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option.student_id)}
              onChange={() => handleOptionChange(option.student_id)}
            />
            {option.last_name + ' '+ option.first_name}
          </label>
        ))}
      </div>
    );
  };

export default CheckBoxAll;
