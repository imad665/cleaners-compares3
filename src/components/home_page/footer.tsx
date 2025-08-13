 
import { ArrowUp } from "lucide-react"
import Link from "next/link"
import { Logo } from "../header/header"
import { ContactDialog } from "./contact"

const data = [
    {
        title: 'Shop By Category',
        data: [
            { name: 'New Machines', href: "/products/machines" },
            { name: 'Used Machines', href: '/products/machines' },
            { name: 'Parts & Components', href: '/products/parts' },
            { name: 'Sundries & Supplies', href: '/products/sundries' },
            { name: 'Engineers', href: '/engineers' },
            { name: "Today's Deals", href: '/products?type=deals' },
        ]
    },
    {
        title: 'Legal',
        data: [
            { name: "Privacy Policy", href: "/notfound" },
            { name: "Terms and Conditions", href: "/notfound" },
            { name: "Contact Us", href: "/contact" },
            /* { name: "Report a problem", href: "/notfound" }, */
        ]
    },
    {
        title: 'Connect With Us',
        data: [
            { name: "youtube", href: "https://www.youtube.com/@amirshahz77" },
            { name: "facebook", href: "/notfound" },
            { name: "twitter", href: "/notfound" },
            { name: "linkedin", href: "/notfound" }, 
        ]
    }
]
type ItemDataType = {
    title: string
    data: {name:string,href:string}[]
}

function Item({ title, data }: ItemDataType) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ul className="space-y-2">
                {data.map((d, key) => (
                    <li key={`key_${key}`}>
                        {d.name === 'Contact Us' ? <ContactDialog /> : 
                        <Link href={d.href} target="_blank" className="text-gray-300 hover:text-white text-sm">{d.name}</Link>
                        }
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default function Footer({
    footerData
}:
{
    footerData:any
}) {
    /* const {footerData} = useHomeProductContext(); */
    //console.log(footerData,'uuuuuuuuuuuuuuuuuuu');
    const privacyPolicy = footerData.find((f)=>f.key==='privacyPolicy')?.href || '/notfound';
    const termAndCondition = footerData.find(f=>f.key==='termAndCondition')?.href || '/notfound';
    const youtube = footerData.find(f=>f.key==='youtube')?.href || '/notfound';
    const facebook = footerData.find(f=>f.key==='facebook')?.href || '/notfound';
    const twitter = footerData.find(f=>f.key ==='twitter')?.href || '/notfound';
    const linkedin = footerData.find(f=>f.key==='linkedin')?.href || '/notfound';

    data[1].data[0].href = privacyPolicy;
    data[1].data[1].href = termAndCondition;

    data[2].data[0].href = youtube;
    data[2].data[1].href = facebook;
    data[2].data[2].href = twitter;
    data[2].data[3].href = linkedin;

    //console.log(data);
    
    return (
        <footer className="bg-gray-800 text-white">
            <a href="#searchBar" className="bg-gray-700 hover:bg-gray-600 block transition-colors cursor-pointer">

                <div className="container mx-auto p-3 text-center flex items-center justify-center">
                    <ArrowUp className="h-4 w-4 mr-2" size={24} />
                    <span className="text-sm">Back to top</span>
                </div>

            </a>


            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-3">
                    <div className="grow ">
                        <Logo width={140}/>
                    </div>

                    <div className="grid grow grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                        <Item data={data[0].data} title={data[0].title} />
                        <Item data={data[1].data} title={data[1].title} />
                        <Item data={data[2].data} title={data[2].title} />
                    </div>
                </div>

            </div>
        </footer>

    )
}