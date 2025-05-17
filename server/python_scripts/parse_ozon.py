import time
import json
import sys

from selenium import webdriver
from selenium_stealth import stealth
from bs4 import BeautifulSoup


def init_webdriver():
    op = webdriver.ChromeOptions()
    op.add_argument('headless')
    op.add_argument('--no-sandbox') # попробовать потыкать если озон блочит
    op.add_argument('--disable-dev-shm-usage') # и это
    driver = webdriver.Chrome(options=op)
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


def get_page(driver, url):
    driver.get(url)
    scrolldown(driver, 10)
    return BeautifulSoup(driver.page_source, "html.parser")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "URL parameter is required"}))
        sys.exit(1)

    url = sys.argv[1]
    driver = init_webdriver()

    try:
        main_page = get_page(driver, url)
        print(json.dumps({
            "success": True,
            "content": str(main_page)
        }))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
    finally:
        driver.quit()