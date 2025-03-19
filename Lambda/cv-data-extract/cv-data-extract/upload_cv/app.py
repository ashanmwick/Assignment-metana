import json
import boto3
import base64
import uuid
import os
from google_sheets_helper import GoogleSheetsHelper
from http_client import HttpClient
from datetime import datetime

def lambda_handler(event, context):
    try:
        # Parse the JSON body
        body = json.loads(event['body'])

        # Extract fields
        name = body.get('name')
        email = body.get('email')
        phoneNumber = body.get('phoneNumber')
        education = body.get('education')
        qualifications = body.get('qualifications')
        projects = body.get('projects')
        file_base64 = body.get('file')

        if not file_base64:
            return {'statusCode': 400, 'body': json.dumps({'error': 'No file provided'})}

        # Decode base64 to binary
        file_content = base64.b64decode(file_base64)

        file_name = f"cv_{uuid.uuid4()}.pdf"

        S3 = boto3.client("s3")
        s3_bucket_name = os.environ['S3_BUCKET_NAME']

        # Upload the file to S3
        #S3.put_object(
        #    Bucket=s3_bucket_name,
        #    Key=file_name,
        #    Body=file_content
        #)

        # Initialize GoogleSheetsHelper
        google_sheets_helper = GoogleSheetsHelper(secret_id='google-sheets-credentials-new')

        # Prepare the data to be appended
        row = [name, email, phoneNumber, education, qualifications, projects, file_name]

        # Append the data to the Google Sheet
        google_sheets_helper.append_to_sheet(
            sheet_url="https://docs.google.com/spreadsheets/d/1wXT0FP7HU1VwXkB8spfMbxi-58YU5tXV_5cEQASmn0g/edit?gid=0#gid=0",
            data=row
        )

        # Prepare CV data and metadata for HTTP request
        cv_data = {
            "personal_info": {"name": name, "email": email, "phoneNumber": phoneNumber},
            "education": education,
            "qualifications": qualifications,
            "projects": projects,
            "cv_public_link": f"https://{s3_bucket_name}.s3.amazonaws.com/{file_name}"
        }

        metadata = {
            "applicant_name": name,
            "email": email,
            "status": "testing",
            "cv_processed": True,
            "processed_timestamp": datetime.utcnow().isoformat() + "Z"
        }

        # Initialize HttpClient
        http_client = HttpClient(endpoint_url="https://rnd-assignment.automations-3d6.workers.dev/")

        # Send CV data to the endpoint
        http_response = http_client.send_cv_data(cv_data, metadata)

        if 'error' in http_response:
            return {'statusCode': 500, 'body': json.dumps({'error': http_response['error']})}

        # Return response with all form data
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'File uploaded, data added to Google Sheet, and CV data sent successfully',
                'form_data': {
                    'name': name,
                    'email': email,
                    'phoneNumber': phoneNumber,
                    'education': education,
                    'fileName': file_name,
                    'qualifications': qualifications,
                    'projects': projects
                },
                'http_response': http_response
            }),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow all origins
                'Access-Control-Allow-Methods': 'OPTIONS,POST',  # Allow POST method
                'Access-Control-Allow-Headers': 'Content-Type',  # Allow specific headers
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }