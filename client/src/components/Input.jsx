import React from 'react';

export default function Input({ type = 'text', name, placeholder, required }) {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            required={required}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
}
