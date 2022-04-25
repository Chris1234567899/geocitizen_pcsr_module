import { UserRel } from "app/gc_basic/models/userRel";


export class BusinessMembership {
    id: string;
    user_id: string;
    business_id:string;
    status: "accepted"| "requested"| "invited"| "blocked"
    business_role:BusinessRole
    user_rel:UserRel
}


export enum BusinessRole {
    Member = "member",
    Admin = "admin"
  }
  