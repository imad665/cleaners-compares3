// app/page/privacy-policy/page.tsx (for App Router)
// or pages/page/privacy-policy.tsx (for Pages Router)

import React from 'react';

const PrivacyPolicyPage = () => {
  // You can replace this with actual logic to get the last updated date dynamically if needed
  const lastUpdatedDate = "13/03/26";

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Privacy, Cookies & Acceptable Use Policy
          </h1>
          <p className="text-xl text-gray-600 mb-1">CleanersCompare.com</p>
          <p className="text-sm text-gray-500 mb-6">Last Updated: [{lastUpdatedDate}]</p>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
            <p>
              This Privacy, Cookies & Acceptable Use Policy explains how Cleaners Compare (“Cleaners Compare”, “we”, “our”, or “us”) collects, uses, and protects personal information when you use the CleanersCompare.com website and platform (the “Platform”).
              It also outlines the acceptable rules governing the use of the Platform.
              We are committed to protecting personal data in accordance with applicable laws including the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations (PECR).
              By accessing or using the Platform you agree to the practices described in this policy.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. About Cleaners Compare</h2>
              <p>
                Cleaners Compare operates an online marketplace connecting buyers and suppliers within the laundry, dry cleaning, and textile care industries.
                For the purposes of data protection laws, Cleaners Compare acts as the data controller for personal information collected through the Platform.
              </p>
              <p className="mt-2">
                <strong>Contact:</strong><br />
                Email: info@cleanerscompare.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Information We Collect</h2>
              <p>We may collect and process the following types of personal information.</p>
              <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">Information You Provide</h3>
              <p>When you create an account or interact with the Platform you may provide:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>name</li>
                <li>company name</li>
                <li>email address</li>
                <li>phone number</li>
                <li>business address</li>
                <li>account login credentials</li>
                <li>supplier profile information</li>
                <li>messages sent through the Platform.</li>
              </ul>
              <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">Transaction Information</h3>
              <p>Where transactions occur through the Platform we may collect:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>purchase records</li>
                <li>subscription payments</li>
                <li>commission records</li>
                <li>order information.</li>
              </ul>
              <p>Payment card details are processed securely by third-party payment providers and are not stored directly by Cleaners Compare.</p>
              <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">Technical Information</h3>
              <p>We may automatically collect technical data including:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>IP address</li>
                <li>browser type and version</li>
                <li>device information</li>
                <li>operating system</li>
                <li>pages visited</li>
                <li>session duration</li>
                <li>referring websites.</li>
              </ul>
              <p>This helps us improve the Platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use personal information to:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>provide access to the Platform</li>
                <li>manage user accounts</li>
                <li>enable communication between buyers and suppliers</li>
                <li>process subscriptions and transactions</li>
                <li>administer commissions and platform fees</li>
                <li>improve platform functionality</li>
                <li>detect fraud and maintain security</li>
                <li>comply with legal obligations</li>
                <li>communicate service updates and platform notices.</li>
              </ul>
              <p className="mt-2">Where permitted by law, we may also send relevant platform updates.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Legal Basis for Processing</h2>
              <p>Under UK GDPR we process personal data based on:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Contractual necessity</strong> - Processing required to provide platform services.</li>
                <li><strong>Legitimate interests</strong> - Operating, improving, and securing the Platform.</li>
                <li><strong>Legal obligations</strong> - Compliance with regulatory requirements.</li>
                <li><strong>Consent</strong> - Where required for cookies or specific communications.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Sharing of Information</h2>
              <p>We may share information with:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Other Platform Users</strong> - Information may be shared between buyers and suppliers to enable communication and transactions.</li>
                <li><strong>Payment Providers</strong> - Payment processors may receive information necessary to process transactions securely.</li>
                <li><strong>Service Providers</strong> - We may use trusted third-party providers for hosting services, analytics, communications, and platform infrastructure. These providers process data only for authorised purposes.</li>
                <li><strong>Legal Authorities</strong> - Information may be disclosed where required by law or regulatory authorities.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. International Data Transfers</h2>
              <p>Because the Platform may be accessed globally, personal information may be transferred outside the United Kingdom. Where such transfers occur, we ensure appropriate safeguards are implemented to protect personal data.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Data Retention</h2>
              <p>Personal data is retained only for as long as necessary to:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>provide services</li>
                <li>comply with legal obligations</li>
                <li>resolve disputes</li>
                <li>enforce platform agreements.</li>
              </ul>
              <p>Data that is no longer required will be securely deleted or anonymised.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Data Security</h2>
              <p>We implement appropriate technical and organisational measures to protect personal data against unauthorised access, misuse, loss, alteration, or disclosure. However, no internet transmission is completely secure and users provide information at their own risk.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Your Data Protection Rights</h2>
              <p>Under data protection laws you may have the right to:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>access your personal data</li>
                <li>correct inaccurate information</li>
                <li>request deletion of personal data</li>
                <li>restrict processing</li>
                <li>object to certain processing</li>
                <li>request data portability.</li>
              </ul>
              <p className="mt-2">Requests can be made via: info@cleanerscompare.com</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Cookies and Tracking Technologies</h2>
              <p>The Platform uses cookies and similar technologies to improve functionality and analyse how users interact with the website. Cookies are small text files stored on your device when you visit a website.</p>
              <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">Types of Cookies Used</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Essential Cookies</strong> - Required for platform operation including account login, authentication, session management, and security protection. These cookies cannot be disabled.</li>
                <li><strong>Analytics Cookies</strong> - Used to analyse website usage and improve services. Examples may include tools such as Google Analytics.</li>
                <li><strong>Functional Cookies</strong> - Allow the website to remember user preferences and settings.</li>
                <li><strong>Marketing Cookies</strong> - May be used to measure advertising effectiveness and deliver relevant advertising through services such as Meta (Facebook / Instagram), Google Ads, and LinkedIn Ads. Marketing cookies are used only where user consent is provided.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Managing Cookies</h2>
              <p>Users can control cookies through browser settings. Most browsers allow you to block cookies, delete cookies, or receive notifications before cookies are stored. Disabling cookies may affect certain features of the Platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">12. Third-Party Websites</h2>
              <p>The Platform may contain links to third-party websites. Cleaners Compare is not responsible for the privacy practices of external websites. Users should review the privacy policies of those websites separately.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">13. Children's Privacy</h2>
              <p>The Platform is designed for business use and is not intended for individuals under the age of 16. We do not knowingly collect personal data from children.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">14. Acceptable Use of the Platform</h2>
              <p>Users agree not to misuse the Platform. The following activities are strictly prohibited:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>posting false or misleading listings</li>
                <li>advertising illegal products or services</li>
                <li>uploading malicious software or harmful code</li>
                <li>attempting to gain unauthorised access to the Platform</li>
                <li>scraping or extracting platform data without permission</li>
                <li>using the Platform for spam or unsolicited communications</li>
                <li>impersonating other individuals or businesses</li>
                <li>infringing intellectual property rights.</li>
              </ul>
              <p className="mt-2">Cleaners Compare reserves the right to remove content or suspend accounts that violate these rules.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">15. Platform Abuse and Fraud</h2>
              <p>Where misuse, fraud, or suspicious activity is detected, Cleaners Compare may suspend or terminate accounts, remove listings, restrict platform access, or report activities to relevant authorities.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">16. Changes to This Policy</h2>
              <p>We may update this policy from time to time. Changes will be published on this page and the updated date will be indicated at the top of the policy. Continued use of the Platform constitutes acceptance of the updated policy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">17. Contact Information</h2>
              <p>If you have any questions about this Privacy, Cookies & Acceptable Use Policy please contact:</p>
              <p>
                CleanersCompare.com<br />
                Email: info@cleanerscompare.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;