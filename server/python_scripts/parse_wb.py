import sys
import json
import re
import requests
from typing import Union


def extract_article(value: Union[str, int]) -> int:
    if isinstance(value, int):
        return value

    match = re.search(r'/catalog/(\d+)/', value)
    if match:
        return int(match.group(1))
    elif value.isdigit():
        return int(value)
    else:
        raise ValueError("Не удалось извлечь артикул из ссылки")


def simplify_wb_json(data: dict) -> dict:
    result = {
        "name": data.get("name", ""),
        "article": data.get("id"),
        "price": data.get("priceU") / 100 if data.get("priceU") else None,
        "sale_price": data.get("salePriceU") / 100 if data.get("salePriceU") else None,
        "color": data.get("colors")[0].get("name") if data.get("colors") else None,
        "sizes": [],
        "total_quantity": data.get("totalQuantity")
    }

    for size in data.get("sizes", []):
        size_name = size.get("name")
        total_stock = sum(stock.get("qty", 0) for stock in size.get("stocks", []))
        result["sizes"].append({
            "size": size_name,
            "stock": total_stock
        })

    return result


def parse_wildberries_product(input_value: Union[str, int]) -> dict:
    try:
        nm_id = extract_article(input_value)
        url = f"https://card.wb.ru/cards/v1/detail?appType=1&curr=rub&dest=-1257786&spp=30&nm={nm_id}"

        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        if "data" in data and "products" in data["data"] and data["data"]["products"]:
            return simplify_wb_json(data["data"]["products"][0])
        else:
            raise ValueError("Товар не найден")

    except Exception as e:
        raise RuntimeError(f"Ошибка при парсинге: {e}")


if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            raise ValueError("Argument not passed")

        input_value = sys.argv[1]
        result = parse_wildberries_product(input_value)
        print(json.dumps(result, ensure_ascii=False), flush=True)

    except Exception as e:
        print(str(e), file=sys.stderr, flush=True)
        sys.exit(1)