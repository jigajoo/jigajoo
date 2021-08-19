import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVariableProvider {

  public currectUserAllDetails:any;
  public profileImage:string;
  public profileDispalyName:string;
  public IAPPackageID:string;
  public IAPPackageValidity:number;
  public IAPUserID:string;
  public IAPPackagePeriod:string;
  public IAPPackagecount:any;
  public flag:any;
  public newUser:boolean=false;
  public baseURL:string='http://jigaju.esy.es/';
  public packageType:string;
  public notificationFlag:boolean=false;
  public promotion:boolean;
  constructor() {
  }
}
