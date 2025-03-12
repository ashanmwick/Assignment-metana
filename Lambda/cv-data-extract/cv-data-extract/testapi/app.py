import json
import requests
from datetime import datetime, timezone

url = "https://rnd-assignment.automations-3d6.workers.dev"
headers = {
    "X-Candidate-Email": "ashaninduwara2018@gmail.com",
    "Content-Type": "application/json"
}

def lambda_handler(event, context):
    try:
        if 'body' not in event:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No data provided'})
            }

        try:
            body = json.loads(event['body'])
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Invalid JSON format'})
            }

        name = body.get('name')
        email = body.get('email')
        phone_number = body.get('phoneNumber')
        education = body.get('education')
        qualifications = body.get('qualifications')
        projects = body.get('projects')
        file_name = body.get('file_name')

        if not all([name, email, phone_number, education, qualifications, projects]):
            return {
                'statusCode': 400,
                'body': 'Missing required fields'
            }

        time_stamp = datetime.now(timezone.utc).isoformat()  # Use isoformat for JSON serialization
        data = {
            "cv_data": {
                "personal_info": {
                    "name": name,
                    "email": email,
                    "phone_number": phone_number
                },
                "education": education,
                "qualifications": qualifications,
                "projects": projects,
                "cv_public_link": file_name
            },
            "metadata": {
                "applicant_name": name,
                "email": email,
                "status": 'testing',
                "cv_processed": 'true',
                "processed_timestamp": time_stamp
            }
        }
        try:
            response = send_post_request(url, data=data, headers=headers)
        except Exception as e:
            return {
                'statusCode': 500,
                'body': 'Failed to send data to the server: {str(e)}'
            }

        if response is None:
            return {
                'statusCode': 500,
                'body': 'Failed to send data to the server'
            }

        # Return the response without double-serializing
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow all origins
                'Access-Control-Allow-Methods': 'OPTIONS,POST',  # Allow POST method
                'Access-Control-Allow-Headers': 'Content-Type',  # Allow specific headers
            },
            'body':{
                'message': 'Data processed successfully',
                'response': response
            }
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Internal server error: {str(e)}'
        }


def send_post_request(url, data=None, headers=None):
    # Requests will automatically serialize the data as JSON, no need for json.dumps here
    response = requests.post(url, json=data, headers=headers)
    return response  # Returns the response as a JSON object (dictionary)