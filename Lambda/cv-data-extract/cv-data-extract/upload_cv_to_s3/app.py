import json
import base64
import boto3
import uuid
from datetime import datetime

def lambda_handler(event, context):
    try:
        S3 = boto3.client("s3")
        get_file_content = event["content"]
        # Decode the base64 encoded file
        file_data = base64.b64decode(get_file_content)

        # Generate a unique file name
        file_name = f"cv_{uuid.uuid4()}.pdf"

        # Upload the file to S3
        S3.put_object(
            Bucket='cv-bucket-${AWS::AccountId}-${AWS::Region}',  # Replace with your bucket name
            Key=file_name,
            Body=file_data,
            ContentType='application/pdf'
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