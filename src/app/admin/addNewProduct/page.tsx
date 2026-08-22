import { AddNewItemForm } from "@/components/forms/addNewItemForm";
import { AddNewProductForm } from "@/components/forms/addNewProductForm";
import { getCategories } from "@/lib/functions";
import { prisma } from "@/lib/prisma";
export const revalidate = 18000; // ISR every 5 hours
export default async function Page() {
    const categories = await getCategories();
    return (
        <div className="lg:mr-20">
            {/* <AddNewProductForm isEditing={false} categories={categories} /> */}
            <AddNewItemForm isEditing={false} categories={categories} />
            <div className="w-full h-32"></div>
        </div>
    )
}





