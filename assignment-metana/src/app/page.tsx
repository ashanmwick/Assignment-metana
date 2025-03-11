"use client"
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  education: string;
  qualifications: string;
  projects: string;
  cvFile: File | null;
}

interface ExtractedCVData {
  name: string;
  email: string;
  phone: string;
  education: string;
  qualifications: string;
  projects: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    education: '',
    qualifications: '',
    projects: '',
    cvFile: null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, cvFile: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.cvFile) {
      alert('Please upload a CV file.');
      return;
    }

    // Convert the CV file to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64File = event.target?.result as string;

      try {
        // Send base64 encoded CV to the endpoint to extract details
        const response = await fetch('https://go3kr2fjmi.execute-api.us-west-2.amazonaws.com/Prod/pdf-to-text/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cvFile: base64File }),
        });

        if (!response.ok) {
          throw new Error('Failed to extract CV details');
        }

        const extractedData: ExtractedCVData = await response.json();

        // Auto-fill the form with extracted details
        setFormData((prevData) => ({
          ...prevData,
          name: prevData.name || extractedData.name,
          email: prevData.email || extractedData.email,
          phone: prevData.phone || extractedData.phone,
          education: prevData.education || extractedData.education,
          qualifications: prevData.qualifications || extractedData.qualifications,
          projects: prevData.projects || extractedData.projects,
        }));
      } catch (error) {
        console.error('Error extracting CV details:', error);
        alert('Failed to extract CV details. Please try again.');
      }
    };
    reader.readAsDataURL(formData.cvFile);
  };

  const handleFinalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.cvFile) {
      alert('Please upload a CV file.');
      return;
    }

    const finalFormData = new FormData();
    finalFormData.append('name', formData.name);
    finalFormData.append('email', formData.email);
    finalFormData.append('phone', formData.phone);
    finalFormData.append('education', formData.education);
    finalFormData.append('qualifications', formData.qualifications);
    finalFormData.append('projects', formData.projects);
    finalFormData.append('cvFile', formData.cvFile);

    try {
      // Submit the final form data
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        body: finalFormData,
      });

      if (response.ok) {
        alert('Application submitted successfully!');
      } else {
        alert('Failed to submit application.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div>
      <h1>Job Application Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>CV Document Upload (PDF or DOCX):</label>
          <input
            type="file"
            name="cvFile"
            onChange={handleFileChange}
            accept=".pdf,.docx"
          />
        </div>
        <div>
          <label>Education:</label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Qualifications:</label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Projects:</label>
          <input
            type="text"
            name="projects"
            value={formData.projects}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Extract CV Details</button>
      </form>

      <form onSubmit={handleFinalSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Education:</label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Qualifications:</label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Projects:</label>
          <input
            type="text"
            name="projects"
            value={formData.projects}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}