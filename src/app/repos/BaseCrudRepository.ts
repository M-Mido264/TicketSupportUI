import { SystemServiceService } from '../services/system-service.service'
import { Observable } from 'rxjs/internal/Observable'

export interface IBaseCrudRepository<TAggregate> {
  getAll(): Observable<TAggregate[]>

  get(id: number): Observable<TAggregate>

  create(value: TAggregate): Observable<TAggregate>

  update(value: TAggregate): Observable<TAggregate>

  delete(id: number): Observable<TAggregate>
}

export abstract class BaseCrudRepository<TAggregate>
  implements IBaseCrudRepository<TAggregate> {
  protected controllerUrl: string

  constructor(
    controllerName: string,
    protected systemService: SystemServiceService
  ) {
    this.controllerUrl = controllerName
  }

  public getAll(): Observable<TAggregate[]> {
    return this.systemService.getAll(this.controllerUrl)
  }

    public getAllById(methodName,id): Observable<TAggregate[]> {
    return this.systemService.get(this.controllerUrl+"/"+methodName , id); 
  }

  get(id: number): Observable<TAggregate> {
    return this.systemService.get(this.controllerUrl, id)
  }
  create(value: TAggregate,PopUp =true): Observable<TAggregate> {
    return this.systemService.post(this.controllerUrl, value , PopUp)
  }
  
 /**
   * Update
   * @param value
   */
  update(value: TAggregate): Observable<TAggregate> {
    return this.systemService.update(this.controllerUrl, value)
  }

  updateAll(value: any): Observable<any> {
    return this.systemService.update(this.controllerUrl, value)
  }

  /**
   * Remove using ID
   * @param value
   */
  delete(id: number): Observable<TAggregate> {
    return this.systemService.delete(this.controllerUrl, id)
  }
}
