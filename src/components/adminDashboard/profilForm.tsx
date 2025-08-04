'use client'
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { updateFormSellerAction } from '@/actions/actionSellerForm';
import { toast } from 'sonner';
import { BankInfoForm, SellerBankInfo } from './bankInfoForm';

export default function EditProfileForm({ sellerProfile, id, password,/* bankInfo */ }: {
  sellerProfile: {
    businessName: string,
    phoneNumber: string,
    address: string,
    postCode: string,
  },
  id: string,
  password?: string,
 /*  bankInfo?: Partial<SellerBankInfo> */
}) {
  const [formData, setFormData] = useState(sellerProfile);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: password || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    setLoading(true);

    // Prepare data to send
    const dataToSend = { ...formData };

    // Only include password data if the section is shown and passwords match
    if (showPasswordSection &&  password) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('Error', {
          description: 'New passwords do not match'
        });
        setLoading(false);
        return;
      }

      // Add password length validation
      if (passwordData.newPassword.length < 8) {
        toast.error('Error', {
          description: 'Password must be at least 8 characters long'
        });
        setLoading(false);
        return;
      }

      // Add password data to the form data
      dataToSend.currentPassword = passwordData.currentPassword;
      dataToSend.newPassword = passwordData.newPassword;
    }

    const result = await updateFormSellerAction(id, dataToSend);
    setLoading(false);

    if (result.success) {
      toast.success('Profile updated successfully');
      // Reset password fields if password was updated
      if (showPasswordSection && password) {
        setPasswordData({
          currentPassword: password,
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordSection(false);
      }
      return;
    }

    toast.error('Error', {
      description: result.error || 'Failed to update profile'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Edit Your Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your business information for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter your business name"
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+212 600-000000"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street name, city"
            />
          </div>

          <div>
            <Label htmlFor="postCode">Post Code</Label>
            <Input
              id="postCode"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              placeholder="e.g. 40000"
            />
          </div>

          {/* Password Update Section - Only shown if seller has password (not Google auth) */}
          {password && (
            <div className="space-y-4 pt-4 border-t">
              {!showPasswordSection ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordSection(true)}
                  className="w-full"
                >
                  Change Password
                </Button>
              ) : (
                <>
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      disabled
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="text"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="text"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordSection(false)}
                    className="w-full"
                  >
                    Cancel Password Change
                  </Button>
                </>
              )}
            </div>
          )}

          <Button disabled={loading} type="submit" className="w-full mt-4">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
        {/* Add the BankInfoForm component */}
        {/* <BankInfoForm initialData={bankInfo} /> */}
      </div>
    </div>
  );
}