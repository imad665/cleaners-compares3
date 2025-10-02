
export default function getDelveryChargeFromWight(weight:number){
    
    if(weight <= 20) return 9.95 // in £ 
    if(weight <= 35) return 19.95 
    if(weight <= 45) return 28.0 
    if(weight <= 55) return 55.0 
    if(weight <= 75) return 65.0 
    return 65.0
 

}
