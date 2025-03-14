import json
import requests
from datetime import datetime, timezone
import os
import debugpy

if os.environ.get("AWS_SAM_LOCAL"):
    debugpy.listen(("0.0.0.0", 5858))
    print("Waiting for debugger to attach...")
    debugpy.wait_for_client()

def lambda_handler(event, context):
    x = 10          # Click here to set a breakpoint
    y = x + 'ashan'
    return {"statusCode": 200, "body": str(y)}

def send_post_request(url, data=None, headers=None):
    try:
        response = requests.post(url, json=data, headers=headers)
        return response
    except requests.RequestException:
        return None
