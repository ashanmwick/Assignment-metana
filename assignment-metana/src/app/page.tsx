'use client'

import { useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { extractCvData } from '../app/services/extractService'
import { submitCv } from '../app/services/submitService'
import { FormData } from '../app/interfaces/FormData'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPE = 'application/pdf'

class FileValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileValidationError'
  }
}

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

  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string> & { submit?: string }>>({})

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }, [])

  const validateFile = (file: File): void => {
    if (file.type !== ACCEPTED_FILE_TYPE) {
      throw new FileValidationError('Only PDF files are allowed.')
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new FileValidationError('File size must be under 5MB.')
    }
  }

  const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setFieldErrors((prev) => ({ ...prev, file: 'Please select a file' }))
      return
    }

    try {
      validateFile(file)
      
      setFormData((prev) => ({ ...prev, file }))
      setFieldErrors((prev) => ({ ...prev, file: undefined }))
      setIsUploading(true)
      setUploadStatus('idle')
      setUploadError(null)

      const uploadResponse = await extractCvData(file)
      
      setFormData((prev) => ({
        ...prev,
        education: uploadResponse?.Education ?? '',
        qualifications: uploadResponse?.Qualifications ?? '',
        projects: uploadResponse?.Projects ?? '',
      }))

      setUploadStatus(uploadResponse ? 'success' : 'error')
      setUploadError(uploadResponse ? null : 'No data extracted from file')
    } catch (error) {
      const message = error instanceof FileValidationError 
        ? error.message 
        : 'Failed to process file upload'
      setUploadStatus('error')
      setUploadError(message)
      setFieldErrors((prev) => ({ ...prev, file: message }))
      setFormData((prev) => ({
        ...prev,
        education: '',
        qualifications: '',
        projects: '',
      }))
    } finally {
      setIsUploading(false)
    }
  }, [])

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required'
    }
    if (!formData.file) {
      errors.file = 'Please upload a PDF file'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmissionStatus('error')
      return
    }

    try {
      setSubmissionStatus('idle')
      setFieldErrors({})
      await submitCv(formData)
      setSubmissionStatus('success')
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        education: '',
        qualifications: '',
        projects: '',
        file: null,
      })
    } catch (error) {
      setSubmissionStatus('error')
      setFieldErrors((prev) => ({
        ...prev,
        submit: 'Failed to submit CV. Please try again.'
      }))
    }
  }, [formData])

  const renderInput = (
    id: keyof FormData,
    label: string,
    type: string,
    required = false
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={id}
        value={formData[id] as string}
        onChange={handleInputChange}
        required={required}
        disabled={isUploading}
        className={`mt-1 block w-full px-3 py-2 border ${
          fieldErrors[id] ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100`}
      />
      {fieldErrors[id] && (
        <p className="mt-1 text-sm text-red-600">{fieldErrors[id]}</p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Apply Now</h1>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {renderInput('name', 'Name', 'text', true)}
          {renderInput('email', 'Email', 'email', true)}
          {renderInput('phoneNumber', 'Phone Number', 'tel', true)}
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Upload PDF <span className="text-red-500">*</span>
            </label>
            <input
              id="file"
              type="file"
              accept={ACCEPTED_FILE_TYPE}
              onChange={handleFileChange}
              required
              disabled={isUploading}
              className={`mt-1 block w-full text-sm ${
                fieldErrors.file ? 'text-red-600' : 'text-gray-500'
              } file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:file:bg-gray-200`}
            />
            {fieldErrors.file && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.file}</p>
            )}
          </div>

          {renderInput('education', 'Education', 'text')}
          {renderInput('qualifications', 'Qualifications', 'text')}
          {renderInput('projects', 'Projects', 'text')}

          <button
            type="submit"
            disabled={isUploading || submissionStatus === 'success'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Processing...' : 'Submit Application'}
          </button>

          {uploadStatus === 'success' && (
            <p className="text-sm text-green-600">File processed successfully!</p>
          )}
          {uploadStatus === 'error' && uploadError && !fieldErrors.file && (
            <p className="text-sm text-red-600">{uploadError}</p>
          )}
          {submissionStatus === 'success' && (
            <p className="text-sm text-green-600">Application submitted successfully!</p>
          )}
          {submissionStatus === 'error' && fieldErrors.submit && (
            <p className="text-sm text-red-600">{fieldErrors.submit}</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Home