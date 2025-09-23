'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface InsuranceDocumentUploadProps {
  onUploadSuccess?: () => void
  patientId?: string // For admin uploads
}

export function InsuranceDocumentUpload({ onUploadSuccess, patientId }: InsuranceDocumentUploadProps) {
  const { token } = useAuth()
  const [documentName, setDocumentName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
    setSuccess(null)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!documentName.trim()) {
      setError('Please enter a document name')
      return
    }
    
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    try {
      setUploading(true)
      setError(null)
      setSuccess(null)

      const formData = new FormData()
      formData.append('insuranceDocument', file)
      formData.append('documentName', documentName)
      
      if (patientId) {
        formData.append('patientId', patientId)
      }

      const response = await fetch('/api/insurance-documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('Document uploaded successfully!')
        setDocumentName('')
        setFile(null)
        if (onUploadSuccess) {
          onUploadSuccess()
        }
      } else {
        setError(result.error || 'Failed to upload document')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Insurance Document</CardTitle>
        <CardDescription>Upload your insurance card or related documents</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g., Insurance Card Front, EOB, etc."
              disabled={uploading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="insuranceDocument">Document File</Label>
            <Input
              id="insuranceDocument"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
              disabled={uploading}
            />
            <p className="text-sm text-gray-500">
              Supported formats: PDF, JPG, PNG, GIF, WEBP, DOC, DOCX. Max size: 10MB
            </p>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-500 text-sm bg-green-50 p-2 rounded">
              {success}
            </div>
          )}
          
          <Button type="submit" disabled={uploading || !documentName.trim() || !file}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}