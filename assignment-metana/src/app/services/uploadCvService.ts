import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing file' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileData = fs.readFileSync(file.filepath);

    try {
      // Call the external API to upload the CV and get details
      const externalApiResponse = await axios.post<{
        name: string;
        email: string;
        phoneNumber: string;
        education: string;
        qualifications: string;
        projects: string;
      }>('https://external-api.com/upload', fileData, {
        headers: {
          'Content-Type': 'application/pdf', // Adjust based on the file type
        },
      });

      const { name, email, phoneNumber, education, qualifications, projects } = externalApiResponse.data;

      res.status(200).json({
        name,
        email,
        phoneNumber,
        education,
        qualifications,
        projects,
      });
    } catch (error) {
      console.error('Error calling external API:', error);
      res.status(500).json({ error: 'Error processing CV' });
    }
  });
}