import React, { useState, useEffect } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

type CheckBoxAllDetailProps = {
    options: { label: string; icon: React.ReactNode }[];
    onChange: (selectedOptions: string[]) => void;
    className?: string;
};

const CheckBoxAllDetail: React.FC<CheckBoxAllDetailProps> = ({ options, onChange, className }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(true);

    useEffect(() => {
        const initialOptions = options.map((option) => option.label);
        setSelectedOptions(initialOptions);
        setSelectAll(true);
    }, []);

    useEffect(() => {
        const allSelected = options.every((option) => selectedOptions.includes(option.label));
        const someSelected = selectedOptions.length > 0 && !allSelected;
    }, [selectedOptions, options]);

    const handleOptionChange = (option: string) => {
        const updatedOptions = selectedOptions.includes(option)
            ? selectedOptions.filter((item) => item !== option)
            : [...selectedOptions, option];

        setSelectedOptions(updatedOptions);
        onChange(updatedOptions);

        setSelectAll(updatedOptions.length === options.length);
    };

    const handleSelectAll = () => {
        const updatedOptions = selectAll ? [] : options.map((option) => option.label);
        setSelectedOptions(updatedOptions);
        onChange(updatedOptions);

        setSelectAll(!selectAll);
    };

    return (
        <div className={`p-2 ${className}`}>
            <label className="flex items-center flex-row gap-x-2 text-base">
                <input className="mt-1" type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                Chọn tất cả
            </label>
            <br />
            {options.map((option) => (
                <label key={option.label} className="flex items-center flex-row p-2 gap-x-2">
                    <input
                        type="checkbox"
                        checked={selectedOptions.includes(option.label)}
                        onChange={() => handleOptionChange(option.label)}
                    />
                    {option.icon}
                    {option.label}
                </label>
            ))}
        </div>
    );
};

export default CheckBoxAllDetail;
