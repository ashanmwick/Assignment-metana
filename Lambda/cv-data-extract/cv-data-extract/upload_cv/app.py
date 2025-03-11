import json
import base64
import boto3
import uuid
import os
from multipart import MultipartParser
from io import BytesIO

def lambda_handler(event, context):
    try:
        # Check if the request has a body
        if 'body' not in event:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No request body provided'})
            }

        # Check if the body is base64 encoded
        is_base64_encoded = event.get('isBase64Encoded', False)
        if not is_base64_encoded:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Request body must be base64 encoded'})
            }

        # Decode the base64 encoded request body
        body = base64.b64decode(event['body'])

        # Wrap the bytes object in a BytesIO object to make it file-like
        body_io = BytesIO(body)

        # Parse the multipart form data
        content_type = event['headers']['Content-Type']
        parser = MultipartParser(body_io, content_type)

        pdf_file = None
        metadata = {}

        for part in parser.parts():
            if part.filename:
                # Handle file part
                pdf_file = part.value
            else:
                # Handle metadata part
                metadata[part.name] = part.value

        # Check if the PDF file and metadata are present
        if not pdf_file:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No PDF file provided'})
            }

        # Generate a unique file name
        file_name = f"cv_{uuid.uuid4()}.pdf"

        # Initialize S3 client
        S3 = boto3.client("s3")
        s3_bucket_name = os.environ['S3_BUCKET_NAME']

        # Upload the file to S3 with metadata
        S3.put_object(
            Bucket=s3_bucket_name,
            Key=file_name,
            Body=pdf_file,
            Metadata=metadata  # Add metadata to the S3 object
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow all origins
                'Access-Control-Allow-Methods': 'OPTIONS,POST',  # Allow POST method
                'Access-Control-Allow-Headers': 'Content-Type',  # Allow specific headers
            },
            'body': json.dumps({'message': 'File uploaded successfully', 'file_name': file_name})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }