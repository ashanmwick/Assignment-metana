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

        const response = await fetch("https://rnd-assignment.automations-3d6.workers.dev/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cvData),
        });

        if (!response.ok) {
            throw new Error('Failed to extract CV data.');
        }

        return await response.json();

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || 'An error occurred during the extraction process.');
        } else {
            throw new Error('An unknown error occurred during the extraction process.');
        }
    }
}
