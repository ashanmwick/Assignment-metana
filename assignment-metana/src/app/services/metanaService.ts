import axios from 'axios'
import { GoogleSheetsData } from '../interfaces/GoogleSheetsData'

export const metanaService = async (sheetData: GoogleSheetsData) => {
    try {
        const timestamp = new Date().toISOString();

        const cvData = {
            cv_data: {
                personal_info: {
                    name: sheetData.name,
                    email: sheetData.email,
                    phoneNumber: sheetData.phoneNumber
                },
                education: [sheetData.education],
                qualifications: [sheetData.qualifications],
                projects: [sheetData.projects],
                cv_public_link: sheetData.file_name
            },
            metadata: {
                applicant_name: "John Doe",
                email: "john.doe@example.com",
                status: "testing",
                cv_processed: true,
                processed_timestamp: timestamp
            }
        };

        const response = await axios.post(
            "https://rnd-assignment.automations-3d6.workers.dev/",
            cvData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Candidate-Email': 'ashaninduwara2018@gmail.com'  // Added header here
                }
            }
        );

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'An error occurred during the extraction process.');
        } else if (error instanceof Error) {
            throw new Error(error.message || 'An unknown error occurred during the extraction process.');
        } else {
            throw new Error('An unknown error occurred during the extraction process.');
        }
    }
}
