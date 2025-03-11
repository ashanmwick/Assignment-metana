import { google, sheets_v4 } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { GoogleSheetsData } from '../interfaces/GoogleSheetsData'

// Function to authenticate with Google Sheets API
const authenticateGoogleSheets = () => {
    const credentialsPath = path.join(process.cwd(), 'config', 'google-credentials.json')
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    return auth
}

// Function to append form data to Google Sheets
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

// Function to handle form submission and call Google Sheets API
export const saveFormDataToGoogleSheet = async (formData: GoogleSheetsData) => {
    try {
        await appendFormDataToSheet(formData)
        return { message: 'Form data successfully saved to Google Sheets.' }
    } catch (error) {
        console.error('Error saving form data to Google Sheets:', error)
        throw new Error('Error saving form data.')
    }
}
