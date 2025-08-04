'use client'
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export interface SellerBankInfo {
  accountHolder: string;
  bankName?: string;
  sortCode: string;
  accountNumber: string;
  iban?: string;
  swiftCode?: string;
  paypalEmail?: string;
  preferredPaymentMethod: 'bank' | 'paypal';
}

export function BankInfoForm({ initialData }: { initialData?: Partial<SellerBankInfo> }) {
  const [formData, setFormData] = useState<SellerBankInfo>({
    accountHolder: '',
    bankName: '',
    sortCode: '',
    accountNumber: '',
    iban: '',
    swiftCode: '',
    paypalEmail: '',
    preferredPaymentMethod: 'bank',
    ...initialData
  });
  const [errors, setErrors] = useState<Partial<SellerBankInfo>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof SellerBankInfo]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePaymentMethodChange = (value: 'bank' | 'paypal') => {
    setFormData(prev => ({ ...prev, preferredPaymentMethod: value }));
  };

  const validateForm = () => {
    const newErrors: Partial<SellerBankInfo> = {};
    
    if (!formData.accountHolder.trim()) {
      newErrors.accountHolder = 'Account holder name is required';
    }
    
    if (!formData.sortCode.trim()) {
      newErrors.sortCode = 'Sort code is required';
    } else if (!/^\d{6}$/.test(formData.sortCode.replace(/-/g, ''))) {
      newErrors.sortCode = 'Sort code must be 6 digits (e.g., 12-34-56)';
    }
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{8,}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must be at least 8 digits';
    }
    
    if (formData.preferredPaymentMethod === 'paypal' && !formData.paypalEmail?.trim()) {
      newErrors.paypalEmail = 'PayPal email is required when PayPal is selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Assume this function exists to save bank info
      const result = await saveSellerBankInfo(formData);
      
      if (result.success) {
        toast.success('Bank information saved successfully');
      } else {
        toast.error('Error saving bank information', {
          description: result.error || 'Please try again'
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error saving bank info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock function - replace with your actual API call
  const saveSellerBankInfo = async (data: SellerBankInfo) => {
    // Your implementation here
    return { success: true };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Bank Information</h2>
        <p className="text-sm text-gray-500">
          Provide your payment details to receive payouts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Holder */}
        <div>
          <Label htmlFor="accountHolder">Account Holder Name *</Label>
          <Input
            id="accountHolder"
            name="accountHolder"
            value={formData.accountHolder}
            onChange={handleChange}
            placeholder="John Doe"
            className={errors.accountHolder ? 'border-red-500' : ''}
          />
          {errors.accountHolder && (
            <p className="mt-1 text-sm text-red-600">{errors.accountHolder}</p>
          )}
        </div>

        {/* Bank Name */}
        <div>
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            name="bankName"
            value={formData.bankName || ''}
            onChange={handleChange}
            placeholder="e.g., Chase, Bank of America"
          />
        </div>

        {/* Sort Code and Account Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sortCode">Sort Code *</Label>
            <Input
              id="sortCode"
              name="sortCode"
              value={formData.sortCode}
              onChange={handleChange}
              placeholder="12-34-56"
              className={errors.sortCode ? 'border-red-500' : ''}
            />
            {errors.sortCode && (
              <p className="mt-1 text-sm text-red-600">{errors.sortCode}</p>
            )}
          </div>
          <div>
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="12345678"
              className={errors.accountNumber ? 'border-red-500' : ''}
            />
            {errors.accountNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
            )}
          </div>
        </div>

        {/* IBAN and SWIFT Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              name="iban"
              value={formData.iban || ''}
              onChange={handleChange}
              placeholder="GB29NWBK60161331926819"
            />
          </div>
          <div>
            <Label htmlFor="swiftCode">SWIFT Code</Label>
            <Input
              id="swiftCode"
              name="swiftCode"
              value={formData.swiftCode || ''}
              onChange={handleChange}
              placeholder="BOFAUS3N"
            />
          </div>
        </div>

        {/* Preferred Payment Method */}
        <div className="space-y-2">
          <Label>Preferred Payment Method *</Label>
          <RadioGroup
            value={formData.preferredPaymentMethod}
            onValueChange={handlePaymentMethodChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank" id="r1" />
              <Label htmlFor="r1">Bank Transfer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="r2" />
              <Label htmlFor="r2">PayPal</Label>
            </div>
          </RadioGroup>
        </div>

        {/* PayPal Email (conditionally shown) */}
        {formData.preferredPaymentMethod === 'paypal' && (
          <div>
            <Label htmlFor="paypalEmail">PayPal Email *</Label>
            <Input
              id="paypalEmail"
              name="paypalEmail"
              type="email"
              value={formData.paypalEmail || ''}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={errors.paypalEmail ? 'border-red-500' : ''}
            />
            {errors.paypalEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.paypalEmail}</p>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Bank Information'}
        </Button>
      </form>
    </div>
  );
}