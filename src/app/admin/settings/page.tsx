'use client'
import React, { useEffect, useState } from 'react';
import { Save, Upload, Globe, CreditCard, Lock, Bell, Mail, Trash2, PercentCircle, EyeOff, Eye, Bot, Key, ShieldCheck } from 'lucide-react';
import Button from '@/components/adminDashboard/shared/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Logo } from '@/components/header/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


function PayementPricing({ handleSavePayment, payment, handlePaymentChange, setPayment }) {
  const [dayPriceList, setDayPriceList] = useState([{ days: "", price: "", isPopular: false }]);
  const [isInit, setIsInit] = useState(false);
  const handleDayPriceChange = (index, field, value) => {
    const updated = [...dayPriceList];
    updated[index][field] = value;
    setDayPriceList(updated);

  };
  useEffect(() => {
    console.log(payment.day_based_pricing.length, 'ppppppppp');

    if (payment.day_based_pricing.length !== 0 && !isInit) {
      setIsInit(true);
      setDayPriceList(payment.day_based_pricing);
      console.log(dayPriceList, payment, payment.day_based_pricing, 'uuuuuuuuuuuuuuuuu');

    }

  }, [payment])
  useEffect(() => {
    if (dayPriceList[0].days != '') {
      setPayment(prev => ({ ...prev, day_based_pricing: dayPriceList }));
    }
  }, [dayPriceList])

  const addDayPriceField = () => {
    setDayPriceList([...dayPriceList, { days: "", price: "", isPopular: false }]);

  };

  const removeDayPriceField = (index) => {
    const updated = [...dayPriceList];
    updated.splice(index, 1);
    setDayPriceList(updated);
  };
  return (
    <div id="payment" className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <CreditCard size={20} className="mr-2 text-blue-500" />
          Payment Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure payment methods and commission rates.
        </p>

        <form onSubmit={handleSavePayment} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              {/* <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <div className="mt-1">
                <select
                  id="currency"
                  name="currency"
                  value={payment.currency}
                  onChange={handlePaymentChange}
                  className="shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="CAD">Canadian Dollar (CAD)</option>
                  <option value="AUD">Australian Dollar (AUD)</option>
                </select>
              </div> */}
            </div>

            <div className="sm:col-span-3">
              {/* <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-700">
                Payment Gateway
              </label>
              <div className="mt-1">
                <select
                  id="paymentGateway"
                  name="paymentGateway"
                  value={payment.paymentGateway}
                  onChange={handlePaymentChange}
                  className="shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="square">Square</option>
                </select>
              </div> */}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700">
                Commission Rate (%)
              </label>
              <div className="mt-1">
                <Input
                  type="number"
                  name="commissionRate"
                  id="commissionRate"
                  min="0"
                  max="100"
                  value={payment.commissionRate}
                  onChange={handlePaymentChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Percentage commission taken from each sale.
              </p>
            </div>

          </div>
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day-Based Pricing
            </label>
            {dayPriceList.map((entry, index) => (
              <div key={index} className="flex space-x-3 items-center mb-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Days"
                  value={entry.days}
                  required
                  onChange={(e) => handleDayPriceChange(index, "days", e.target.value)}
                  className="w-1/4"
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={entry.price}
                  required
                  onChange={(e) => handleDayPriceChange(index, "price", e.target.value)}
                  className="w-1/4"
                />
                <div className='w-1/4 flex gap-3 '>
                  <input
                    id={`feature_${index}`}
                    type='radio'
                    name='feature_index'
                    value={index}
                    checked={dayPriceList[index].isPopular}
                    onChange={(e) => setDayPriceList(dayPriceList.map((d, i) => ({ ...d, isPopular: i === index })))}
                  />
                  <Label htmlFor={`feature_${index}`} className='text-xs text-gray-600'>mark is common featured</Label>
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeDayPriceField(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDayPriceField}
              className="mt-2 text-blue-600 hover:underline"
            >
              + Add More
            </button>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={16} />}
            >
              Save Payment Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Settings = () => {
  // Mock settings data
  const [general, setGeneral] = useState({
    siteName: '', //'Cleaners Compare',
    siteDescription: '',//Marketplace for laundry and dry cleaning machines, parts, and supplies.',
    contactEmail: '', //'info@cleanerscompare.com',
    contactPhone: '', //'+1 (555) 123-4567',
    address: '', //'123 Laundry Lane, Cleanville, CA 90210',

    privacyPolicy: '',
    termAndCondition: '',
    youtube: "",
    facebook: '',
    twitter: '',
    linkedin: ''

  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  // API Key state and handlers (new code)
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    gemini: ''
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    gemini: false
  });

  const [password, setPassword] = useState({
    requireStrongPassword: 'on',
    passwordExpiry: 'on'
  })

  const [payment, setPayment] = useState({
    currency: 'USD',
    paymentGateway: 'stripe',
    commissionRate: '5',
    minWithdrawal: '50',
    day_based_pricing: []
  });

  const [email, setEmail] = useState({
    sendWelcomeEmail: 'on',
    orderConfirmation: 'on',
    marketingEmails: 'off',
    emailSignature: 'The Cleaners Compare Team',
  });
  const [commission, setCommission] = useState({
    commissionRate: '',
  })

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/admin/settings');

      const { allstg } = await res.json();
      const newGeneral: { [key: string]: any } = {};
      const newPayement: { [key: string]: any } = { day_based_pricing: [] };
      const newEmails: { [key: string]: any } = {};
      const newPass: { [key: string]: any } = {};
      const newCommision: { [key: string]: any } = {};
      const newApiKey: { [key: string]: any } = {};
      //console.log(allstg, 'pppppp');
      console.log(allstg,'oooooooooooooooooooooooooooooooo');

      for (const [key, value] of Object.entries(general)) {
        newGeneral[key] = allstg[key] !== 'undefined' ? allstg[key] : '';
      }
      for (const [key, value] of Object.entries(payment)) {
        if (key != 'day_based_pricing') {
          newPayement[key] = allstg[key];
        } else {
          Object.entries(allstg).filter(([key0, value0]) => {
            if (key0.includes('days_')) {
              const d = key0.split('_');
              const isPopular = d.includes('common');
              newPayement.day_based_pricing.push({
                days: d[1],
                price: value0,
                isPopular
              })
            }
          })
        }
      }
      for (const [key, value] of Object.entries(email)) {
        newEmails[key] = allstg[key];
      }
      for (const [key, value] of Object.entries(password)) {
        newPass[key] = allstg[key];
      }
      for (const [key, value] of Object.entries(apiKeys)) {
        newApiKey[key] = allstg[key];
      }
      for (const [key, value] of Object.entries(commission)) {
        newCommision[key] = allstg[key];
      }
      //console.log(newCommision,';;;;;;;;;;;;');

      setEmail(newEmails);
      setPayment(newPayement);
      setCommission(newCommision)
      setApiKeys(newApiKey)
      //console.log(allstg, ';;;;;===========;;;;;;');
      setGeneral(newGeneral)
      setPassword(newPass)
      setLogoPreview('/uploads/logo.png')
    }
    fetchSettings()
  }, [])

  // Handle general info changes
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneral({
      ...general,
      [name]: value,
    });
  };

  // Handle payment settings changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPayment({
      ...payment,
      [name]: value,
    });
  };

  // Handle email settings changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setEmail({
      ...email,
      [name]: type === 'checkbox' ? checked ? 'on' : 'off' : value,
    });
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log(name, checked);

    setPassword({
      ...password,
      [name]: checked ? 'on' : 'off'
    })
  }

  // commission 
  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    //*console.log(name,value,commission,';;;;;;;;;;;');

    setCommission({
      ...commission,
      [name]: value,
    })
  }
  //console.log(commission,'++++++++++++++++=========');

  const handleSaveCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    for (const [key, value] of Object.entries(commission)) {
      formData.append(key, value);
    }
    //console.log(formData,'uuuuuuuuuu');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error);
        return
      }

      const { message } = await res.json();
      toast.success(message);

    } catch (error) {
      toast.error('failed to save data!')
    }

  }

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    for (const [key, value] of Object.entries(general)) {
      formData.append(key, value);
    }
    //console.log(formData, '+++++');
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        body: formData, // sending FormData
      });

      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      // Parse JSON response (make sure the backend sends JSON)
      const result = await response.json();

      if (result.success) {
        toast.success('General settings saved successfully!');
      } else {
        toast.error('Failed to save settings.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error occurred while saving settings.');
    }
  };



  const handleSecurityPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const requireStrongPasswordValue = formData.get('requireStrongPassword');

    formData.set(
      'requireStrongPassword',
      requireStrongPasswordValue === 'on' ? 'on' : 'off'
    );

    // Handle passwordExpiry
    const passwordExpiryValue = formData.get('passwordExpiry');
    formData.set(
      'passwordExpiry',
      passwordExpiryValue === 'on' ? 'on' : 'off'
    );

    console.log(formData, '^^^^^^^^^^^^^');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        body: formData, // sending FormData
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error);
      };

      const { message } = await res.json();
      toast.success(message);

    } catch (error) {
      toast.error('failed to save data!')
    }


  }

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving payment settings:', payment);
    const paymentTotal: { [key: string]: any } = {}; // Use 'any' or a more specific type if known

    for (const [key, value] of Object.entries(payment)) {
      if (key !== 'day_based_pricing') {
        paymentTotal[key] = value;
      } else {
        const dayBasedPricingArray = value as { days: string; price: string; isPopular: boolean }[]; // Type assertion
        dayBasedPricingArray.forEach((item) => {
          const feature = item.isPopular ? '_common' : '';
          paymentTotal[`days_${item.days}${feature}`] = item.price;
        });
      }
    }

    console.log(paymentTotal, 'ooooooooooooo');
    const formData = new FormData();
    for (const [key, value] of Object.entries(paymentTotal)) {
      formData.append(key, value);
    }
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        body: formData, // sending FormData
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error);
      };

      const { message } = await res.json();
      toast.success(message);

    } catch (error) {
      toast.error('failed to save data!')
    }

    // Here you would normally make an API call to save settings
    toast.success('Payment settings saved successfully!');
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving email settings:', email);
    const formData = new FormData();
    for (const [key, value] of Object.entries(email)) {
      formData.append(key, typeof value === 'boolean' ? value ? 'on' : 'off' : value);
    }
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error);
        return
      }

      const { message } = await res.json();
      toast.success(message);

    } catch (error) {
      toast.error('failed to save data!')
    }
  };



  const handleSaveApiKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    for (const [key, value] of Object.entries(apiKeys)) {
      formData.append(key, value);
    }
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        /* headers: {
          'Content-Type': 'application/json',
        }, */
        body: formData
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error);
        return;
      }

      const { message } = await res.json();
      toast.success(message);
    } catch (error) {
      toast.error('Failed to save API keys!');
    }
  };

  const handleApiKeyChange = (key: string, value: string) => {
    setApiKeys({
      ...apiKeys,
      [key]: value,
    });
  };

  const toggleKeyVisibility = (key: string) => {
    setShowKeys({
      ...showKeys,
      [key]: !showKeys[key],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your marketplace settings and configuration.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <a
            href="#general"
            className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            General
          </a>
          {/* <a
            href="#payment"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Payment
          </a> */}
          <a
            href="#email"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Email
          </a>
          {/* <a
            href="#security"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Security
          </a> */}
        </nav>
      </div>

      {/* General Settings */}
      <div id="general" className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Globe size={20} className="mr-2 text-blue-500" />
            General Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Basic information about your marketplace.
          </p>

          <form onSubmit={handleSaveGeneral} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                  Site Name
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    name="siteName"
                    id="siteName"
                    value={general.siteName}
                    onChange={handleGeneralChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                  Site Description
                </label>
                <div className="mt-1">
                  <Textarea
                    id="siteDescription"
                    name="siteDescription"
                    rows={3}
                    value={general.siteDescription}
                    onChange={handleGeneralChange}
                    className="shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of your marketplace for SEO and sharing.
                </p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <div className="mt-1">
                  <Input
                    type="email"
                    name="contactEmail"
                    id="contactEmail"
                    value={general.contactEmail}
                    onChange={handleGeneralChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    name="contactPhone"
                    id="contactPhone"
                    value={general.contactPhone}
                    onChange={handleGeneralChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Business Address
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    value={general.address}
                    onChange={handleGeneralChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Logo
                </label>
                <div className="mt-2 flex items-center">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-16 w-auto rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 rounded-full bg-white p-1 text-gray-500 shadow-sm hover:text-red-500"
                        onClick={() => {
                          setLogo(null);
                          setLogoPreview('');
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                      No logo
                    </div>
                  )}
                  <div className="ml-5">
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <span>Upload</span>
                      <input
                        id="logo-upload"
                        name="logo-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="privacyPolicy" className="block text-sm font-medium text-gray-700">
                  Privacy Policy
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    name="privacyPolicy"
                    id="privacyPolicy"
                    placeholder='https://...'
                    value={general.privacyPolicy}
                    onChange={handleGeneralChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="termAndCondition" className="block text-sm font-medium text-gray-700">
                  Term And Condition
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    name="termAndCondition"
                    id="termAndCondition"
                    placeholder='https://...'
                    value={general.termAndCondition}
                    onChange={handleGeneralChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                  Youtube channel
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    name="youtube"
                    id="youtube"
                    placeholder='https://...'
                    value={general.youtube}
                    onChange={handleGeneralChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                  Facebook Page
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    name="facebook"
                    id="facebook"
                    placeholder='https://...'
                    value={general.facebook}
                    onChange={handleGeneralChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                  Linkedin Page
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    name="linkedin"
                    id="linkedin"
                    placeholder='https://...'
                    value={general.linkedin}
                    onChange={handleGeneralChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                  Twitter Page
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    name="twitter"
                    id="twitter"
                    placeholder='https://...'
                    value={general.twitter}
                    onChange={handleGeneralChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                icon={<Save size={16} />}
              >
                Save Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div id="commission" className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <PercentCircle size={20} className="mr-2 text-blue-500" />
            Commission Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Set the default commission percentage the platform takes from each successful sale.
          </p>

          <form onSubmit={handleSaveCommission} className="mt-6 space-y-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700">
                  Commission Percentage (%)
                </label>
                <div className="mt-1">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    id="commissionRate"
                    name="commissionRate"
                    value={commission.commissionRate}
                    onChange={handleCommissionChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g. 10"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This percentage will be deducted from each seller’s earnings after a buyer confirms delivery.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                icon={<Save size={16} />}
              >
                Save Commission Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
      {/* API Key Settings (new section) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key size={20} />
            API Key Management
          </CardTitle>
          <CardDescription>
            Configure API keys for AI services used in the chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Security Assurance Message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800">Your API keys are secure</h4>
                <p className="text-sm text-blue-600 mt-1">
                  All API keys are encrypted before storage and never exposed in plain text.
                  Your credentials are protected with industry-standard security measures.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveApiKeys} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="openai-key" className="text-sm font-medium flex items-center gap-2">
                  <Bot size={16} />
                  OpenAI API Key
                </Label>
                <div className="mt-1 relative">
                  <Input
                    type={showKeys.openai ? "text" : "password"}
                    id="openai-key"
                    value={apiKeys.openai}
                    onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                    placeholder="sk-... (your OpenAI API key)"
                    className="pr-10"
                  />
                  {/* <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => toggleKeyVisibility('openai')}
                  >
                    {showKeys.openai ? (
                      <EyeOff size={16} className="text-gray-500" />
                    ) : (
                      <Eye size={16} className="text-gray-500" />
                    )}
                  </Button> */}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your OpenAI API key for ChatGPT functionality (embeddings) in the chatbot.
                </p>
              </div>

              <div>
                <Label htmlFor="gemini-key" className="text-sm font-medium flex items-center gap-2">
                  <Bot size={16} />
                  Google Gemini API Key
                </Label>
                <div className="mt-1 relative">
                  <Input
                    type={showKeys.gemini ? "text" : "password"}
                    id="gemini-key"
                    value={apiKeys.gemini}
                    onChange={(e) => handleApiKeyChange('gemini', e.target.value)}
                    placeholder="AIza... (your Gemini API key)"
                    className="pr-10"
                  />
                  {/* <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => toggleKeyVisibility('gemini')}
                  >
                    {showKeys.gemini ? (
                      <EyeOff size={16} className="text-gray-500" />
                    ) : (
                      <Eye size={16} className="text-gray-500" />
                    )}
                  </Button> */}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your Google Gemini API key for alternative AI responses in the chatbot.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save size={16} className="mr-2" />
                Save API Keys
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      {/*  <PayementPricing
        handleSavePayment={handleSavePayment}
        payment={payment}
        setPayment={setPayment}
        handlePaymentChange={handlePaymentChange} /> */}

      {/* Email Settings */}
      <div id="email" className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Mail size={20} className="mr-2 text-blue-500" />
            Email Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure email notifications and templates.
          </p>

          <form onSubmit={handleSaveEmail} className="mt-6 space-y-6">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sendWelcomeEmail"
                    name="sendWelcomeEmail"
                    type="checkbox"
                    checked={email.sendWelcomeEmail === 'on'}
                    onChange={handleEmailChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="sendWelcomeEmail" className="font-medium text-gray-700">
                    Welcome Email
                  </label>
                  <p className="text-gray-500">
                    Send a welcome email to new users when they register.
                  </p>
                </div>
              </div>



              <div>
                <label htmlFor="emailSignature" className="block text-sm font-medium text-gray-700">
                  Email Signature
                </label>
                <div className="mt-1">
                  <Textarea
                    id="emailSignature"
                    name="emailSignature"
                    rows={3}
                    value={email.emailSignature}
                    onChange={handleEmailChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This signature will be appended to all outgoing emails.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                icon={<Save size={16} />}
              >
                Save Email Settings
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Security Settings */}
      {/*  <div id="security" className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Lock size={20} className="mr-2 text-blue-500" />
            Security Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure security options for your marketplace.
          </p>
          <form onSubmit={handleSecurityPassword}>
            <div className="mt-6 space-y-6">
              <div className="border-t border-b border-gray-200 py-6">
                <h3 className="text-base font-medium text-gray-900">Password Policy</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="requireStrongPassword"
                        name="requireStrongPassword"
                        type="checkbox"
                        onChange={handlePassword}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"

                        checked={password.requireStrongPassword === 'on'}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="requireStrongPassword" className="font-medium text-gray-700">
                        Require Strong Passwords
                      </label>
                      <p className="text-gray-500">
                        Force users to create passwords with letters, numbers, and special characters.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="passwordExpiry"
                        name="passwordExpiry"
                        type="checkbox"
                        onChange={handlePassword}
                        checked={password.passwordExpiry === 'on'}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="passwordExpiry" className="font-medium text-gray-700">
                        Password Expiry
                      </label>
                      <p className="text-gray-500">
                        Force users to change passwords every 90 days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>



              <div className="flex justify-end">
                <Button
                  type='submit'
                  variant="primary"
                  icon={<Save size={16} />}
                >
                  Save Security Settings
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div> */}
      <div className='w-[100vw] h-30'> </div>
    </div>
  );
};

export default Settings;