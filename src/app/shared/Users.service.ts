import { UsersAttributes } from "../shared/UsersAttributes.service"

export class Users{
    public UserId : string;
    public UserStatus : string;
    public Enable: boolean;
    public UserAttribute : UsersAttributes;
    public UsersAttributes : UsersAttributes[] = [];

    constructor() {

    }
}