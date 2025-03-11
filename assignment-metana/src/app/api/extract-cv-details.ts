import { NextApiRequest, NextApiResponse } from 'next';

interface RequestBody {
  cvFile: string; // Base64 encoded CV file
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { cvFile }: RequestBody = req.body;

      // Decode the base64 string
      const buffer = Buffer.from(cvFile.split(',')[1], 'base64');

      // Here you would implement the logic to extract details from the CV file
      // For now, we'll return mock data
      const extractedData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        education: 'Bachelor of Science in Computer Science',
        qualifications: 'Certified JavaScript Developer',
        projects: 'Online Store App, CV Processing App',
      };

      res.status(200).json(extractedData);
    } catch (error) {
      console.error('Error processing CV file:', error);
      res.status(500).json({ message: 'Failed to process CV file' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}