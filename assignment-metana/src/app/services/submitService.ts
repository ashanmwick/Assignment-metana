import type { FormData } from '../interfaces/FormData';

export const submitCv = async (cvFormData: FormData) => {
  try {
    // Ensure a file is provided
    if (!cvFormData.file) {
      throw new Error('No file provided in the form data.');
    }

    // Convert the file to base64
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result!.toString().split(',')[1]); // Extract base64 part
        reader.onerror = (error) => reject(error);
      });
    };

    const base64File = await fileToBase64(cvFormData.file);

    // Create JSON payload
    const payload = {
      name: cvFormData.name,
      email: cvFormData.email,
      phoneNumber: cvFormData.phoneNumber,
      education: cvFormData.education,
      qualifications: cvFormData.qualifications,
      projects: cvFormData.projects,
      file: base64File, // Base64-encoded PDF
    };

    // Send the request
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-cv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit the CV.');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'An error occurred during submission.');
    } else {
      throw new Error('An error occurred during submission.');
    }
  }
};