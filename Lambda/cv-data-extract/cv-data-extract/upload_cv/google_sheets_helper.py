import gspread
from oauth2client.service_account import ServiceAccountCredentials
import json
import boto3

class GoogleSheetsHelper:
    def __init__(self, secret_id, region_name='us-west-2'):
        self.secret_id = secret_id
        self.region_name = region_name
        self.client = boto3.client('secretsmanager', region_name=self.region_name)
        self.gc = self._authenticate_google_sheets()

    def _authenticate_google_sheets(self):
        secret_response = self.client.get_secret_value(SecretId=self.secret_id)
        secret_data = json.loads(secret_response['SecretString'])

        scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
        creds = ServiceAccountCredentials.from_json_keyfile_dict(secret_data, scope)
        return gspread.authorize(creds)

    def append_to_sheet(self, sheet_url, data):
        sheet = self.gc.open_by_url(sheet_url)
        worksheet = sheet.get_worksheet(0) 

        worksheet.append_row(data)