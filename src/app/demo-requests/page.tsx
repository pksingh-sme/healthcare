'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface DemoRequest {
  id: string
  name: string
  email: string
  company: string
  role: string
  message: string | null
  preferredDate: string | null
  preferredTime: string | null
  status: 'PENDING' | 'VIEWED' | 'CONTACTED' | 'DEMO_COMPLETED' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

export default function DemoRequestsPage() {
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null)
  const { token, user } = useAuth()

  useEffect(() => {
    // Only fetch data when we have a token and user is authenticated
    if (token && user) {
      fetchDemoRequests()
    }
  }, [token, user])

  const fetchDemoRequests = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Make sure we have a token before making the request
      if (!token) {
        throw new Error('Authentication required')
      }
      
      const response = await fetch('/api/demo-requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch demo requests')
      }
      
      const data = await response.json()
      setDemoRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch demo requests')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: DemoRequest['status']) => {
    try {
      // Make sure we have a token before making the request
      if (!token) {
        throw new Error('Authentication required')
      }
      
      const response = await fetch(`/api/demo-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to update demo request status'}`)
      }
      
      const updatedRequest = await response.json()
      
      // Update the local state
      setDemoRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, ...updatedRequest } : request
        )
      )
      
      // If we're viewing details of this request, update that too
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, ...updatedRequest })
      }
    } catch (err) {
      console.error('Update status error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update demo request status')
    }
  }

  const getStatusBadge = (status: DemoRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'VIEWED':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Viewed</Badge>
      case 'CONTACTED':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Contacted</Badge>
      case 'DEMO_COMPLETED':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Demo Completed</Badge>
      case 'CLOSED':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <DashboardLayout>
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Demo Requests
              </h1>
              <div className="flex space-x-3">
                <Button 
                  onClick={fetchDemoRequests} 
                  variant="outline" 
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>
            
            <Card className="card-colorful border-2 border-blue-200 dark:border-blue-700">
              <CardContent className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <DashboardLayout>
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Demo Requests
              </h1>
              <div className="flex space-x-3">
                <Button 
                  onClick={fetchDemoRequests} 
                  variant="outline" 
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>
            
            <Card className="bg-red-50 border border-red-200 rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">Error: {error}</p>
                </div>
                <Button 
                  onClick={fetchDemoRequests} 
                  className="mt-4 bg-red-600 hover:bg-red-700"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-purple-900/30 dark:to-blue-900/30 shadow-lg border border-purple-100 dark:border-purple-800">
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Demo Requests
              </h1>
              <p className="text-blue-600 dark:text-blue-300 mt-2 font-medium">
                Manage demo requests from potential clients
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={fetchDemoRequests} 
                variant="outline" 
                className="border-blue-300 text-blue-600 hover:bg-blue-50 shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total Requests</p>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{demoRequests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-200 dark:border-yellow-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3 mr-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                      {demoRequests.filter(r => r.status === 'PENDING').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Contacted</p>
                    <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                      {demoRequests.filter(r => r.status === 'CONTACTED').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-300 font-medium">Completed</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {demoRequests.filter(r => r.status === 'DEMO_COMPLETED').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Demo Requests Table */}
          <Card className="card-colorful border-2 border-blue-200 dark:border-blue-700">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Request List
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-300">
                All demo requests from potential clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {demoRequests.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No demo requests</h3>
                  <p className="mt-1 text-gray-500">Get started by creating a new demo request.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Requester</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">
                          <div>{request.name}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                        </TableCell>
                        <TableCell>{request.company}</TableCell>
                        <TableCell>{request.role}</TableCell>
                        <TableCell>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                >
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Demo Request Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Detailed information about the demo request from {selectedRequest?.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="grid gap-6 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <label className="text-right font-medium text-gray-700 dark:text-gray-300">Name</label>
                                      <div className="col-span-3 font-medium">{selectedRequest.name}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <label className="text-right font-medium text-gray-700 dark:text-gray-300">Email</label>
                                      <div className="col-span-3">
                                        <a 
                                          href={`mailto:${selectedRequest.email}`} 
                                          className="text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                          {selectedRequest.email}
                                        </a>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <label className="text-right font-medium text-gray-700 dark:text-gray-300">Company</label>
                                      <div className="col-span-3">{selectedRequest.company}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <label className="text-right font-medium text-gray-700 dark:text-gray-300">Role</label>
                                      <div className="col-span-3">{selectedRequest.role}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <label className="text-right font-medium text-gray-700 dark:text-gray-300">Submitted</label>
                                      <div className="col-span-3">
                                        {format(new Date(selectedRequest.createdAt), 'MMM dd, yyyy h:mm a')}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <label className="text-right font-medium text-gray-700 dark:text-gray-300">Status</label>
                                      <div className="col-span-3">
                                        <Select 
                                          value={selectedRequest.status} 
                                          onValueChange={(value: DemoRequest['status']) => 
                                            updateStatus(selectedRequest.id, value)
                                          }
                                        >
                                          <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="VIEWED">Viewed</SelectItem>
                                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                                            <SelectItem value="DEMO_COMPLETED">Demo Completed</SelectItem>
                                            <SelectItem value="CLOSED">Closed</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    {selectedRequest.preferredDate && (
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <label className="text-right font-medium text-gray-700 dark:text-gray-300">Preferred Date/Time</label>
                                        <div className="col-span-3">
                                          {format(new Date(selectedRequest.preferredDate), 'MMM dd, yyyy')}
                                          {selectedRequest.preferredTime && ` at ${selectedRequest.preferredTime}`}
                                        </div>
                                      </div>
                                    )}
                                    {selectedRequest.message && (
                                      <div className="grid grid-cols-4 items-start gap-4">
                                        <label className="text-right font-medium text-gray-700 dark:text-gray-300">Message</label>
                                        <div className="col-span-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                          {selectedRequest.message}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}