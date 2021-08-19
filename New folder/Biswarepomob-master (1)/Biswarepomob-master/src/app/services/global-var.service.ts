import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarService {

  constructor() { }
  token:any;
  baseUrl = 'http://jigaju.esy.es';
  currentUserDetails: any;
  signupEmailAndPass : any;
  //profileImage:any
  id:any;
  userId:any;
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
  //public baseURL:string='http://jigaju.esy.es/';
  public packageType:string;
  public notificationFlag:boolean=false;
  public promotion:boolean;
}
