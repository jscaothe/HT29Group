import { UsersAttributes } from "../shared/UsersAttributes.service"
import { Binary } from "aws-sdk/clients/sns";

export class Users{
    public UserId : string;
    public Email: string;
    public Firstname: string;
    public Lastname: string;
    public Company: string;
    public ImageUrl: string;
    public GroupName: string;
    public UserStatus : string;
    public ImageData : any = "-";
    public Enable: boolean;
    //public UserAttribute : UsersAttributes;
    //public UsersAttributes : UsersAttributes[] = [];

    constructor() {        
    }
}