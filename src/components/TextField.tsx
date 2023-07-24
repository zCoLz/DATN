import React, { ChangeEvent } from 'react';

interface TextFieldProps {
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<TextFieldProps> = ({ placeholder, value, onChange }) => {
    return (
        <input
            type="text"
            className="outline-none border-b-2 border-gray-300 focus:border-blue-500"
            placeholder="Enter text"
        />
    );
};

export default TextField;
