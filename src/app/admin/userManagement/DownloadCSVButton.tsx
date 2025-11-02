'use client'

import { Download } from 'lucide-react'
import Button from '@/components/adminDashboard/shared/Button'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  joined: string
  lastLogin: string
  verified: boolean
  password: string
  isSignIn: boolean
  products_count: number
  wantedItems_count: number
  BusinessForSale_count: number
  sellerProfile: any
}

interface DownloadCSVButtonProps {
  users: User[]
  filename?: string
}

const DownloadCSVButton = ({ users, filename = 'users' }: DownloadCSVButtonProps) => {
  const convertToCSV = (data: User[]): string => {
    if (!data.length) return ''
    
    const headers = [
      'ID',
      'Name',
      'Email',
      'Role',
      'Status',
      'Joined Date',
      'Last Login',
      'Sign In Method',
      'Products Count',
      'Wanted Items Count',
      'Business For Sale Count',
      'Business Name',
      'Phone Number',
      'Address',
      'Post Code'
    ]
    
    const csvRows = data.map(user => [
      user.id,
      `"${user.name.replace(/"/g, '""')}"`, // Escape quotes in names
      user.email,
      user.role,
      user.status,
      user.joined,
      user.lastLogin,
      user.password !== 'Signed in with Google' ? 'Email/Password' : 'Google',
      user.products_count,
      user.wantedItems_count,
      user.BusinessForSale_count,
      user.sellerProfile?.businessName ? `"${user.sellerProfile.businessName.replace(/"/g, '""')}"` : '',
      user.sellerProfile?.phoneNumber || '',
      user.sellerProfile?.address ? `"${user.sellerProfile.address.replace(/"/g, '""')}"` : '',
      user.sellerProfile?.postCode || ''
    ])
    
    return [headers, ...csvRows]
      .map(row => row.join(','))
      .join('\n')
  }

  const downloadCSV = () => {
    if (!users.length) {
      alert('No data to download')
      return
    }
    
    const csvData = convertToCSV(users)
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().split('T')[0]
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${timestamp}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="outline"
      onClick={downloadCSV}
      disabled={!users.length}
      className="flex items-center gap-2"
    >
      <Download size={18} />
      Download CSV
    </Button>
  )
}

export default DownloadCSVButton