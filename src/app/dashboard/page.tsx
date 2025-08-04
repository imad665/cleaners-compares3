import { AddNewProductForm } from "@/components/forms/addNewProductForm";
import { BusinessListingForm } from "@/components/forms/busnisessForm";
import { getCategories } from "@/lib/functions";


export default async function Dashboard(){
    const categories = await getCategories();
    return (
        <div>
            {/* <AddNewProductForm categories={categories}/>*/}
            <BusinessListingForm/>
        </div>
    )
}