import React from 'react';

export default function Button({ type = 'button', children, onClick }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
            {children}
        </button>
    );
}
