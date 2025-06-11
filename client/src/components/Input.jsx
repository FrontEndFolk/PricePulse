import React from 'react';

export default function Input({ type = 'text', name, placeholder, required = false }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className="input"
      autoComplete="off"
    />
  );
}
