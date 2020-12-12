import { Inject, Injectable } from "@angular/core";
import { AuditLogs } from "../models/LogsAudit";
import { SystemServiceService } from "../services/system-service.service";
import { BaseCrudRepository } from "./BaseCrudRepository";

@Injectable()
export class AuditRepository extends BaseCrudRepository<AuditLogs>{
    protected controllerUrl: string;
    constructor(
      @Inject(SystemServiceService) systemService: SystemServiceService
    ) {
      super("AuditLogs", systemService);
    }
}