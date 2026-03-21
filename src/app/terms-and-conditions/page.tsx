// app/page/terms-and-conditions/page.tsx (for App Router)
// or pages/page/terms-and-conditions.tsx (for Pages Router)

import React from 'react';

const TermsAndConditionsPage = () => {
  // You can replace this with actual logic to get the last updated date dynamically if needed
  const lastUpdatedDate = "13/03/26";

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600 mb-1">CleanersCompare.com</p>
          <p className="text-sm text-gray-500 mb-6">Last Updated: [{lastUpdatedDate}]</p>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
            <p>
              These Terms and Conditions (“Terms”) govern your use of the CleanersCompare.com website and platform (the “Platform”) operated by Cleaners Compare (“Cleaners Compare”, “we”, “our”, or “us”).
              By accessing or using the Platform you agree to be legally bound by these Terms together with our Privacy Policy and any other policies referenced on the Platform.
              If you do not agree to these Terms you must not use the Platform.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. About the Platform</h2>
              <p>
                Cleaners Compare operates an online marketplace connecting buyers and suppliers within the laundry, dry cleaning, and textile care industries.
                The Platform allows users to:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>search and compare products and services</li>
                <li>communicate with suppliers</li>
                <li>list equipment and services</li>
                <li>purchase products or services where such functionality is available.</li>
              </ul>
              <p className="mt-2">
                Cleaners Compare acts solely as an intermediary technology platform facilitating connections between buyers and suppliers.
                Cleaners Compare is not the manufacturer, seller, distributor, or service provider of any products or services listed on the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. User Accounts</h2>
              <p>
                To access certain features of the Platform, users may be required to create an account.
                By creating an account you agree that:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>the information you provide is accurate and complete</li>
                <li>you will maintain the confidentiality of your login credentials</li>
                <li>you are responsible for activities conducted through your account.</li>
              </ul>
              <p className="mt-2">
                Cleaners Compare reserves the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Buyers Using the Platform</h2>
              <p>
                Buyers may use the Platform to:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>search for equipment or services</li>
                <li>contact suppliers</li>
                <li>purchase products where available.</li>
              </ul>
              <p className="mt-2">
                Buyers are responsible for conducting their own due diligence before purchasing any product or service.
                Cleaners Compare does not guarantee:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>supplier reliability</li>
                <li>product quality</li>
                <li>delivery performance</li>
                <li>service outcomes.</li>
              </ul>
              <p>All purchases are made at the buyer’s own risk.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Supplier / Seller Agreement</h2>
              <p>Suppliers who list products or services on the Platform agree to the following obligations.</p>
              
              <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">Supplier Responsibilities</h3>
              <p>Suppliers must:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>provide accurate and truthful listings</li>
                <li>ensure they have the legal right to sell or promote listed products or services</li>
                <li>comply with all applicable laws and regulations</li>
                <li>honour warranties and commitments made to buyers</li>
                <li>respond to customer enquiries in a professional manner.</li>
              </ul>
              <p>Suppliers remain fully responsible for the products or services they offer.</p>

              <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">Used Equipment Disclosure</h3>
              <p>Where suppliers list used or refurbished equipment, they must clearly disclose:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>equipment condition</li>
                <li>approximate age</li>
                <li>usage history where known</li>
                <li>any known defects or limitations.</li>
              </ul>
              <p>Failure to accurately disclose equipment condition may result in removal of listings or suspension of supplier accounts.</p>

              <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">Supplier Conduct</h3>
              <p>Suppliers must not:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>publish misleading or fraudulent listings</li>
                <li>misrepresent product specifications or capabilities</li>
                <li>advertise illegal or restricted items</li>
                <li>infringe intellectual property rights</li>
                <li>engage in deceptive sales practices.</li>
              </ul>
              <p>Cleaners Compare reserves the right to remove listings that violate these rules.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Listings and Content</h2>
              <p>
                Suppliers are solely responsible for the accuracy of the content they publish on the Platform including:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>product descriptions</li>
                <li>specifications</li>
                <li>pricing</li>
                <li>images and marketing materials.</li>
              </ul>
              <p className="mt-2">
                By posting listings on the Platform, suppliers grant Cleaners Compare a non-exclusive, worldwide, royalty-free licence to display, promote, and distribute their listings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Commission and Platform Fees</h2>
              <p>
                Where products or services are sold through the Platform, Cleaners Compare may charge a commission on transactions.
                The commission rate may vary depending on supplier agreements or product categories.
                Typical commission rates range between:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>1% and 10% of the total transaction value.</li>
              </ul>
              <p className="mt-2">
                Cleaners Compare reserves the right to modify commission structures from time to time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Payment Processing Fees</h2>
              <p>
                Where payments are processed through the Platform using credit cards, debit cards, or other electronic payment methods, payment processing charges may apply.
                These charges are imposed by financial institutions or payment processors and typically range between:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>1% and 3.5% of the transaction value.</li>
              </ul>
              <p className="mt-2">
                Such fees may be charged to buyers or suppliers depending on the payment structure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Subscription Services</h2>
              <p>
                Certain platform services may require a paid subscription.
                Subscription pricing and features are displayed on the Platform.
                Subscription fees:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>are payable in advance</li>
                <li>may renew automatically depending on the subscription plan</li>
                <li>are generally non-refundable unless otherwise stated.</li>
              </ul>
              <p className="mt-2">
                Users may cancel subscriptions through the payment provider used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Platform Role</h2>
              <p>
                Cleaners Compare acts solely as a platform connecting buyers and suppliers.
                Cleaners Compare does not:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>manufacture products</li>
                <li>guarantee supplier performance</li>
                <li>guarantee product quality</li>
                <li>provide warranties on products sold by suppliers.</li>
              </ul>
              <p>All transactions are conducted directly between buyers and suppliers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Disputes Between Buyers and Suppliers</h2>
              <p>
                Cleaners Compare is not responsible for disputes between users.
                In the event of a dispute relating to:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>delivery</li>
                <li>product condition</li>
                <li>payment</li>
                <li>warranties</li>
                <li>services</li>
              </ul>
              <p>the buyer and supplier must resolve the matter directly.</p>
              <p className="mt-2">Cleaners Compare does not mediate disputes between users.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, Cleaners Compare shall not be liable for:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>loss of profits</li>
                <li>loss of revenue</li>
                <li>loss of business opportunities</li>
                <li>loss of data</li>
                <li>indirect or consequential damages.</li>
              </ul>
              <p className="mt-2">
                Cleaners Compare's total liability shall not exceed the total amount of fees paid by the user to Cleaners Compare during the previous 12 months.
                Nothing in these Terms excludes liability for:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>death or personal injury caused by negligence</li>
                <li>fraud or fraudulent misrepresentation</li>
                <li>liability that cannot be excluded under UK law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">12. Indemnification</h2>
              <p>
                Users agree to indemnify and hold harmless Cleaners Compare and its affiliates from any claims, damages, losses, or legal expenses arising from:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>their use of the Platform</li>
                <li>transactions conducted through the Platform</li>
                <li>violation of these Terms</li>
                <li>violation of applicable laws.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">13. Platform Abuse</h2>
              <p>Users must not misuse the Platform. Prohibited activities include:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>posting false or misleading listings</li>
                <li>uploading malicious software</li>
                <li>scraping or extracting data without permission</li>
                <li>sending spam or unsolicited communications</li>
                <li>attempting to gain unauthorised access to the Platform.</li>
              </ul>
              <p className="mt-2">Cleaners Compare may suspend or terminate accounts engaging in such activities.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">14. Platform Availability</h2>
              <p>
                Cleaners Compare aims to maintain uninterrupted access to the Platform but does not guarantee continuous availability.
                Access may be interrupted due to:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>maintenance</li>
                <li>system upgrades</li>
                <li>technical issues</li>
                <li>external service disruptions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">15. Force Majeure</h2>
              <p>
                Cleaners Compare shall not be liable for delays or failures caused by events beyond its reasonable control including:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>natural disasters</li>
                <li>cyber attacks</li>
                <li>internet outages</li>
                <li>government actions</li>
                <li>strikes or industrial disputes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">16. Changes to These Terms</h2>
              <p>
                Cleaners Compare reserves the right to update these Terms at any time.
                Updated Terms will be published on the Platform.
                Continued use of the Platform constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">17. Governing Law</h2>
              <p>
                These Terms are governed by the laws of England and Wales.
                Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">18. Contact Information</h2>
              <p>For questions regarding these Terms please contact:</p>
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

export default TermsAndConditionsPage;