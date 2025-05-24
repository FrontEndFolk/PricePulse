import React from 'react';

export default function Card({ item }) {
    return (
        <div className="border rounded-xl p-4 shadow-sm bg-white">
            <p><strong>id:</strong>{item.id}</p>
            <p><strong>article:</strong>{item.article}</p>
        </div>
    );
}
