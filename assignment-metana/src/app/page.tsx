'use client'

import { useState } from 'react'
import { extractCvData } from '../app/services/extractService'
import { FormData } from '../app/interfaces/FormData'

const Home = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    education: '',
    qualifications: '',
    projects: '',
    file: null,
  })

  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Ensure the file is a PDF
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed.')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB.')
        return
      }

      setFormData((prevState) => ({
        ...prevState,
        file: file,
      }))

      // Trigger the file extraction when file is selected
      setUploading(true)
      setError('')
      setUploadSuccess(false)

      try {
        const uploadResponse = await extractCvData(file)

        // Fill in the form fields with the API response if they are empty
        setFormData((prevState) => ({
          ...prevState,
          name: prevState.name || uploadResponse.Name,
          email: prevState.email || uploadResponse.Email,
          phoneNumber: prevState.phoneNumber || uploadResponse.Phone,
          education: prevState.education || uploadResponse.Education,
          qualifications: prevState.qualifications || uploadResponse.Qualifications,
          projects: prevState.projects || uploadResponse.Projects,
        }))

        setUploadSuccess(true)
        alert('File extracted successfully!')
      } catch (err) {
        setError('File extraction failed.')
      } finally {
        setUploading(false)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phoneNumber) {
      alert('Please fill out all required fields.')
      return
    }

    if (!formData.file) {
      alert('Please upload a PDF file.')
      return
    }

    // Submit the form data here if needed (other form fields)
    console.log('Form data:', formData)
  }

  return (
    <div>
      <h1>CV Extraction Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="education">Education</label>
          <input
            id="education"
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="qualifications">Qualifications</label>
          <input
            id="qualifications"
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="projects">Projects</label>
          <input
            id="projects"
            type="text"
            name="projects"
            value={formData.projects}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="file">Upload PDF</label>
          <input
            id="file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit'}
        </button>

        {uploadSuccess && <p>File extracted successfully!</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}

export default Home
