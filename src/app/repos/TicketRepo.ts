import { Inject, Injectable } from "@angular/core";
import { Ticket } from "../models/Ticket";
import { SystemServiceService } from "../services/system-service.service";
import { BaseCrudRepository } from "./BaseCrudRepository";

@Injectable()
export class TicketRepo extends BaseCrudRepository<any>{
    protected controllerUrl: string;
    constructor(
      @Inject(SystemServiceService) systemService: SystemServiceService
    ) {
      super("Ticket", systemService);
    }
}