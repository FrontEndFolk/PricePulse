import React from 'react';

export default function Card({ item }) {
    return (
        <div className="card">
            <div className="card__photo">
                <img src="https://placehold.co/200x200" alt="" />
            </div>
            <div className="card__content">
                <p className="card__product-name">
                    Название товара: {item.name}
                </p>
                <p className="card__product-price">
                    Текущая цена: {item.price}
                </p>
                <span className="card__product-article">
                    Артикул: {item.article}
                </span>
            </div>

        </div>
    );
}
