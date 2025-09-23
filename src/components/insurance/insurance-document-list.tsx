'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileTextIcon, 
  DownloadIcon, 
  TrashIcon, 
  EyeOpenIcon, 
  FileIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface InsuranceDocument {
  id: string
  name: string
  fileName: string
  fileSize: number
  fileType: string
  url: string
  uploadedAt: string
}

interface InsuranceDocumentListProps {
  patientId?: string // For admin viewing patient documents
}

export function InsuranceDocumentList({ patientId }: InsuranceDocumentListProps) {
  const { token, user } = useAuth()
  const [documents, setDocuments] = useState<InsuranceDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewDocument, setPreviewDocument] = useState<InsuranceDocument | null>(null)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const url = patientId 
        ? `/api/insurance-documents?patientId=${patientId}`
        : '/api/insurance-documents'
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (response.ok) {
        setDocuments(result.documents || [])
      } else {
        setError(result.error || 'Failed to fetch documents')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token && (user?.role === 'PATIENT' || user?.role === 'ADMIN' || patientId)) {
      fetchDocuments()
    }
  }, [token, user, patientId])

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      const response = await fetch(`/api/insurance-documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== documentId))
      } else {
        setError(result.error || 'Failed to delete document')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Delete error:', err)
    }
  }

  const handlePreview = (document: InsuranceDocument) => {
    setPreviewDocument(document)
  }

  const handleDownload = (doc: InsuranceDocument) => {
    const link = window.document.createElement('a')
    link.href = doc.url
    link.download = doc.fileName
    link.target = '_blank'
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileTextIcon className="w-8 h-8 text-red-500" />
    } else if (fileType.includes('image')) {
      return <FileIcon className="w-8 h-8 text-blue-500" />
    } else if (fileType.includes('word')) {
      return <FileTextIcon className="w-8 h-8 text-blue-600" />
    }
    return <FileTextIcon className="w-8 h-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex items-center p-4">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Insurance Documents</CardTitle>
          <CardDescription>
            {documents.length > 0 
              ? `You have ${documents.length} insurance document${documents.length !== 1 ? 's' : ''}`
              : 'No insurance documents uploaded yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No insurance documents found</p>
              <p className="text-sm mt-2">Upload your insurance documents to keep them organized</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <Card key={document.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {getFileIcon(document.fileType)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{document.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{document.fileName}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <span>{formatFileSize(document.fileSize)}</span>
                          <span className="mx-1">•</span>
                          <span>{formatDate(document.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handlePreview(document)}
                      >
                        <EyeOpenIcon className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDownload(document)}
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(document.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{previewDocument?.name}</DialogTitle>
            <DialogDescription>
              {previewDocument?.fileName} • {previewDocument && formatFileSize(previewDocument.fileSize)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {previewDocument && (
              <>
                {previewDocument.fileType.includes('image') ? (
                  <img 
                    src={previewDocument.url} 
                    alt={previewDocument.name}
                    className="max-w-full h-auto mx-auto"
                  />
                ) : previewDocument.fileType.includes('pdf') ? (
                  <iframe
                    src={`${previewDocument.url}#view=FitH`}
                    className="w-full h-[70vh]"
                    title={previewDocument.name}
                  />
                ) : (
                  <div className="text-center py-8">
                    <FileTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg mb-2">Preview not available</p>
                    <p className="text-gray-500 mb-4">
                      This file type cannot be previewed directly. You can download it instead.
                    </p>
                    <Button onClick={() => handleDownload(previewDocument)}>
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download Document
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewDocument(null)}>
              Close
            </Button>
            {previewDocument && (
              <Button onClick={() => handleDownload(previewDocument)}>
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}