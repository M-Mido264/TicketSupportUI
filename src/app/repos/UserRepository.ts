import { Inject, Injectable } from "@angular/core";
import { User } from "../models/User";
import { SystemServiceService } from "../services/system-service.service";
import { BaseCrudRepository } from "./BaseCrudRepository";

@Injectable()
export class UserRepository extends BaseCrudRepository<User>{
    protected controllerUrl: string;
    constructor(
      @Inject(SystemServiceService) systemService: SystemServiceService
    ) {
      super("User", systemService);
    }
}