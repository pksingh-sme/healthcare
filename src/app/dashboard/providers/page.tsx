'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  FileText,
  AlertCircle,
  Edit
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/protected-route'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter'

interface Provider {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    role: string
  }
  title?: string
  specialty?: string
  licenseNumber?: string
  department?: string
}

interface ProviderFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  specialty: string
  licenseNumber: string
  department: string
}

export default function ProvidersPage() {
  const { user, token } = useAuth()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [addProviderLoading, setAddProviderLoading] = useState(false)
  const [editProviderLoading, setEditProviderLoading] = useState(false)
  const [addProviderError, setAddProviderError] = useState('')
  const [editProviderError, setEditProviderError] = useState('')
  
  const [providerFormData, setProviderFormData] = useState<ProviderFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    specialty: '',
    licenseNumber: '',
    department: '',
  })

  const [editProviderFormData, setEditProviderFormData] = useState<ProviderFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    specialty: '',
    licenseNumber: '',
    department: '',
  })

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users?role=PROVIDER', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Transform the API response to match the expected provider interface
          const providersData = result.data.map((item: any) => ({
            id: item.provider?.id || item.id,
            user: {
              id: item.id,
              firstName: item.firstName,
              lastName: item.lastName,
              email: item.email,
              phone: item.phone,
              role: item.role
            },
            title: item.provider?.title || '',
            specialty: item.provider?.specialty || '',
            licenseNumber: item.provider?.licenseNumber || '',
            department: item.provider?.department || ''
          }))
          setProviders(providersData)
        }
      } else {
        setError('Failed to fetch providers')
      }
    } catch (err) {
      setError('Error loading providers')
    } finally {
      setLoading(false)
    }
  }

  const handleViewProvider = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsViewModalOpen(true)
  }

  const handleEditProvider = (provider: Provider) => {
    setSelectedProvider(provider)
    // Populate the edit form with provider data
    setEditProviderFormData({
      firstName: provider.user.firstName,
      lastName: provider.user.lastName,
      email: provider.user.email,
      phone: provider.user.phone || '',
      title: provider.title || '',
      specialty: provider.specialty || '',
      licenseNumber: provider.licenseNumber || '',
      department: provider.department || '',
    })
    setIsEditModalOpen(true)
  }

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setAddProviderLoading(true)
      setAddProviderError('')
      
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerFormData),
      })

      if (response.ok) {
        const result = await response.json()
        // Add the new provider to the list
        const newProvider: Provider = {
          id: result.data.id,
          user: result.data.user,
          title: result.data.provider?.title,
          specialty: result.data.provider?.specialty,
          licenseNumber: result.data.provider?.licenseNumber,
          department: result.data.provider?.department,
        }
        setProviders([newProvider, ...providers])
        setIsAddModalOpen(false)
        // Reset form
        setProviderFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          title: '',
          specialty: '',
          licenseNumber: '',
          department: '',
        })
      } else {
        const result = await response.json()
        setAddProviderError(result.error || 'Failed to create provider')
      }
    } catch (err) {
      setAddProviderError('Error creating provider')
    } finally {
      setAddProviderLoading(false)
    }
  }

  const handleUpdateProvider = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setEditProviderLoading(true)
      setEditProviderError('')
      
      const response = await fetch(`/api/users/${selectedProvider?.user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProviderFormData),
      })

      if (response.ok) {
        const result = await response.json()
        // Update the provider in the list
        setProviders(providers.map(p => 
          p.id === selectedProvider?.id ? {
            ...p,
            user: {
              ...p.user,
              firstName: result.data.user.firstName,
              lastName: result.data.user.lastName,
              email: result.data.user.email,
              phone: result.data.user.phone,
            },
            title: result.data.provider?.title,
            specialty: result.data.provider?.specialty,
            licenseNumber: result.data.provider?.licenseNumber,
            department: result.data.provider?.department,
          } : p
        ))
        setIsEditModalOpen(false)
      } else {
        const result = await response.json()
        setEditProviderError(result.error || 'Failed to update provider')
      }
    } catch (err) {
      setEditProviderError('Error updating provider')
    } finally {
      setEditProviderLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProviderFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditProviderFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProviderFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    setEditProviderFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredProviders = providers.filter(provider =>
    provider.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (provider.specialty && provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (!user || user.role !== 'ADMIN') {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Access Denied</h3>
              <p className="text-gray-600">You don't have permission to view this page.</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout>
        <div className="space-y-8">
          {/* View Provider Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Provider Details</DialogTitle>
                <DialogDescription>
                  Viewing details for {selectedProvider?.user.firstName} {selectedProvider?.user.lastName}
                </DialogDescription>
              </DialogHeader>
              {selectedProvider && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedProvider.user.firstName}</div>
                    </div>
                    
                    <div>
                      <Label>Last Name</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedProvider.user.lastName}</div>
                    </div>
                    
                    <div>
                      <Label>Email</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedProvider.user.email}</div>
                    </div>
                    
                    <div>
                      <Label>Phone</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedProvider.user.phone || 'Not provided'}</div>
                    </div>
                    
                    <div>
                      <Label>Title</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedProvider.title || 'Not provided'}</div>
                    </div>
                    
                    <div>
                      <Label>Specialty</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedProvider.specialty || 'Not provided'}</div>
                    </div>
                    
                    <div>
                      <Label>License Number</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedProvider.licenseNumber || 'Not provided'}</div>
                    </div>
                    
                    <div>
                      <Label>Department</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedProvider.department || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Provider Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Provider</DialogTitle>
                <DialogDescription>
                  Editing details for {selectedProvider?.user.firstName} {selectedProvider?.user.lastName}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateProvider} className="space-y-4">
                {editProviderError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                    {editProviderError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editFirstName">First Name *</Label>
                    <Input
                      id="editFirstName"
                      name="firstName"
                      value={editProviderFormData.firstName}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editLastName">Last Name *</Label>
                    <Input
                      id="editLastName"
                      name="lastName"
                      value={editProviderFormData.lastName}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editEmail">Email *</Label>
                    <Input
                      id="editEmail"
                      name="email"
                      type="email"
                      value={editProviderFormData.email}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editPhone">Phone</Label>
                    <Input
                      id="editPhone"
                      name="phone"
                      value={editProviderFormData.phone}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editTitle">Title</Label>
                    <Input
                      id="editTitle"
                      name="title"
                      value={editProviderFormData.title}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editSpecialty">Specialty</Label>
                    <Input
                      id="editSpecialty"
                      name="specialty"
                      value={editProviderFormData.specialty}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editLicenseNumber">License Number</Label>
                    <Input
                      id="editLicenseNumber"
                      name="licenseNumber"
                      value={editProviderFormData.licenseNumber}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editDepartment">Department</Label>
                    <Input
                      id="editDepartment"
                      name="department"
                      value={editProviderFormData.department}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={editProviderLoading}>
                    {editProviderLoading ? 'Updating...' : 'Update Provider'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Add Provider Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Provider</DialogTitle>
                <DialogDescription>
                  Enter the provider's information to create a new account. A password setup email will be sent to the provider.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProvider} className="space-y-4">
                {addProviderError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                    {addProviderError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={providerFormData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={providerFormData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={providerFormData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={providerFormData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={providerFormData.title}
                      onChange={handleInputChange}
                      placeholder="Dr., NP, PA, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      value={providerFormData.specialty}
                      onChange={handleInputChange}
                      required
                      placeholder="Internal Medicine, Cardiology, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="licenseNumber">License Number *</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={providerFormData.licenseNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={providerFormData.department}
                      onChange={handleInputChange}
                      placeholder="Emergency, Surgery, etc."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addProviderLoading}>
                    {addProviderLoading ? 'Creating...' : 'Create Provider'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/30 dark:to-purple-900/30 shadow-lg border border-blue-100 dark:border-blue-800">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                <svg className="w-10 h-10 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Providers
              </h1>
              <p className="text-blue-600 dark:text-blue-300 mt-2 font-medium text-lg">Manage healthcare provider accounts</p>
            </div>
            <Button 
              className="clinic-gradient text-white shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={() => setIsAddModalOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="card-colorful border-2 border-blue-200 dark:border-blue-700">
            <CardContent className="pt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Search className="text-white w-3 h-3" />
                </div>
                <Input
                  placeholder="Search providers by name, email, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border-2 border-blue-200 focus:border-blue-400 transition-colors"
                />
              </div>
            </CardContent>
          </Card>

          {/* Providers Table */}
          <Card className="card-colorful border-2 border-blue-200 dark:border-blue-700">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg">
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Provider Accounts
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-300">
                {loading ? 'Loading...' : `${filteredProviders.length} providers found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No providers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProviders.map((provider) => (
                        <TableRow key={provider.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="font-medium">
                                {provider.user.firstName} {provider.user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {provider.title ? `${provider.title}, ` : ''}{provider.user.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                {provider.user.email}
                              </div>
                              {provider.user.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                  {provider.user.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {provider.specialty || 'Not specified'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {provider.licenseNumber || 'Not provided'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {provider.department || 'Not specified'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewProvider(provider)}
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditProvider(provider)}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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