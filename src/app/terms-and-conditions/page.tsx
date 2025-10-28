// app/terms-and-conditions/page.tsx
import React from 'react';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Cleaners Compare (&quot;the Platform&quot;) at https://www.cleanerscompare.com/, 
            you agree to be bound by these Terms and Conditions and our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>. 
            If you disagree with any part of these terms, you may not access our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>&quot;Platform&quot;</strong>: Cleaners Compare website and services</li>
            <li><strong>&quot;User&quot;</strong>: Any person or entity accessing the Platform</li>
            <li><strong>&quot;Buyer&quot;</strong>: User seeking to purchase machines, parts, or services</li>
            <li><strong>&quot;Seller&quot;</strong>: User listing machines, parts, sundries, or engineering services</li>
            <li><strong>&quot;Content&quot;</strong>: Listings, descriptions, images, videos, and other materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Account Registration</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 18 years old to create an account</li>
            <li>Provide accurate and complete business information</li>
            <li>Maintain the security of your login credentials</li>
            <li>Notify us immediately of any unauthorized account use</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Platform Services</h2>
          <p className="mb-3">Cleaners Compare operates as a comparison and marketplace platform for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>New and used laundry/dry cleaning machines</li>
            <li>Parts and components</li>
            <li>Sundries and supplies</li>
            <li>Engineering and maintenance services</li>
            <li>Educational content and industry information</li>
          </ul>
          <p className="mt-3 text-sm bg-yellow-50 p-3 rounded">
            <strong>Note:</strong> We are a platform connecting buyers and sellers. We are not party to transactions 
            and do not guarantee the quality, safety, or legality of listed items.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Seller Terms</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Listing Requirements:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate and complete product descriptions</li>
                <li>Use clear, recent photos of actual items</li>
                <li>Disclose any defects or issues with used equipment</li>
                <li>Maintain reasonable response times to buyer inquiries</li>
                <li>Honor listed prices and availability</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Prohibited Listings:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Counterfeit or stolen equipment</li>
                <li>Items that violate intellectual property rights</li>
                <li>Hazardous materials or recalled equipment</li>
                <li>Misrepresented or fraudulent listings</li>
                <li>Items not related to laundry/dry cleaning industry</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Buyer Terms</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Conduct due diligence before purchasing equipment</li>
            <li>Verify seller credentials and item condition</li>
            <li>Use secure payment methods for transactions</li>
            <li>Inspect items upon delivery and report issues promptly</li>
            <li>Understand that prices and availability are set by sellers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Transactions and Payments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All transactions are between buyers and sellers directly</li>
            <li>We may facilitate payment processing through third-party providers</li>
            <li>Sellers are responsible for pricing, taxes, and shipping costs</li>
            <li>Buyers are responsible for import duties and customs fees where applicable</li>
            <li>Disputes should be resolved directly between parties initially</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Intellectual Property</h2>
          <div className="space-y-3">
            <p><strong>Platform Content:</strong> All website content, logos, and design elements are owned by Cleaners Compare and protected by copyright.</p>
            <p><strong>User Content:</strong> By listing items, you grant us license to display your content on our platform.</p>
            <p><strong>Educational Videos:</strong> Content in our educational section is for personal use and may not be redistributed without permission.</p>
            <p><strong>Brand Logos:</strong> Trusted brand logos are used with permission or under fair use principles.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. User Conduct</h2>
          <p>Prohibited activities include:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Misrepresenting your identity or business</li>
            <li>Circumventing platform fees or communication systems</li>
            <li>Harassing other users or platform staff</li>
            <li>Posting false or misleading reviews</li>
            <li>Using automated systems to scrape data or listings</li>
            <li>Interfering with platform security or performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Limited-Time Deals and Featured Products</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Deal prices and availability are subject to change</li>
            <li>Quantities may be limited for special offers</li>
            <li>We reserve the right to modify or cancel deals at any time</li>
            <li>Featured product placement may be promotional or paid</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Disclaimer of Warranties</h2>
          <p className="mb-3">The platform is provided &quot;as is&quot; without warranties of any kind:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not guarantee uninterrupted or error-free service</li>
            <li>We do not warrant the accuracy of listings or user content</li>
            <li>We are not responsible for the quality or safety of listed items</li>
            <li>We do not endorse any specific sellers or products</li>
            <li>Users assume all risk in transactions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">12. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Cleaners Compare shall not be liable for any 
            indirect, incidental, special, or consequential damages arising from:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Transactions between users</li>
            <li>Use or inability to use the platform</li>
            <li>Unauthorized access to user information</li>
            <li>Errors or omissions in listings or content</li>
            <li>Equipment failure or business losses</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">13. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Cleaners Compare, its directors, employees, 
            and affiliates from any claims, damages, or expenses arising from:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Your use of the platform</li>
            <li>Your violation of these terms</li>
            <li>Your listings or transactions</li>
            <li>Any content you post or transmit</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">14. Termination</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We may suspend or terminate your account for violations of these terms</li>
            <li>You may terminate your account at any time</li>
            <li>Termination does not affect rights or obligations that accrued prior</li>
            <li>Listings may remain visible for a reasonable period after termination</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">15. Governing Law and Dispute Resolution</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>These terms are governed by the laws of [Your Jurisdiction]</li>
            <li>Disputes should first be addressed through our customer service</li>
            <li>Mediation or arbitration may be required before litigation</li>
            <li>Legal actions must be filed within one year of the claim arising</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">16. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the platform 
            after changes constitutes acceptance of the modified terms. We will notify users of 
            significant changes via email or platform notifications.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">17. Contact Information</h2>
          <div className="p-4 bg-gray-50 rounded">
            <p>For questions about these Terms and Conditions:</p>
            <p className="mt-2">
              Email: legal@cleanerscompare.com<br />
              Website: <Link href="/contact" className="text-blue-600 hover:underline">Contact Form</Link><br />
              Address: [Your Company Address]
            </p>
          </div>
        </section>

        <div className="border-t pt-6 mt-6">
          <p className="text-sm text-gray-600">
            These Terms and Conditions were last updated on {new Date().toLocaleDateString()} and 
            replace all previous versions.
          </p>
        </div>
      </div>
    </div>
  );
}