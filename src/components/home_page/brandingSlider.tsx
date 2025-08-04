'use client'

import { useHomeContext } from '@/providers/homePageProvider'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from 'react-slick'
import { Button } from '../ui/button'
 
const settingsSlider = {
  infinite: true,
  speed: 8000, // slow and smooth
  autoplay: true,
  autoplaySpeed: 500,
  cssEase: 'linear', // linear movement
  slidesToScroll: 1,
  arrows: false,
  variableWidth: true,
  pauseOnHover: false,
  swipe: false,
  draggable: false,
  touchMove: false,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        variableWidth: true,
      },
    },
  ],
}

const brandingImages: string[] = [
  '/avery.png',
  '/stamford.png',
  '/sdsave.png',
  '/barbanti.png',
  '/abac.png',
  '/bowe.png',
  '/seitz.png',
  '/coleandwilson.png',
  '/artmecc.png',
  '/rampi.png',
  '/eastpac.png',
  '/allpartsdrycleaning.png',
  '/linenconnect.png',
  '/richardhowarth.png',
  '/axcessit.png',
  '/unitsteam.png',
  '/hilden.png',
  '/cfbboilers.png',
  '/firbimatic.png',
  '/ags.png',
  '/unisec.png',
  '/sankosha.png',
  '/swiftchoice.png',
  '/goalwinners.png',
];

function Item({i,src}:{i:number,src:string}) {
  return (
    <div key={i} className="px-2 group" style={{ width: '180px' }}>
      <div className="bg-white rounded-xl p-5 h-36 flex items-center justify-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 transform hover:-translate-y-1">
        <Image
          width={200}
          height={200}
          src={`/brands${src}`}
          alt={`Brand ${i + 1}`}
          className="max-h-16 w-auto object-contain object-center filter grayscale group-hover:grayscale-0 transition-all duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>
    </div>
  )
}

export function BrandingSlider() {
  // 👇 Repeat images multiple times to avoid empty gap
  const duplicatedImages = [
    ...brandingImages,
    ...brandingImages,

  ]
  const [isClient, setIsClient] = useState(false);
  const {clearCart} = useHomeContext();
  useEffect(() => {
    setIsClient(true)
    const isVisitCart = localStorage.getItem('isVisitCart');
    if(isVisitCart){
      clearCart();
      localStorage.removeItem('isVisitCart')
    }
  }, []);

  /* const sendTestMessage = async ()=>{
    await fetch('/api/testMessage',{
      method:'POST',
      headers:{
        'Content-Type':"application/json"
      },
      body:JSON.stringify({message:'hello'})
    })
  } */

  return (
    <section className="w-full px-4 md:px-8 py-10 bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          {/* <Button onClick={()=>sendTestMessage()}>Send Test Message</Button> */}
          <h2 className="text-2xl font-bold text-left">Our Trusted Brands</h2>
        </div>
        {isClient ? <Slider {...settingsSlider}>
          {duplicatedImages.map((src, i) => (
           <Item i={i} src={src}/>
          ))}
        </Slider> :
          <div className="flex gap-4 overflow-x-auto">
            {duplicatedImages.map((src, i) => (
              <div className="min-w-[250px]" key={i}>
                 <Item i={i} src={src}/>
              </div>
            ))}
          </div>
        }
      </div>
    </section>
  )
}
