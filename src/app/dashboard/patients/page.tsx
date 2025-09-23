'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Calendar,
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

interface Patient {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    role: string
  }
  dateOfBirth: string
  emergencyContact?: string
  insuranceType?: string
  insuranceProvider?: string
}

interface PatientFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  zipCode: string
  emergencyContact: string
  emergencyPhone: string
  insuranceType: string
  insuranceProvider: string
}

export default function PatientsPage() {
  const { user, token } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [addPatientLoading, setAddPatientLoading] = useState(false)
  const [editPatientLoading, setEditPatientLoading] = useState(false)
  const [addPatientError, setAddPatientError] = useState('')
  const [editPatientError, setEditPatientError] = useState('')
  
  const [patientFormData, setPatientFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    insuranceType: 'SELF_PAY',
    insuranceProvider: '',
  })

  const [editPatientFormData, setEditPatientFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    insuranceType: 'SELF_PAY',
    insuranceProvider: '',
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users?role=PATIENT', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Transform the API response to match the expected patient interface
          const patientsData = result.data.map((item: any) => ({
            id: item.patient?.id || item.id,
            user: {
              id: item.id,
              firstName: item.firstName,
              lastName: item.lastName,
              email: item.email,
              phone: item.phone,
              role: item.role
            },
            dateOfBirth: item.patient?.dateOfBirth || '',
            emergencyContact: item.patient?.emergencyContact || '',
            insuranceType: item.patient?.insuranceType || '',
            insuranceProvider: item.patient?.insuranceProvider || ''
          }))
          setPatients(patientsData)
        }
      } else {
        setError('Failed to fetch patients')
      }
    } catch (err) {
      setError('Error loading patients')
    } finally {
      setLoading(false)
    }
  }

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsViewModalOpen(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    // Populate the edit form with patient data
    setEditPatientFormData({
      firstName: patient.user.firstName,
      lastName: patient.user.lastName,
      email: patient.user.email,
      phone: patient.user.phone || '',
      dateOfBirth: patient.dateOfBirth,
      gender: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      emergencyContact: patient.emergencyContact || '',
      emergencyPhone: '',
      insuranceType: patient.insuranceType || 'SELF_PAY',
      insuranceProvider: patient.insuranceProvider || '',
    })
    setIsEditModalOpen(true)
  }

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setAddPatientLoading(true)
      setAddPatientError('')
      
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientFormData),
      })

      if (response.ok) {
        const result = await response.json()
        // Add the new patient to the list
        const newPatient: Patient = {
          id: result.data.id,
          user: result.data.user,
          dateOfBirth: result.data.dateOfBirth,
          emergencyContact: result.data.emergencyContact,
          insuranceType: result.data.insuranceType,
          insuranceProvider: result.data.insuranceProvider,
        }
        setPatients([newPatient, ...patients])
        setIsAddModalOpen(false)
        // Reset form
        setPatientFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          emergencyContact: '',
          emergencyPhone: '',
          insuranceType: 'SELF_PAY',
          insuranceProvider: '',
        })
      } else {
        const result = await response.json()
        setAddPatientError(result.error || 'Failed to create patient')
      }
    } catch (err) {
      setAddPatientError('Error creating patient')
    } finally {
      setAddPatientLoading(false)
    }
  }

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setEditPatientLoading(true)
      setEditPatientError('')
      
      const response = await fetch(`/api/patients/${selectedPatient?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPatientFormData),
      })

      if (response.ok) {
        const result = await response.json()
        // Update the patient in the list
        setPatients(patients.map(p => 
          p.id === selectedPatient?.id ? {
            ...p,
            user: {
              ...p.user,
              firstName: result.data.user.firstName,
              lastName: result.data.user.lastName,
              email: result.data.user.email,
              phone: result.data.user.phone,
            },
            dateOfBirth: result.data.dateOfBirth,
            emergencyContact: result.data.emergencyContact,
            insuranceType: result.data.insuranceType,
            insuranceProvider: result.data.insuranceProvider,
          } : p
        ))
        setIsEditModalOpen(false)
      } else {
        const result = await response.json()
        setEditPatientError(result.error || 'Failed to update patient')
      }
    } catch (err) {
      setEditPatientError('Error updating patient')
    } finally {
      setEditPatientLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPatientFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditPatientFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setPatientFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    setEditPatientFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredPatients = patients.filter(patient =>
    patient.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

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
          {/* View Patient Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Patient Details</DialogTitle>
                <DialogDescription>
                  Viewing details for {selectedPatient?.user.firstName} {selectedPatient?.user.lastName}
                </DialogDescription>
              </DialogHeader>
              {selectedPatient && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedPatient.user.firstName}</div>
                    </div>
                    
                    <div>
                      <Label>Last Name</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedPatient.user.lastName}</div>
                    </div>
                    
                    <div>
                      <Label>Email</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedPatient.user.email}</div>
                    </div>
                    
                    <div>
                      <Label>Phone</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedPatient.user.phone || 'Not provided'}</div>
                    </div>
                    
                    <div>
                      <Label>Date of Birth</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{formatDate(selectedPatient.dateOfBirth)}</div>
                    </div>
                    
                    <div>
                      <Label>Age</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{getAge(selectedPatient.dateOfBirth)} years</div>
                    </div>
                    
                    <div>
                      <Label>Insurance Type</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedPatient.insuranceType || 'Not provided'}</div>
                    </div>
                    
                    <div>
                      <Label>Insurance Provider</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedPatient.insuranceProvider || 'Not provided'}</div>
                    </div>
                    
                    <div>
                      <Label>Emergency Contact</Label>
                      <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700">{selectedPatient.emergencyContact || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Patient Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Patient</DialogTitle>
                <DialogDescription>
                  Editing details for {selectedPatient?.user.firstName} {selectedPatient?.user.lastName}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdatePatient} className="space-y-4">
                {editPatientError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                    {editPatientError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editFirstName">First Name *</Label>
                    <Input
                      id="editFirstName"
                      name="firstName"
                      value={editPatientFormData.firstName}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editLastName">Last Name *</Label>
                    <Input
                      id="editLastName"
                      name="lastName"
                      value={editPatientFormData.lastName}
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
                      value={editPatientFormData.email}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editPhone">Phone</Label>
                    <Input
                      id="editPhone"
                      name="phone"
                      value={editPatientFormData.phone}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editDateOfBirth">Date of Birth *</Label>
                    <Input
                      id="editDateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={editPatientFormData.dateOfBirth}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editGender">Gender</Label>
                    <Select name="gender" value={editPatientFormData.gender} onValueChange={(value) => handleEditSelectChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="editInsuranceType">Insurance Type</Label>
                    <Select name="insuranceType" value={editPatientFormData.insuranceType} onValueChange={(value) => handleEditSelectChange('insuranceType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRIVATE">Private</SelectItem>
                        <SelectItem value="MEDICARE">Medicare</SelectItem>
                        <SelectItem value="MEDICAID">Medicaid</SelectItem>
                        <SelectItem value="SELF_PAY">Self Pay</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="editInsuranceProvider">Insurance Provider</Label>
                    <Input
                      id="editInsuranceProvider"
                      name="insuranceProvider"
                      value={editPatientFormData.insuranceProvider}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editEmergencyContact">Emergency Contact</Label>
                    <Input
                      id="editEmergencyContact"
                      name="emergencyContact"
                      value={editPatientFormData.emergencyContact}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editEmergencyPhone">Emergency Phone</Label>
                    <Input
                      id="editEmergencyPhone"
                      name="emergencyPhone"
                      value={editPatientFormData.emergencyPhone}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="editAddress">Address</Label>
                  <Input
                    id="editAddress"
                    name="address"
                    value={editPatientFormData.address}
                    onChange={handleEditInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="editCity">City</Label>
                    <Input
                      id="editCity"
                      name="city"
                      value={editPatientFormData.city}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editState">State</Label>
                    <Input
                      id="editState"
                      name="state"
                      value={editPatientFormData.state}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editZipCode">Zip Code</Label>
                    <Input
                      id="editZipCode"
                      name="zipCode"
                      value={editPatientFormData.zipCode}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={editPatientLoading}>
                    {editPatientLoading ? 'Updating...' : 'Update Patient'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Add Patient Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter the patient's information to create a new account. A password setup email will be sent to the patient.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPatient} className="space-y-4">
                {addPatientError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                    {addPatientError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={patientFormData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={patientFormData.lastName}
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
                      value={patientFormData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={patientFormData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={patientFormData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select name="gender" value={patientFormData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="insuranceType">Insurance Type</Label>
                    <Select name="insuranceType" value={patientFormData.insuranceType} onValueChange={(value) => handleSelectChange('insuranceType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRIVATE">Private</SelectItem>
                        <SelectItem value="MEDICARE">Medicare</SelectItem>
                        <SelectItem value="MEDICAID">Medicaid</SelectItem>
                        <SelectItem value="SELF_PAY">Self Pay</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Input
                      id="insuranceProvider"
                      name="insuranceProvider"
                      value={patientFormData.insuranceProvider}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={patientFormData.emergencyContact}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={patientFormData.emergencyPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={patientFormData.address}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={patientFormData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={patientFormData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={patientFormData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addPatientLoading}>
                    {addPatientLoading ? 'Creating...' : 'Create Patient'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-white via-teal-50 to-cyan-50 dark:from-gray-800 dark:via-teal-900/30 dark:to-cyan-900/30 shadow-lg border border-teal-100 dark:border-teal-800">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center">
                <svg className="w-10 h-10 mr-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Patients
              </h1>
              <p className="text-teal-600 dark:text-teal-300 mt-2 font-medium text-lg">Manage patient records and information</p>
            </div>
            <Button 
              className="clinic-gradient text-white shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={() => setIsAddModalOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="card-colorful border-2 border-teal-200 dark:border-teal-700">
            <CardContent className="pt-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Search className="text-white w-3 h-3" />
                </div>
                <Input
                  placeholder="Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border-2 border-teal-200 focus:border-teal-400 transition-colors"
                />
              </div>
            </CardContent>
          </Card>

          {/* Patients Table */}
          <Card className="card-colorful border-2 border-teal-200 dark:border-teal-700">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-t-lg">
              <CardTitle className="text-xl bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center">
                <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Patient Records
              </CardTitle>
              <CardDescription className="text-teal-600 dark:text-teal-300">
                {loading ? 'Loading...' : `${filteredPatients.length} patients found`}
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
                      <TableHead>Patient</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Insurance</TableHead>
                      <TableHead>Emergency Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No patients found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="font-medium">
                                {patient.user.firstName} {patient.user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {patient.id.slice(-8)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                {patient.user.email}
                              </div>
                              {patient.user.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                  {patient.user.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="font-medium">
                                {getAge(patient.dateOfBirth)} years
                              </div>
                              <div className="text-sm text-gray-500">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {formatDate(patient.dateOfBirth)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <Badge variant="outline" className="w-fit">
                                {patient.insuranceType || 'SELF_PAY'}
                              </Badge>
                              {patient.insuranceProvider && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {patient.insuranceProvider}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {patient.emergencyContact || 'Not provided'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewPatient(patient)}
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditPatient(patient)}
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