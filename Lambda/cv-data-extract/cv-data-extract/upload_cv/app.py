import json
import boto3
import base64
import time
import uuid
import os

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
        S3.put_object(
            Bucket=s3_bucket_name,  # Replace with your bucket name
            Key=file_name,
            Body=file_content
        )

        # Return response with all form data
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'File uploaded successfully',
                'form_data': {
                    'name': name,
                    'email': email,
                    'phoneNumber': phoneNumber,
                    'education': education,
                    'fileName': file_name,
                    'qualifications': qualifications,
                    'projects': projects
                }
            }),
            'headers': {'Content-Type': 'application/json'}
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }