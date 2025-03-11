import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: 'Failed to parse form data' });
        return;
      }

      const { name, email, phone, education, qualifications, projects } = fields;
      const cvFile = files.cvFile;

      // Log the received data (replace with actual submission logic)
      console.log('Received application:', {
        name,
        email,
        phone,
        education,
        qualifications,
        projects,
        cvFile,
      });

      res.status(200).json({ message: 'Application received' });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}