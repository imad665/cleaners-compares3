// app/privacy-policy/page.tsx
import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
          <p>
            Cleaners Compare (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the website 
            https://www.cleanerscompare.com/, the world&apos;s first laundry and dry cleaning comparison 
            website. We are committed to protecting your privacy and handling your personal information 
            with transparency and care.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Personal Information:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Contact details (name, email, phone number, business address) when you request quotes or create listings</li>
                <li>Business information for machine sellers, parts suppliers, and service engineers</li>
                <li>Payment information for transactions (processed securely by our payment partners)</li>
                <li>Communication records when you contact our support team</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Automatically Collected Information:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address, browser type, device information</li>
                <li>Pages visited, search queries (e.g., &quot;used machines,&quot; &quot;parts & components&quot;)</li>
                <li>Time spent on featured products, limited-time deals, and educational videos</li>
                <li>Interaction with trusted brands and category pages</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Cookies and Tracking:</h3>
              <p>We use cookies to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Remember your search preferences and browsing history</li>
                <li>Track featured products and deals you&apos;ve viewed</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Provide personalized product recommendations</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Faciliate connections between buyers and sellers of laundry equipment and supplies</li>
            <li>Process transactions for new/used machines, parts, and sundries</li>
            <li>Match service engineers with businesses needing maintenance or repairs</li>
            <li>Send notifications about wanted items and limited-time deals</li>
            <li>Provide customer support for our comparison services</li>
            <li>Improve our website features and user experience</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Comply with legal obligations in the laundry industry</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Information Sharing</h2>
          <p className="mb-2">We share information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Equipment Sellers & Suppliers:</strong> Your contact information is shared with 
              sellers when you express interest in their machines, parts, or sundries
            </li>
            <li>
              <strong>Service Engineers:</strong> Your business details are shared with engineers 
              when you request maintenance or repair services
            </li>
            <li>
              <strong>Trusted Brands:</strong> Anonymous usage data may be shared with our partner brands
            </li>
            <li>
              <strong>Service Providers:</strong> Payment processors, analytics providers, and hosting services
            </li>
            <li>
              <strong>Legal Authorities:</strong> When required by law or to protect our rights
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Your Rights and Choices</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and review your personal information</li>
            <li>Correct inaccurate business or contact details</li>
            <li>Delete your account and personal data</li>
            <li>Opt-out of marketing communications</li>
            <li>Manage cookie preferences through your browser settings</li>
            <li>Object to certain data processing activities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information, 
            including encryption, secure servers, and access controls. However, no method 
            of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our 
            comparison services, comply with legal obligations, resolve disputes, and 
            enforce our agreements. Transaction records are typically kept for 7 years 
            for tax and compliance purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Third-Party Links</h2>
          <p>
            Our website contains links to educational videos, trusted brands, and social 
            media platforms (YouTube, Facebook, Twitter, LinkedIn). We are not responsible 
            for the privacy practices of these external sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. International Transfers</h2>
          <p>
            As a global comparison platform, your information may be transferred to and 
            processed in countries other than your own. We ensure appropriate safeguards 
            are in place for such transfers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Children&apos;s Privacy</h2>
          <p>
            Our services are directed to businesses and professionals in the laundry and 
            dry cleaning industry. We do not knowingly collect information from children 
            under 18.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Changes to This Policy</h2>
          <p>
            We may update this policy to reflect changes in our practices. We will notify 
            you of significant changes by posting the new policy on this page and updating 
            the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <div className="mt-2 p-4 bg-gray-50 rounded">
            <p>Email: privacy@cleanerscompare.com</p>
            <p>Website: <Link href="/contact" className="text-blue-600 hover:underline">Contact Form</Link></p>
            <p>Address: [Your Company Address]</p>
          </div>
        </section>

        <div className="border-t pt-6 mt-6">
          <p className="text-sm text-gray-600">
            This privacy policy should be read in conjunction with our{' '}
            <Link href="/terms-and-conditions" className="text-blue-600 hover:underline">
              Terms and Conditions
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}