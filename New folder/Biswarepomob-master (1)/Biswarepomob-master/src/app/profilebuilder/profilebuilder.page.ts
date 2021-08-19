import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profilebuilder',
  templateUrl: './profilebuilder.page.html',
  styleUrls: ['./profilebuilder.page.scss'],
})
export class ProfilebuilderPage implements OnInit {
  page: any = 2;
  obVar: any = {};
  showNextBtn: boolean = true;
  content = [];
  radio = [];
  radioOpt = [];
  dropOpt = [];
  checkOpt = [];
  inputBox = [];
  input = [];
  structure = [];
  select = [];
  check = [];
  text = [];
  saveData = {};
  temp: any;
  showRadio: boolean = false;
  myToast: any;
  userID: any;


  constructor(
    private _athSrc: AuthService,
    private toast: ToastController,
    private router: Router,
    public http: HttpClient,
    private route: ActivatedRoute
  ) {

    let endPoint = "/api/profilebuilder";
    let postData = new FormData();
    postData.append('page', this.page)
    this._athSrc.postApiCall(endPoint, postData).then((data) => {
      console.log("api Response", data);
      let stringData = JSON.stringify(data)
      let arrayData = JSON.parse(stringData);
      this.content = arrayData;
      console.log("api Response length", arrayData.length);
      for (let i in arrayData) {
        if (data[i].question_type === 'checkbox') {
          let checkOptions = [];
          for (let k = 0; k < data[i].option.length; k++) {
            checkOptions[k].isSelected = false
          }
          this.check[i] = checkOptions;
        }
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.userID) {
        this.userID = JSON.parse(params.userID);
      }
    });
    console.log("current page", this.page);
    this.obVar.progress = this.page / 4;
    this.getProfilebuilder(this.page);
  }
  goNext() {
    this.obVar.progress = (this.page / 4) + 0.25;
    console.log("Progress", this.obVar.progress);
    this.page = this.page + 1;
    if (this.page > 4) {
      this.router.navigate(["/home"]);
    } else {
      let currentPage = this.page;
      this.getProfilebuilder(currentPage);

    for(let i=0;i<this.content.length;i++){     
      // if(this.content[i].question_type==='radio'){
      //   if(this.radio[i]){
      //   console.log(this.radio[i],this.content[i].id);
      //     this.saveData[this.content[i].columns_name]=this.radio[i];
      //   }
      // }

      if(this.content[i].question_type==='inputbox'){
          if(this.input[i]){
          this.saveData[this.content[i].columns_name]=this.input[i];
          }
        }
        if(this.content[i].question_type==='slider'){
          if(this.structure[i]){
          this.saveData[this.content[i].columns_name.split(',')[0]]=this.structure[i].upper;
          this.saveData[this.content[i].columns_name.split(',')[1]]=this.structure[i].lower;
          }
        }
         if(this.content[i].question_type==='dropdown'){
          if(this.select[i]){
          this.saveData[this.content[i].columns_name]=this.select[i];      
          }
         }
         if(this.content[i].question_type==='checkbox'){
            let selectedValue='';
            for(let j=1;j<=Object.keys( this.content[i].option).length;j++)
            {

              if(this.check[i]){
                if(this.check[i][j-1])
                selectedValue=selectedValue+this.content[i].option[j]+",";                     
              }
      
            }
            if(selectedValue.length > 1)
              this.saveData[this.content[i].columns_name]= selectedValue.substring(0, selectedValue.length - 1)  ;            
         }
         if(this.content[i].question_type==='textarea'){
          if(this.text[i]){
          this.saveData[this.content[i].columns_name]=this.text[i];        
          }
         }             
    }
    console.log(this.saveData);
    console.log(this.page);
    this.insert();
    }
  }




  async getProfilebuilder(pageNum) {
    let endPoint = "/api/profilebuilder";
    console.log("current Page", pageNum);

    let postData = new FormData();
    postData.append('page', pageNum)
    await this._athSrc.postApiCall(endPoint, postData).then((data) => {
      console.log("api Response", data);
      let arrayData = JSON.parse(JSON.stringify(data));
      this.content = arrayData;
      console.log("api Response length", arrayData.length);
      for (let i in arrayData) {
        if (data[i].question_type === 'radio') {
          let options = data[i].option;
          let optnArr = []
          optnArr.push(Object.values(options));
          this.radioOpt[i] = optnArr[0];
          this.showRadio = true;
        }

        if (data[i].question_type === 'dropdown') {
          let options = data[i].option;
          let optnArr = []
          optnArr.push(Object.values(options));
          this.dropOpt[i] = optnArr[0];
        }

        if (data[i].question_type === 'checkbox') {
          let options = data[i].option;
          let optnArr = []
          optnArr.push(Object.values(options));
          this.checkOpt[i] = optnArr[0];
          console.log("Optons", this.checkOpt[i]);
        }

        if (data[i].question_type === 'inputbox') {
          this.inputBox[i] = '';
        }
      }
    })

    for (let i = 0; i < this.content.length; i++) {
      if (this.content[i].question_type === 'checkbox') {
        let checkOptions = [];
        for (let k = 0; k < this.content[i].option.length; k++) {
          checkOptions[k] = '';
        }
        this.check[i] = checkOptions;
      }
    }
  }

  getValue(val, name) {
    this.saveData[name] = val;
  }

  skip(){
    this.page=this.page+1;
    this.obVar.progress = (this.page / 4) + 0.25;
    this.getProfilebuilder(this.page);
  }

  async insert() {
    if (this.validateForm()) {
      this.submit();
      // this.skip();
    }
    else {
      this.myToast = await this.toast.create({
        message: 'All Questions are mandatory',
        duration: 3000
      })
      this.myToast.present();
      this.page = this.page -1;
      this.obVar.progress = (this.page / 4) - 0.25;
      this.getProfilebuilder(this.page);
    }
  }

  validateForm() {
    let flag = true;
    for (let i = 0; i < this.content.length; i++) {
      if (this.content[i].mandatory === '1')
        if (!this.saveData[this.content[i].columns_name.split(',')[0]])
          flag = false;
    }
    return flag;
  }

  submit() {
    let postData = new FormData();
    let API_URL = 'http://jigaju.esy.es/api/update_profile_APP';
    let data = this.saveData;
    postData.append('data', JSON.stringify(data));
    postData.append('id', this.userID);
    let responseData: Observable<any>;
    responseData = this.http.post(API_URL, postData);
    responseData.subscribe(data => {
      console.log(data);
      this.saveData={};
      this.radio=[];
      this.input=[];
      this.structure=[];
      this.select=[];
      this.text=[];
    });
  }

}
