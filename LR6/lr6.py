import sys
import time
import requests
from bs4 import BeautifulSoup
import pandas as pd
import matplotlib.pyplot as plt


def fetch_financial_data(ticker, field):
    base_url = f"https://finance.yahoo.com/quote/{ticker}/financials?p={ticker}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = requests.get(base_url, headers=headers, timeout=10)
        if response.status_code != 200:
            raise Exception(
                f"Ошибка: Не удалось получить данные для ticker {ticker}. HTTP Status: {response.status_code}")

        soup = BeautifulSoup(response.text, 'html.parser')
        tables = soup.find_all('div', class_='tableBody yf-9ft13')

        if not tables:
            raise Exception(f"Ошибка: Таблица финансовых данных не найдена для ticker {ticker}.")

        results = []
        for table in tables:
            rows = table.find_all('div', class_='row lv-0 yf-t22klz')
            for row in rows:
                row_title = row.find('div', class_='rowTitle yf-t22klz')
                if row_title and row_title.text.strip() == field:
                    values = [col.text.strip() for col in
                              row.find_all('div', class_=['column yf-t22klz', 'column yf-t22klz alt'])]
                    results.append({'Field': field, 'Values': values})
                    return results

        raise Exception(f"Ошибка: Поле '{field}' не найдено для ticker {ticker}.")

    except requests.exceptions.RequestException as e:
        raise Exception(f"Сетевая ошибка при получении данных: {e}")
    except Exception as e:
        raise Exception(f"Ошибка при получении данных: {str(e)}")


def save_to_csv(data, ticker):
    df = pd.DataFrame(data)
    file_name = f"{ticker}_financial_data.csv"
    df.to_csv(file_name, index=False)
    print(f"Данные сохранены в файл {file_name}")


def plot_data(data, ticker):
    plt.figure(figsize=(10, 6))
    for entry in data:
        plt.plot(entry['Values'], label=entry['Field'])
    plt.xlabel('Периоды')
    plt.ylabel('Значения')
    plt.title(f'Финансовые данные для {ticker}')
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f"{ticker}_financial_data.png")
    plt.show()


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Использование: ./financial.py 'TICKER' 'FIELD'")
        sys.exit(1)

    ticker = sys.argv[1]
    field = sys.argv[2]

    time.sleep(5)
    try:
        result = fetch_financial_data(ticker, field)
        save_to_csv(result, ticker)
        plot_data(result, ticker)

    except Exception as e:
        print(e)
        sys.exit(1)