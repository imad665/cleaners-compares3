
 
import { motion } from 'framer-motion'
 
export default async function PlatformOverview() {
   
    return (
        <section className="py-16 bg-white">
            
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our platform simplifies the process for both buyers and sellers
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            step: '01',
                            title: 'Search & Compare',
                            desc: 'Browse thousands of listings and compare prices, features, and seller ratings.',
                            color: 'from-blue-500 to-blue-600'
                        },
                        {
                            step: '02',
                            title: 'Connect & Communicate',
                            desc: 'Direct messaging with sellers and buyers to discuss details and negotiate.',
                            color: 'from-purple-500 to-purple-600'
                        },
                        {
                            step: '03',
                            title: 'Transact & Review',
                            desc: 'Secure transactions and leave reviews to help the community grow.',
                            color: 'from-green-500 to-green-600'
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 shadow-lg border border-gray-100">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${item.color} text-white text-2xl font-bold mb-6`}>
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}