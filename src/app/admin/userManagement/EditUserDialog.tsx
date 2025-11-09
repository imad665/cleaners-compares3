'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Loader2, Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface User {
    id: number
    name: string
    email: string
    role: string
    status: string
    password: string
    isSignIn: boolean
}

interface SecondaryEmail {
    id: string
    email: string
    password: string
    userId: string
}

interface EditUserDialogProps {
    user: User | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onUserUpdated: () => void
}

export function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'buyer',
        status: 'active'
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isChanged, setIsChanged] = useState(false)
    const [secondaryEmails, setSecondaryEmails] = useState<SecondaryEmail[]>([])
    const [loadingSecondaryEmails, setLoadingSecondaryEmails] = useState(false)
    const [newSecondaryEmail, setNewSecondaryEmail] = useState('')
    const [addingEmail, setAddingEmail] = useState(false)
    const [editingEmailId, setEditingEmailId] = useState<string | null>(null)
    const [editingEmailValue, setEditingEmailValue] = useState('')
    const [secondaryEmailPassword, setSecondaryEmailPassword] = useState('')
    const [showSecondaryPassword, setShowSecondaryPassword] = useState(false)
    const [updatingPassword, setUpdatingPassword] = useState(false)

    // Load user data and secondary emails when dialog opens
    useEffect(() => {
        if (user && open) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: user.password === 'Signed in with Google' ? '' : user.password,
                role: user.role || 'buyer',
                status: user.status || 'active'
            })
            setIsChanged(false)
            loadSecondaryEmails()
        }
    }, [user, open])

    const loadSecondaryEmails = async () => {
        if (!user) return
        
        setLoadingSecondaryEmails(true)
        try {
            const res = await fetch(`/api/admin/userManagement/${user.id}/secondary-emails`)
            if (res.ok) {
                const data = await res.json()
                setSecondaryEmails(data)
                // Set the password from the first secondary email (all should have same password)
                if (data.length > 0) {
                    setSecondaryEmailPassword(data[0].password || '')
                } else {
                    setSecondaryEmailPassword('')
                }
            }
        } catch (error) {
            console.error('Error loading secondary emails:', error)
            toast.error('Failed to load secondary emails')
        } finally {
            setLoadingSecondaryEmails(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        setIsChanged(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user || !isChanged) {
            onOpenChange(false)
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/admin/userManagement', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user.id,
                    ...formData
                })
            })

            if (!res.ok) {
                throw new Error('Failed to update user')
            }

            toast.success('User updated successfully')
            onUserUpdated()
            onOpenChange(false)
        } catch (error) {
            console.error('Error updating user:', error)
            toast.error('Failed to update user')
        } finally {
            setLoading(false)
        }
    }

    const handleAddSecondaryEmail = async () => {
        if (!newSecondaryEmail || !user) return

        // Use the current secondary email password, or if empty, use the main user's password
        const passwordToUse = secondaryEmailPassword || formData.password

        if (!passwordToUse) {
            toast.error('Please set a password for secondary emails first')
            return
        }

        setAddingEmail(true)
        try {
            const res = await fetch(`/api/admin/userManagement/${user.id}/secondary-emails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: newSecondaryEmail,
                    password: passwordToUse
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to add secondary email')
            }

            toast.success('Secondary email added successfully')
            setNewSecondaryEmail('')
            loadSecondaryEmails()
        } catch (error: any) {
            console.error('Error adding secondary email:', error)
            toast.error(error.message || 'Failed to add secondary email')
        } finally {
            setAddingEmail(false)
        }
    }

    const handleDeleteSecondaryEmail = async (emailId: string) => {
        if (!user) return

        try {
            const res = await fetch(`/api/admin/userManagement/${user.id}/secondary-emails/${emailId}`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                throw new Error('Failed to delete secondary email')
            }

            toast.success('Secondary email deleted successfully')
            loadSecondaryEmails()
        } catch (error) {
            console.error('Error deleting secondary email:', error)
            toast.error('Failed to delete secondary email')
        }
    }

    const handleUpdateSecondaryEmailPassword = async () => {
        if (!user || !secondaryEmailPassword) return

        setUpdatingPassword(true)
        try {
            const res = await fetch(`/api/admin/userManagement/${user.id}/secondary-emails/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: secondaryEmailPassword
                })
            })

            if (!res.ok) {
                throw new Error('Failed to update secondary emails password')
            }

            toast.success('Secondary emails password updated successfully')
            loadSecondaryEmails() // Reload to get updated data
        } catch (error) {
            console.error('Error updating secondary emails password:', error)
            toast.error('Failed to update secondary emails password')
        } finally {
            setUpdatingPassword(false)
        }
    }

    const startEditing = (email: SecondaryEmail) => {
        setEditingEmailId(email.id)
        setEditingEmailValue(email.email)
    }

    const cancelEditing = () => {
        setEditingEmailId(null)
        setEditingEmailValue('')
    }

    const saveEditedEmail = async () => {
        if (!editingEmailId || !editingEmailValue || !user) return

        try {
            const res = await fetch(`/api/admin/userManagement/${user.id}/secondary-emails/${editingEmailId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: editingEmailValue
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to update secondary email')
            }

            toast.success('Secondary email updated successfully')
            setEditingEmailId(null)
            setEditingEmailValue('')
            loadSecondaryEmails()
        } catch (error: any) {
            console.error('Error updating secondary email:', error)
            toast.error(error.message || 'Failed to update secondary email')
        }
    }

    const isGoogleUser = user?.password === 'Signed in with Google'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user information and manage secondary emails.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Existing user form fields */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter user name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password {isGoogleUser && <span className="text-sm text-muted-foreground">(Google signed-in user)</span>}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder={isGoogleUser ? "Cannot change Google user password" : "Enter new password"}
                                    disabled={isGoogleUser}
                                    className="pr-10"
                                />
                                {!isGoogleUser && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                )}
                            </div>
                            {!isGoogleUser && formData.password && (
                                <p className="text-xs text-muted-foreground">
                                    Leave empty to keep current password
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    disabled
                                    value={formData.role}
                                    onValueChange={(value) => handleInputChange('role', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="buyer">Buyer</SelectItem>
                                        <SelectItem value="seller">Seller</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    disabled
                                    value={formData.status}
                                    onValueChange={(value) => handleInputChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Emails Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">Secondary Emails</Label>
                        </div>

                        {/* Secondary Email Password */}
                        <div className="space-y-2">
                            <Label htmlFor="secondary-email-password">
                                Secondary Emails Password
                                <span className="text-sm text-muted-foreground ml-2">
                                    (Shared password for all secondary emails)
                                </span>
                            </Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        id="secondary-email-password"
                                        type={showSecondaryPassword ? "text" : "password"}
                                        value={secondaryEmailPassword}
                                        onChange={(e) => setSecondaryEmailPassword(e.target.value)}
                                        placeholder="Enter password for secondary emails"
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowSecondaryPassword(!showSecondaryPassword)}
                                    >
                                        {showSecondaryPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleUpdateSecondaryEmailPassword}
                                    disabled={!secondaryEmailPassword || updatingPassword}
                                >
                                    {updatingPassword ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This password will be used for all secondary emails. Update it to change password for all existing secondary emails.
                            </p>
                        </div>

                        {/* Add New Secondary Email */}
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Add new secondary email"
                                value={newSecondaryEmail}
                                onChange={(e) => setNewSecondaryEmail(e.target.value)}
                                className="flex-1"
                                type="email"
                            />
                            <Button
                                type="button"
                                onClick={handleAddSecondaryEmail}
                                disabled={!newSecondaryEmail || addingEmail || !secondaryEmailPassword}
                            >
                                {addingEmail ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        {/* Secondary Emails Table */}
                        {loadingSecondaryEmails ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Email</TableHead>
                                            <TableHead className="w-24">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {secondaryEmails.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                                                    No secondary emails added
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            secondaryEmails.map((secondaryEmail) => (
                                                <TableRow key={secondaryEmail.id}>
                                                    <TableCell>
                                                        {editingEmailId === secondaryEmail.id ? (
                                                            <Input
                                                                value={editingEmailValue}
                                                                onChange={(e) => setEditingEmailValue(e.target.value)}
                                                                className="h-8"
                                                            />
                                                        ) : (
                                                            secondaryEmail.email
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            {editingEmailId === secondaryEmail.id ? (
                                                                <>
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={saveEditedEmail}
                                                                    >
                                                                        <Save className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={cancelEditing}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => startEditing(secondaryEmail)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => handleDeleteSecondaryEmail(secondaryEmail.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !isChanged}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}