import { Injectable } from '@angular/core'

export enum LocalStorageDataType {
  AuthToken = 'AuthToken',
  UserInfo = 'UserInfo',
}

@Injectable()
export class LocalStorageService {
  private tempStorage: TempStorage

  constructor() {
    this.tempStorage = new TempStorage('TempStorage')
  }

  /**
   * AddToLocalStorage used to store data into local browser storage
   */
  public AddToLocalStorage(
    Value: any,
    localStorageDataType: LocalStorageDataType,
  ) {
     
    if (!Value) {
      throw new Error("Can't store empty value in localstorage ")
    }

    switch (localStorageDataType) {
      case LocalStorageDataType.AuthToken:
        this.StoreAuthToken(Value)
        break

      case LocalStorageDataType.UserInfo:
        this.StoreUserInfo(Value)
        break
    }
  }

  /**
   * LoadFromLocalStorage used to get piece of data from localstorage
   */
  public LoadFromLocalStorage(
    localStorageDataType: LocalStorageDataType ): any {
    
    switch (localStorageDataType) {
      case LocalStorageDataType.AuthToken:
        return this.LoadAuthToken()

      case LocalStorageDataType.UserInfo:
        return this.LoadUserInfo()
    }
  }

  /**
   * Clear Item From Localstorage based on type
   */
  public DeleteItem(
    localStorageDataType: LocalStorageDataType
  ) {
    switch (localStorageDataType) {
      case LocalStorageDataType.AuthToken:
        this.DeleteAuthTokenContainer()
        break
      case LocalStorageDataType.UserInfo:
        this.DeleteUserInfo()
        break
    }
  }

  public ClearStorage(
    FullClear: boolean = false,
  ) {
    if (FullClear) {
      localStorage.clear()
      this.tempStorage.clear()
      return
    }
    this.tempStorage.clear()
  }

  public DestroyUserData() {
    // delete token from storage so user will be unauthenticated
    this.DeleteItem(LocalStorageDataType.AuthToken)

    // and delete  any stored info about user

    this.DeleteItem(LocalStorageDataType.UserInfo)

  }
  // delete token container from local storage
  private DeleteAuthTokenContainer() {
    this.tempStorage.removeItem(LocalStorageDataType.AuthToken)
  }


  // delete user info from storage
  private DeleteUserInfo() {
    this.tempStorage.removeItem(LocalStorageDataType.UserInfo)
  }

  // save token in localstorage as string
  private LoadAuthToken(): any {
    let result = null
      result = this.tempStorage.getItem(LocalStorageDataType.AuthToken)
      return result ? JSON.parse(result) : null
  }

  
  // save token in localstorage as string
  private StoreAuthToken(token: string) {
      this.tempStorage.setItem(
        LocalStorageDataType.AuthToken,
        JSON.stringify(token)
      )    
  }

  private StoreUserInfo(user: any) {
      this.tempStorage.setItem(
        LocalStorageDataType.UserInfo,
        JSON.stringify(user)
      )
  }
 
  private LoadUserInfo() {
     
    let result = null
      result = this.tempStorage.getItem(LocalStorageDataType.UserInfo)
      return JSON.parse(result || '{}')
  }

}

class TempStorage {
  private readonly TempStorageName

  constructor(StorageName: string) {
    this.TempStorageName = StorageName

    // initiate a cookie as temp storage
    if (!this.GetTempStorage())
      document.cookie = `${this.TempStorageName}=${JSON.stringify({})};path=/`
  }

  setItem(name: string, value: string) {
    let temp_storage = this.GetTempStorage()
    temp_storage[name] = value
    document.cookie = `${this.TempStorageName}=${JSON.stringify(
      temp_storage
    )};path=/`
  }

  getItem(name: string) {
    let temp_object = this.GetTempStorage() || {}
    return temp_object[name]
  }

  removeItem(name: string) {
    let temp_object = this.GetTempStorage() || {}
    delete temp_object[name]
    document.cookie = `${this.TempStorageName}=${JSON.stringify(
      temp_object
    )};path=/`
  }

  clear() {
    document.cookie = `${this.TempStorageName}=${JSON.stringify({})};path=/`
  }

  private GetTempStorage() {
    let nameEQ = this.TempStorageName + '='
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) {
        let match = c.substring(nameEQ.length, c.length)
        return match ? JSON.parse(match) : null
      }
    }
    return null
  }
}
