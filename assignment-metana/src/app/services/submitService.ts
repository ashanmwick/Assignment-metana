import axios from 'axios'; // Import Axios
import { GoogleSheetsData } from '../interfaces/GoogleSheetsData';
import type { FormData } from '../interfaces/FormData';
import { metanaService } from './metanaService';

export const submitCv = async (formsubData: FormData) => {
  try {
    // Use Axios for the first POST request to upload the CV
    const uploadCvResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/upload-cv`,
      formsubData.file,
      {
        headers: {
          'Content-Type': 'application/pdf',
        },
      }
    ).then(response => {

    if (response.status !== 200) {
      throw new Error('Failed to submit the CV.');
    }

    const { file_name, message } = response.data;

    const dataForGoogleSheet: GoogleSheetsData = {
      ...formsubData,
      file_name: file_name,
    };

    //const metanasubmitResponse = metanaService(dataForGoogleSheet);
    })

    // Return the response from metanaService
    return null;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'An error occurred during submission.');
    } else {
      throw new Error('An error occurred during submission.');
    }
  }
};