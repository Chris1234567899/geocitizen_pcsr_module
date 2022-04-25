
import { BusinessMembership } from './businessMembership';
export class Business {
    id: string;


    name: string
    description: string
    user_id: string;
   

    email: string;
    phone: string;
    webpage: string;
    address: string;

    cover_image_url:string;
    logo_image_url:string;
    is_verified:boolean;
    verification_status:string;
    
    location: string;
    geometry: any

    created_at: string;
    updated_at: string;

    business_memberships:BusinessMembership[]



    //from pivot
    status: "accepted"| "requested"| "invited"| "blocked"
    
    constructor(
        $id: string,
        $name: string,
        $description: string,

        $email: string,
        $phone: string,
        $webpage: string,
        $address: string,
    
        $cover_image_url:string,
        $logo_image_url:string,
       
  
        $location: string,
        $geometry: any

    ) {
        this.id = $id;
        this.name = $name;
        this.description = $description;
        this.email = $email;
        this.phone = $phone;
        this.webpage = $webpage;
        this.address = $address;
        this.cover_image_url = $cover_image_url;
        this.logo_image_url = $logo_image_url;
        this.location = $location;
        this.geometry = $geometry;
     

    }

}


