import React, { ChangeEvent, useEffect, useState } from 'react';

interface SelectOptionProps {
    apiUrl: string;
    value: number | null;
    onChange: (value: number | null) => void;
}
interface Option {
    id: number;
    name: string;
}

const SelectOption: React.FC<SelectOptionProps> = ({ apiUrl, value, onChange }) => {
    const [options, setOptions] = useState<any[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, [apiUrl]);
    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = parseInt(event.target.value);
        onChange(selectedValue);
    };
    return (
        <select className="bg-slate-200 h-8 rounded-md focus:outline-none focus:border-blue-600 ">
            {options.map((option: any) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    );
};

export default SelectOption;
