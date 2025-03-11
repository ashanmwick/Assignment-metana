export const extractCvData = async (file: File) => {
    try {
      // Check if the file is a PDF before sending it as application/pdf
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed.')
      }
  
      const formData = new FormData()
      formData.append('file', file)
  
      const response = await fetch('http://127.0.0.1:3000/pdf-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf', // Explicitly set the Content-Type to application/pdf
        },
        body: formData,
      })
  
      if (!response.ok) {
        throw new Error('Failed to extract CV data.')
      }
  
      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'An error occurred during the extraction process.')
      } else {
        throw new Error('An unknown error occurred during the extraction process.')
      }
    }
  }
  