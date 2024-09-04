# # script.py
# import sys

# # Accept an argument and print a message
# name = sys.argv[1] if len(sys.argv) > 1 else 'World'
# print(f'Hello, {name} from Python!')

# import pandas as pd
# import requests

# headers = {
#     "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0"
# }

# url = "https://www.nseindia.com/api/ipo-bid-details?symbol=AERON&series=SME"

# with requests.session() as s:
#     s.headers.update(headers)

#     s.get("https://www.nseindia.com/market-data/issue-information?symbol=AERON&series=SME&type=Active")
#     data = s.get(url).json()
#     # df = pd.DataFrame(data)
#     print(data)

import sys
import pandas as pd
import requests

headers = {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0"
}

def fetch_sme_ipo_details():
    symbol = sys.argv[1] if len(sys.argv) > 1 else ''

    url = f"https://www.nseindia.com/api/ipo-bid-details?symbol={symbol}&series=SME"

    # print("===================>", symbol)
    # print("===================>", url)

    try:
        with requests.session() as s:
            s.headers.update(headers)

            # Make an initial request to ensure the session is valid
            initial_response = s.get(
                f"https://www.nseindia.com/market-data/issue-information?symbol={symbol}&series=SME&type=Active"
            )
            # if initial_response.status_code == 200:
            #     print("Initial request successful")
            # else:
            #     print(f"Initial request failed with status code {initial_response.status_code}")
            initial_response.raise_for_status()

            # Fetch the IPO details
            response = s.get(url)
            if response.status_code == 200:
                data = response.json()
                
                print(data)
                # return data
            elif response.status_code == 401:
                print("Unauthorized access - possibly need to log in or check credentials")
            else:
                print(f"Request failed with status code {response.status_code}")
                response.raise_for_status()

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

# Call the function
if __name__ == "__main__":
    fetch_sme_ipo_details()

# symbol = sys.argv[1] if len(sys.argv) > 1 else ''

# url = f"https://www.nseindia.com/api/ipo-bid-details?symbol={symbol}&series=SME"

# print("===================>", symbol)
# print("===================>", url)

# try:
#     with requests.session() as s:
#         s.headers.update(headers)

#         # Make an initial request to ensure the session is valid
#         initial_response = s.get(f"https://www.nseindia.com/market-data/issue-information?symbol={symbol}&series=SME&type=Active")
#         if initial_response.status_code == 200:
#             print("Initial request successful")
#         else:
#             print(f"Initial request failed with status code {initial_response.status_code}")
#             initial_response.raise_for_status()

#         # Fetch the IPO details
#         response = s.get(url)
#         if response.status_code == 200:
#             data = response.json()
#             # Convert to DataFrame if needed
#             # df = pd.DataFrame(data)
#             print(data)
#             return data
#         elif response.status_code == 401:
#             print("Unauthorized access - possibly need to log in or check credentials")
#         else:
#             print(f"Request failed with status code {response.status_code}")
#             response.raise_for_status()

# except requests.exceptions.RequestException as e:
#     print(f"An error occurred: {e}")
