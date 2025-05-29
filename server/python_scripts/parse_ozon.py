import time
import json
import sys
import re

from selenium import webdriver
from selenium_stealth import stealth
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.service import Service


def init_webdriver():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(options=options)
    stealth(driver,
            languages=["en-US", "en"],
            vendor="Google Inc.",
            platform="Win32",
            webgl_vendor="Intel Inc.",
            renderer="Intel Iris OpenGL Engine",
            fix_hairline=True)
    return driver


def scrolldown(driver, deep):
    for _ in range(deep):
        driver.execute_script('window.scrollBy(0, 500)')
        time.sleep(0.1)


def get_page_html(driver, url):
    driver.get(url)
    scrolldown(driver, 10)
    return driver.page_source


def parse_ozon_product(url):
    driver = init_webdriver()
    try:
        html = get_page_html(driver, url)
        soup = BeautifulSoup(html, "html.parser")

        result = {}

        # Название
        title_tag = soup.find("h1")
        result["name"] = title_tag.get_text(strip=True) if title_tag else None

        # Артикул (из URL, если не найден в HTML)
        match = re.search(r'/product/.+-(\d+)', url)
        result["article"] = int(match.group(1)) if match else None

        # Цена без скидки
        price_block = soup.find("div", class_="m3q_28")
        price_tag = price_block.find_all("span")[0] if price_block else None
        if price_tag:
            price = re.sub(r"[^\d]", "", price_tag.text)
            result["price"] = float(price) if price.isdigit() else None
        else:
            result["price"] = None

        # Цена со скидкой
        ozon_card_price_tag = soup.select_one("div.m4p_28 span.mp7_28.m5p_28")
        if ozon_card_price_tag:
            sale_price = re.sub(r"[^\d]", "", ozon_card_price_tag.text)
            result["sale_price"] = float(sale_price) if sale_price.isdigit() else None

        # Цвет — пробуем найти в dl
        color = None
        for dl in soup.find_all("dl"):
            dt = dl.find("dt")
            dd = dl.find("dd")
            if dt and "Цвет" in dt.get_text():
                color = dd.get_text(strip=True)
                break
        result["color"] = color

        # Парсинг JSON с размерами
        sizes = []
        total_quantity = 100

        raw_text = soup.get_text()
        size_data_match = re.search(r'"type":"sizes".+?"variants":(\[.+?\])', raw_text)
        if size_data_match:
            try:
                json_text = size_data_match.group(1)
                json_text = unquote(json_text)  # иногда экранированные символы
                json_text = json_text.replace('\\"', '"')
                json_text = re.sub(r'\\u002F', '/', json_text)
                size_variants = json.loads(json_text)

                for variant in size_variants:
                    size_text = variant.get("data", {}).get("searchableText") or variant.get("data", {}).get("textRs", [{}])[0].get("content", "")
                    availability = variant.get("availability", "")
                    stock = 100 if availability == "inStock" else 100
                    sizes.append({"size": size_text.strip(), "stock": stock})
                    total_quantity += stock
            except Exception as e:
                sizes = [{"size": "", "stock": 100}]
        else:
            # Fallback: если JSON не найден
            sizes = [{"size": "", "stock": 100}]

        result["sizes"] = sizes
        result["total_quantity"] = total_quantity

        return result
    finally:
        driver.quit()


if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            raise ValueError("Argument not passed")

        input_url = sys.argv[1]
        result = parse_ozon_product(input_url)
        print(json.dumps(result, ensure_ascii=False), flush=True)

    except Exception as e:
        print(str(e), file=sys.stderr, flush=True)
        sys.exit(1)