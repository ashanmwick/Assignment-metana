import json
import base64
import PyPDF2
from io import BytesIO
import re

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

        # Extract text from the PDF
        text = extract_text_from_pdf(BytesIO(pdf_file))
        
        # Extract sections and personal info
        sections = extract_sections(text)
        personal_info = extract_personal_info(sections["Personal Info"])
        
        # Structure the response
        structured_response = {
            "Name": personal_info["Name"],
            "Email": personal_info["Email"],
            "Phone": personal_info["Phone"],
            "Education": sections["Education"],
            "Qualifications": sections["Qualifications"],
            "Projects": sections["Projects"]
        }
        
        return {
            'statusCode': 200,
            'body': json.dumps(structured_response, indent=4)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    

def extract_personal_info(text):
    name = re.search(r"(?i)name:\s*([\w\s]+)", text)
    email = re.search(r"[\w\.-]+@[\w\.-]+", text)
    phone = re.search(r"\+?\d[\d\s-]{7,}", text)
    return {
        "Name": name.group(1).strip() if name else "Not Found",
        "Email": email.group(0).strip() if email else "Not Found",
        "Phone": phone.group(0).strip() if phone else "Not Found"
    }

def extract_sections(text):
    sections = {}

    # Regex patterns for each section
    education_pattern = r"(?i)education[\s\S]*?(?=\n\w+:|$)"
    qualifications_pattern = r"(?i)qualifications[\s\S]*?(?=\n\w+:|$)"
    projects_pattern = r"(?i)projects[\s\S]*?(?=\n\w+:|$)"
    personal_info_pattern = r"(?i)(name|contact|email|phone)[\s\S]*?(?=\n\w+:|$)"

    # Extract sections using regex
    sections["Education"] = re.search(education_pattern, text).group(0) if re.search(education_pattern,
                                                                                     text) else "Not Found"
    sections["Qualifications"] = re.search(qualifications_pattern, text).group(0) if re.search(qualifications_pattern,
                                                                                               text) else "Not Found"
    sections["Projects"] = re.search(projects_pattern, text).group(0) if re.search(projects_pattern,
                                                                                   text) else "Not Found"
    sections["Personal Info"] = re.search(personal_info_pattern, text).group(0) if re.search(personal_info_pattern,
                                                                                             text) else "Not Found"

    return sections

def extract_text_from_pdf(file_path):
    reader = PyPDF2.PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text