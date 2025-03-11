export const submitCv = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
  
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"/upload-cv", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf', 
        },
        body: file, 
      })
  
      if (!response.ok) {
        throw new Error('Failed to submit the CV.')
      }
  
      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'An error occurred during submission.')
      } else {
        throw new Error('An error occurred during submission.')
      }
    }
  }
  