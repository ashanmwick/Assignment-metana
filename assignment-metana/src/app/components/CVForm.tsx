"use client"
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

interface FormValues {
    name: string;
    email: string;
    phoneNumber: string;
    cvDocument: File | null;
    education: string;
    qualifications: string;
    projects: string;
}

const CVForm = () => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik<FormValues>({
        initialValues: {
            name: '',
            email: '',
            phoneNumber: '',
            cvDocument: null,
            education: '',
            qualifications: '',
            projects: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            phoneNumber: Yup.string().required('Required'),
            cvDocument: Yup.mixed().required('A file is required'),
            education: Yup.string().required('Required'),
            qualifications: Yup.string().required('Required'),
            projects: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            console.log('Form values:', values);
            // Handle form submission here
        },
    });

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post<FormValues>('/services/uploadCvService', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const { name, email, phoneNumber, education, qualifications, projects } = response.data;

                formik.setValues({
                    ...formik.values,
                    name,
                    email,
                    phoneNumber,
                    education,
                    qualifications,
                    projects,
                    cvDocument: file,
                });
            } catch (error) {
                console.error('Error uploading CV:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formik.errors.name && formik.touched.name ? (
                    <div className="text-red-500 text-sm">{formik.errors.name}</div>
                ) : null}
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formik.errors.email && formik.touched.email ? (
                    <div className="text-red-500 text-sm">{formik.errors.email}</div>
                ) : null}
            </div>

            <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.phoneNumber}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
                    <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div>
                ) : null}
            </div>

            <div className="mb-4">
                <label htmlFor="cvDocument" className="block text-sm font-medium text-gray-700">CV Document</label>
                <input
                    id="cvDocument"
                    name="cvDocument"
                    type="file"
                    onChange={(event) => {
                        formik.setFieldValue('cvDocument', event.currentTarget.files?.[0]);
                        handleFileChange(event);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formik.errors.cvDocument && formik.touched.cvDocument ? (
                    <div className="text-red-500 text-sm">{formik.errors.cvDocument}</div>
                ) : null}
            </div>

            <div className="mb-4">
                <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education</label>
                <input
                    id="education"
                    name="education"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.education}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formik.errors.education && formik.touched.education ? (
                    <div className="text-red-500 text-sm">{formik.errors.education}</div>
                ) : null}
            </div>

            <div className="mb-4">
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">Qualifications</label>
                <input
                    id="qualifications"
                    name="qualifications"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.qualifications}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formik.errors.qualifications && formik.touched.qualifications ? (
                    <div className="text-red-500 text-sm">{formik.errors.qualifications}</div>
                ) : null}
            </div>

            <div className="mb-4">
                <label htmlFor="projects" className="block text-sm font-medium text-gray-700">Projects</label>
                <input
                    id="projects"
                    name="projects"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.projects}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {formik.errors.projects && formik.touched.projects ? (
                    <div className="text-red-500 text-sm">{formik.errors.projects}</div>
                ) : null}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
};

export default CVForm;