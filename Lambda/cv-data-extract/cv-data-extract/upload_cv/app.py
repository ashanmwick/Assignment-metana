import json
import base64
import boto3
import uuid
import os

def lambda_handler(event, context):
    try:

        # Check if the request has a body
        if 'body' not in event:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No PDF file provided'})
            }

        # Check if the body is base64 encoded
        is_base64_encoded = event.get('isBase64Encoded', False)
        if not is_base64_encoded:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Request body must be base64 encoded'})
            }

        # Decode the base64 encoded PDF file
        pdf_file = base64.b64decode(event['body'])

        # Generate a unique file name
        file_name = f"cv_{uuid.uuid4()}.pdf"

        S3 = boto3.client("s3")
        s3_bucket_name = os.environ['S3_BUCKET_NAME']

        # Upload the file to S3
        S3.put_object(
            Bucket=s3_bucket_name,  # Replace with your bucket name
            Key=file_name,
            Body=pdf_file
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'File uploaded successfully', 'file_name': file_name})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }