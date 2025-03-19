import requests
import json
from datetime import datetime

class HttpClient:
    def __init__(self, endpoint_url):
        self.endpoint_url = endpoint_url

    def send_cv_data(self, cv_data, metadata):
        headers = {
            'X-Candidate-Email': 'ashaninduwara2018@gmail.com',
            'Content-Type': 'application/json'
        }

        payload = {
            "cv_data": cv_data,
            "metadata": metadata
        }

        #print(payload)

        try:
            response = requests.post(self.endpoint_url, headers=headers, data=json.dumps(payload))
            print(response.text)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            error_details = {
                'error': str(e),
                'status_code': getattr(e.response, 'status_code', None),  # Get HTTP status code if available
                'response_text': getattr(e.response, 'text', None),  # Get response text if available
                'response_headers': getattr(e.response, 'headers', None)  # Get response headers if available
                }
            print("Request failed with details:", error_details)
            return {'error': str(e)}