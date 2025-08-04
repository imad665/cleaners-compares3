'use client'

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";




export default function EngineerLink({cat}:{cat:any}) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (category: string) => {
        setSelected(category);
        console.log("Selected category:", category);
    };
    return (
        <Link href={`/engineers/${cat.slug}`}>
            <Card
                key={cat.name}
                onClick={() => handleSelect(cat.name)}
                className={`cursor-pointer transition-all hover:shadow-xl ${selected === cat.name ? "border-blue-500 ring-2 ring-blue-300" : ""
                    }`}
            >
                <CardContent className="p-0">
                    <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        width={200}
                        height={200}
                        className="h-40 w-full object-cover rounded-t-lg"
                    />
                    <div className="p-4 text-center">
                        <h3 className="text-lg font-semibold">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}