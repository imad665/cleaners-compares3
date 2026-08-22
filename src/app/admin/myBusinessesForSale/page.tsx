import MyBusinesses from "@/components/adminDashboard/mybusinesess";
import { BusinessListingForm } from "@/components/forms/busnisessForm";

export default function MyBusinessFormPage(){
    
    return (
        <div>
            {/* <BusinessListingForm/> */}
            <MyBusinesses/>
            <div className='w-full h-32'> </div>
        </div>
    )
}