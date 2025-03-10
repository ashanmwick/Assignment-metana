import json
import base64
import PyPDF2
from io import BytesIO

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

        # Read the PDF file
        pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_file))
        text = ""

        # Extract text from each page
        for page in pdf_reader.pages:
            text += page.extract_text()

        return {
            'statusCode': 200,
            'body': json.dumps({'text': text})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }