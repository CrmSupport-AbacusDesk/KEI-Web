import {  Component,  Inject,  OnInit} from '@angular/core';
import {  MatDialog,  MAT_DIALOG_DATA} from '@angular/material';
import {  FormControl } from '@angular/forms';
import {  DialogComponent} from 'src/app/dialog.component';
import {  DatabaseService} from 'src/_services/DatabaseService';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';



const now = new Date();

@Component({
  selector: 'add-travel-list-modal',
  templateUrl: './add-travel-list-modal.component.html',

})
export class addTravelListModal implements OnInit {


  travel_type_data: any = [];
  data1: any = {};
  loader: any;
  today_date: any;
  lists: any;
  max: any;
  result: any = [];
  logIN_user: any;
  showSave: boolean = true;
  state_list: any = [];
  district_list: any = [];
  city_list: any = [];
  drlist: any = [];
  salesUserList: any = [];
  searchText;
  search: any = {};
  city_list2: any = [];
  tmpsearch: any = {};
  salesUserList2: any=[];
  state_list2:any=[];
  district_list2:any=[];
  drlist2:any=[];
  today:Date;
  selectedArea: any;
  userData: any;
  userId: any;
  userName: any;
  assign: any;



  constructor(public serve: DatabaseService, @Inject(MAT_DIALOG_DATA) public data, public Toastr: ToastrManager, public session: sessionStorage, public dialog: MatDialog, public dialog1: DialogComponent) {
// console.log(this.data.travel.id)
if(this.data.travel){
this.data1.travel_type=this.data.travel.travel_type
 this.assign=this.data.travel.assign_to
console.log(this.data.travel.date_from);
console.log(this.assign);
console.log(this.data1.travel_type);

}
this.data.city==[]

this.data.state==[]
this.data.district==[]

    this.today_date = new Date().toISOString().slice(0, 10);
    console.log(this.today_date);
    this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
    // this.data1.select_provision="testProvision";
    this.lists = new FormControl();
    this.get_sales_user_list();
    console.log(this.lists);
    this.today=new Date();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];

  }
distributor:any=[]
district:any=[]
city:any=[]
state:any=[]


  ngOnInit() {
    this.distributorList();
    this.getStateList();
    this.data1.date_to = '';
    this.data1.date_from = '';
    this.data1.travel_type=this.data.travel.travel_type
    this.id=this.data.travel.id

    this.data1.date_from=this.data.travel.date_from
    this.data1.date_to=this.data.travel.date_to
    this.data1.sales_user_id=this.data.travel.assign_to
console.log(this.data.sales_user_id)

    for (var i = 0; i < this.data.travel.area_dealer_list.length; i++) {
      this.distributor.push(this.data.travel.area_dealer_list[i].dr_id)
      console.log(this.distributor);
      this.data1.distributor=this.distributor
      this.data1.distributor=this.data1.distributor.toString();
      this.data1.distributor=this.data1.distributor.split(",")
      console.log(this.data1.distributor)

  }
  for (var i = 0; i < this.data.travel.travel_list.length; i++) {
    this.state=(this.data.travel.travel_list[0].state)
    this.state=this.state.toString()
    console.log(this.state);
   this.data1.state=this.state
   console.log(this.data.travel.travel_list[i].district);

   this.district.push(this.data.travel.travel_list[i].district)
   this.data1.district=this.district

    this.data1.district=this.data1.district.toString()
    this.data1.district=this.data1.district.split(",")
    console.log(this.data1.district)
    this.city.push(this.data.travel.travel_list[i].city)
    this.data1.city=this.city

     this.data1.city=this.data1.city.toString()
     this.data1.city=this.data1.city.split(",")
     console.log(this.data1.city)
    this.getDistrict(this.data1.state)
    this.getCityList(this.data1.state,this.data1.district)

}
  }

  get_sales_user_list() {

    this.serve.fetchData({ 'access_level': 2 }, "User/sales_user_list").subscribe((result => {
      this.salesUserList = result['sales_user_list'];
      this.salesUserList2 = this.salesUserList;
      console.log(this.salesUserList);
    }))
    this.data1.travel_type = '';
    this.data1.distributor = '';
    this.data1.status_remark = '';
    this.data1.state = '';
    this.data1.district = '';
    console.log(this.lists);
    this.selectedArea='';

    console.log("list in get sales user" + this.lists);
  }

  get_sales_user_List(search) {
    this.tmpsearch='';
    this.salesUserList = [];
    for (var i = 0; i < this.salesUserList2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.salesUserList2[i]['name'].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.salesUserList.push(this.salesUserList2[i]);
      }
    }
  }
  // get_types() {
  //   this.serve.fetchData({'travel_type': this.data1.travel_type}, "API").subscribe((result => {
  //     console.log(result);
  //     this.travel_type_data = result;
  //     console.log(this.travel_type_data);
  //   }))
  // }

  distributorList() {
    if(this.data1.state==''){
      this.data1.state=[]
    }
    if(this.data1.district==''){
      this.data1.district=[]
    }
    this.serve.fetchData({'user_id':this.data1.sales_user_id,'state':this.data1.state,'district':this.data1.district,'city':this.data1.city}, "Travel/distributors_list").subscribe((result => {
      this.drlist = result;
      for (let i = 0; i < this.drlist.length; i++) {
        if(this.drlist[i].type=="3"){
        this.drlist[i].type='Retailer'
       this.drlist[i].company_name=this.drlist[i].company_name+' '+'('+this.drlist[i].type+')'
        }
        if(this.drlist[i].type=="1"){
         this.drlist[i].type='Distributor'
        this.drlist[i].company_name=this.drlist[i].company_name+' '+'('+this.drlist[i].type+')'
         }
      }
      this.drlist2=this.drlist;
      console.log(this.drlist);
    }))
    this.search.sales_user='';
  }

  searchDistributor(search) {
    this.tmpsearch='';
    this.drlist = [];
    for (var i = 0; i < this.drlist2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.drlist2[i]['company_name'].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.drlist.push(this.drlist2[i]);
      }
    }
    this.search.sales_user='';
  }


  datavar: any = [];
id:any
  add_travel_plan() {
    // this.data1.id = this.data.id
    console.log(this.data1.date_from);
    console.log(this.data1.date_to);

    this.data1.created_by = this.logIN_user.data.id;
    // console.log(this.data1.uid);
    this.data1.date_from = moment(this.data1.date_from).format('YYYY-MM-DD');
    this.data1.date_to = moment(this.data1.date_to).format('YYYY-MM-DD');
    console.log(this.data1);

    if (this.data1.travel_type == 'Area Visit') {
      console.log(this.lists);
      this.data1.date_created = this.today_date;
      this.data1.travel_list = this.lists['value'];


    }
    // this.data1.area = this.lists['value'].area;
    // this.data1.id='';
    console.log(this.data1);
 this.data1.uid=this.userId;
 this.data1.uname=this.userName;

    // -------------


    this.serve.fetchData(this.data1, "Travel/add_travelPlan").subscribe((result => {
      console.log(result);
      if ((result['msg']) == "exist") {
        this.Toastr.errorToastr("Travel Plan already exist to selected date");
      }
      else{
        console.log("close dialog box");

        this.dialog.closeAll();
      }
      setTimeout(() => {
        this.loader = '';
      }, 100);
  }))
  }
  update_travel_plan() {

    this.data1.created_by = this.logIN_user.data.id;
    this.data1.date_from = moment(this.data1.date_from).format('YYYY-MM-DD');
    this.data1.date_to = moment(this.data1.date_to).format('YYYY-MM-DD');
    console.log(this.data1);

    if (this.data1.travel_type == 'Area Visit') {
      console.log(this.lists);
      this.data1.date_created = this.today_date;
      this.data1.travel_list = this.lists['value'];

      for (let index = 0; index < this.lists['value'].length; index++) {

        this.datavar.push(this.lists['value'][index].area);
        console.log(this.datavar);
      }


      this.data1.area = this.datavar;
    }

 this.data1.uid=this.userId;
 this.data1.uname=this.userName;

    // -------------
if(this.data.travel.id){
  console.log(this.data.travel.id)

  this.serve.fetchData({'id':this.data.travel.id,'data':this.data1}, "Travel/update_travelPlan").subscribe((result => {
    console.log(result);

    if ((result) == "exist") {
      this.Toastr.errorToastr("Travel Plan already exist to selected date");
    }
    else(result== true)
    {
      console.log("close dialog box");

      this.dialog.closeAll();
    }
    setTimeout(() => {
      this.loader = '';
    }, 100);
}))
}

  }


  tmp() {
    console.log(this.lists);
    console.log(this.lists['value']);
    this.selectedArea = this.lists['value'];
  }

  getStateList() {
    this.serve.fetchData(0, "User/state_user_list").subscribe((response => {
      console.log(response);
      this.state_list = response['query']['state_name'];
      this.state_list2=this.state_list;
    }));

    this.data1.distributor = '';
    this.data1.status_remark = '';
    this.data1.state = '';
    this.data1.district = '';
    this.lists['value']='';
    this.selectedArea='';
    this.search.sales_user='';
    // this.lists['_pendingValue']='';
    // this.lists='';
    this.get_sales_user_List('');
  }

  searchStateList(search) {
    this.tmpsearch='';
    this.state_list = [];
    for (var i = 0; i < this.state_list2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.state_list2[i].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.state_list.push(this.state_list2[i]);
      }
    }
    this.search.sales_user='';
  }

  getDistrict(data1) {
    this.serve.fetchData({'States':this.data1.state}, "Travel/districtList").subscribe((response => {
      this.district_list = response;
    for (var i = 0; i < this.district_list.length; i++) {

      this.district_list2.push(this.district_list[i].district_name);
      console.log(this.district_list2);
    }

    }));

    this.data1.distributor = '';
    this.data1.status_remark = '';
    this.data1.district = '';
    console.log("list in get district");
    this.lists['value']='';
    this.search.state_search='';
    this.searchStateList('');

    // this.lists['_pendingValue']='';
    // this.lists='';
  }
  searchDistrict(search) {
    this.tmpsearch='';
    this.district_list = [];
    for (var i = 0; i < this.district_list2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.district_list2[i].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.district_list.push(this.district_list2[i]);
      }
    }

  }


  getCityList(data1,data2) {
    console.log(data2);

    let value = { "state": this.data1.state, "district": this.data1.district }
    this.serve.fetchData(value, "Travel/cityList").subscribe((response => {
      console.log(response);
      this.city_list = response;
      this.city_list2 = this.city_list;
      console.log(this.city_list);

    }));
    console.log("list in get city list");
    console.log(this.lists);
    this.lists['value']='';
    this.search.district_search='';


    // this.lists['_pendingValue']='';
    // this.lists='';
    this.search.district_search='';
    this.searchDistrict('');

  }



  // ----------------------
  rsm: any = [];

  area_assign_check(value, index, event) {
    console.log(value);
    console.log(index);
    console.log(event);


    if (event.checked) {
      this.rsm.push(value);
    }
    else {
      for (var j = 0; j < this.city_list.length; j++) {
        if (this.city_list[index] == this.rsm[j]) {
          this.rsm.splice(j, 1);
        }
      }
    }
    this.selectedArea = this.rsm
  }

  area_list:any=[]
  getAreaList() {
    this.city_list = [];
    console.log(this.data1)
    let value = { "state": this.data1.state, "district": this.data1.district,"city":this.data1.city }
    this.serve.fetchData(value, "Travel/areaList").subscribe((response => {
      console.log(response);
      this.area_list = response;
      // this.city_list2 = this.area_list;
      console.log(this.city_list);

    }));
  }


}
