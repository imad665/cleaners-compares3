import { AddNewProductForm } from "@/components/forms/addNewProductForm";
import { getCategories } from "@/lib/functions";
import { prisma } from "@/lib/prisma";
export const revalidate = 18000; // ISR every 5 hours
export default async function Page() {
    const categories = await getCategories();
    return (
        <div className="h-[100vh] overflow-y-auto lg:mr-20 "> 
            <AddNewProductForm isEditing={false} categories={categories} />
            <div className="w-[100vw] h-30"></div>
        </div>
    )
}


 


