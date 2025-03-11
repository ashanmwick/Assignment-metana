import { NextResponse } from "next/server";
import { GoogleSheetsData } from '../../interfaces/GoogleSheetsData'
import { google, sheets_v4 } from 'googleapis'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
    const form = await req.formData();

    const googleSheetsData: GoogleSheetsData = {
        name: form.get('name')?.toString() || '',
        email: form.get('email')?.toString() || '',
        phoneNumber: form.get('phoneNumber')?.toString() || '',
        education: form.get('education')?.toString() || '',
        qualifications: form.get('qualifications')?.toString() || '',
        projects: form.get('projects')?.toString() || '',
        file_name: '',
        file: form.get('file') as File || null
    };

    const response=appendFormDataToSheet(googleSheetsData);
    
    return NextResponse.json({ success: true, message: response });
}


const authenticateGoogleSheets = () => {
    const credentialsPath = path.join(process.cwd(), 'config', 'google-credentials.json')
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    return auth
}

const appendFormDataToSheet = async (data: GoogleSheetsData) => {
    const auth = await authenticateGoogleSheets()
    const sheets = google.sheets({ version: 'v4', auth })

    const spreadsheetId = 'your-google-sheet-id'  // Replace with your actual sheet ID
    const range = 'Sheet1!A1'  // Replace with your actual sheet range if needed

    const values = [
        [
            data.name,
            data.email,
            data.phoneNumber,
            data.education,
            data.qualifications,
            data.projects,
            data.file_name
        ]
    ]

    await sheets.spreadsheets.values.append(<sheets_v4.Params$Resource$Spreadsheets$Values$Append>{
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
            values
        }
    })

    console.log('Form data added to Google Sheets successfully!')
}
