import { saveFormDataToGoogleSheet } from './sheetService'
import { GoogleSheetsData } from '../interfaces/GoogleSheetsData'
import type { FormData } from '../interfaces/FormData'
import { metanaService } from './metanaService'

export const submitCv = async (formsubData: FormData) => {
    try {
      const formData = new FormData()
      //formData.append('file', file)
  
      const uploadCvresponse = await fetch(process.env.NEXT_PUBLIC_API_URL+"/upload-cv", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf', 
        },
        body: formsubData.file, 
      })
  
      if (!uploadCvresponse.ok) {
        throw new Error('Failed to submit the CV.')
      }

      const uploadCvResponseJson  = await uploadCvresponse.json()
      const { file_name, message } = uploadCvResponseJson 

      const dataForGoogleSheet: GoogleSheetsData = {
        ...formsubData,
        file_name: file_name
      };

      const metanasubmitResponse = await metanaService(dataForGoogleSheet)

      return await metanasubmitResponse

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'An error occurred during submission.')
      } else {
        throw new Error('An error occurred during submission.')
      }
    }
  }
  