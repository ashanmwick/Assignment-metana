'use client'

import { useState } from 'react'
import { extractCvData } from '../app/services/extractService'
import { submitCv } from '../app/services/submitService'
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
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false)
  const [submissionError, setSubmissionError] = useState<string>('')

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

      setUploading(true)
      setError('')
      setUploadSuccess(false)

      try {
        const uploadResponse = await extractCvData(file)

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

    console.log('Form data:', formData)
  }

  const handleSubmitCv = async () => {
    setSubmissionError('')
    setSubmissionSuccess(false)

    if (!formData.file) {
      setSubmissionError('Please upload a file before submitting.')
      return
    }

    try {
      const submissionResponse = await submitCv(formData)
      setSubmissionSuccess(true)
      alert('CV submitted successfully!')
    } catch (error) {
      setSubmissionError('CV submission failed.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Apply Now</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Upload PDF
            </label>
            <input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">
              Education
            </label>
            <input
              id="education"
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
              Qualifications
            </label>
            <input
              id="qualifications"
              type="text"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="projects" className="block text-sm font-medium text-gray-700">
              Projects
            </label>
            <input
              id="projects"
              type="text"
              name="projects"
              value={formData.projects}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {uploading ? 'Uploading...' : 'Submit Form'}
          </button>

          {uploadSuccess && <p className="text-sm text-green-600">File extracted successfully!</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <button
          onClick={handleSubmitCv}
          disabled={uploading}
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
        >
          {uploading ? 'Submitting...' : 'Submit CV'}
        </button>

        {submissionSuccess && <p className="text-sm text-green-600">CV submitted successfully!</p>}
        {submissionError && <p className="text-sm text-red-600">{submissionError}</p>}
      </div>
    </div>
  )
}

export default Home