import { User } from "./User";

export class Ticket{
     Id :number
     Name : string;
     CreatedAt: Date;
     LastStatusChanges: Date; 
     Content : string;
     Status: Status = Status.New;
     UserId: number;
     User:User = new User();
}

export enum Status{
    New = 1,
    Active,
    Resolved,
    Closed
}