'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header/header';
import Footer from '@/components/home_page/footer';
import { ContactUs } from '@/components/home_page/contact';
import { FeaturedAndProducts } from '@/components/home_page/featured_product';

export default function ContactPage() {
    return (
        <div>
            <Header />
            <div className='max-w-4xl m-auto my-8 p-3'>
            <h1 className='text-3xl font-bold my-8 text-center w-fit'>Contact Us</h1>
                <ContactUs />
            </div>
            <FeaturedAndProducts/>
            <Footer />
        </div>
    )
}
