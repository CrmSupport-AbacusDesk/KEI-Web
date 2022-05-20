import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { TravelStatusModalComponent } from '../travel-status-modal/travel-status-modal.component';
import { addTravelListModal } from '../add-travel-list/add-travel-list-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';



@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html'
})
export class TravelListComponent implements OnInit {
  travel_list: any = [];
  loader: any = false;
  page_limit: any = 50
  search: any = {};
  skelton: any;
  data_not_found = false;
  active_tab = 'Pending';
  status: any = {};
  travel_list1: any = [];
  travel_list2: any = [];
  count_list: any = [];

  today_date: Date;
  assign_login_data2: any = [];


  assign_login_data: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;


  constructor(public alert: DialogComponent, public serve: DatabaseService, public alrt: MatDialog, public dialog: MatDialog, public session: sessionStorage) {
    this.skelton = new Array(10);

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    console.log(this.assign_login_data2);



    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'Travel Plan');
    console.log(index);

    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;

    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);


    this.today_date = new Date();


  }

  ngOnInit() {
    this.getTravelList();

    this.travel_list2;
  }
  upload_excel() {
    const dialogRef = this.alrt.open(UploadFileModalComponent, {
      width: '500px',
      data: {
        'from': 'travel',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTravelList();

    });
  }
  getTravelList(action: any = '') {
    if (action == "refresh") {
      this.search = {};
    }

    this.loader = true;
    if (this.search.date_to)
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');

    if (this.search.date_from)
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');


    this.serve.fetchData({
      'user_id': this.assign_login_data2.id, 'start': this.travel_list.length, 'pagelimit': this.page_limit, 'search': this.search, 'active_tab': this.active_tab, 'user_type': this.assign_login_data2.type
    }, "Travel/travel_list").subscribe((result => {
      console.log(result);
      this.loader = false;
      this.count_list = result;

      this.travel_list = result['data'];
      this.travel_list2 = result['data']['travel_plan'];
      console.log(this.travel_list2);

      if (this.travel_list.length == 0) {
        this.data_not_found = true;
      }
      else {
        this.data_not_found = false;
      }
    }))
  }

  public onDate(event): void {
    if (this.search.date_created) {
      this.search.travel_date = moment(event.value).format('YYYY-MM-DD');
      console.log(this.search.travel_date);
    }
    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }
    console.log(this.search.date_to)


    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
      console.log(this.search.date_to)
    }

    this.getTravelList();

  }

  statusModal(id) {

    const dialogRef = this.dialog.open(TravelStatusModalComponent, {
      width: '400px',
      data: {
        id
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      this.getTravelList();
    });

  }

  testfunction() {

    for (let i = 0; i < this.travel_list.length; i++) {

      this.districtAppend = '';

      for (let j = 0; j < this.travel_list[i].travel_plan.length; j++) {

        this.districtAppend = this.travel_list[i].travel_plan[j]['district'] + ',' + this.districtAppend;
        this.state4xl = this.travel_list[i].travel_plan[j]['state'] + ',' + this.state4xl
        this.areaexcel = this.travel_list[i].travel_plan[j]['area'] + ',' + this.areaexcel
        this.cityexcel = this.travel_list[i].travel_plan[j]['city'] + ',' + this.cityexcel



      }
      console.log(this.districtAppend);
      console.log(this.state4xl);
      console.log(this.areaexcel);


    }



  }
  districtAppend: String;
  state4xl: String;
  cityexcel: String;

  area: any
  areaexcel: any;
  excel_data: any = [];
  company_name: String;
  exportAsXLSX(): void {
    for (let i = 0; i < this.travel_list.length; i++) {
      this.districtAppend = '';
      this.areaexcel = ""
      this.cityexcel = ""
      this.state4xl = ""
      this.company_name = ""



      if (this.travel_list[i].travel_type != "Distributor Visit") {
        
        console.log("in if");

        for (let j = 0; j < this.travel_list[i].travel_plan.length; j++) {

          this.districtAppend = this.travel_list[i].travel_plan[j]['district'] + ',' + this.districtAppend;
          this.state4xl = this.travel_list[i].travel_plan[j]['state'] + ',' + this.state4xl
          this.areaexcel = this.travel_list[i].travel_plan[j]['area'] + ',' + this.areaexcel
          this.cityexcel = this.travel_list[i].travel_plan[j]['city'] + ',' + this.cityexcel

        }
        this.excel_data.push({ 'Date from': this.travel_list[i].date_from, 'Date to': this.travel_list[i].date_to, 'TravelType': this.travel_list[i].travel_type, 'ERPCode':this.travel_list[i].executive_erp_id, 'Executive name': this.travel_list[i].name, 'Status': this.travel_list[i].status, 'State': this.state4xl, 'District': this.districtAppend, 'City': this.cityexcel, 'Area': this.areaexcel });

      }
      else {
        console.log("in else ");


        for (let j = 0; j < this.travel_list[i].travel_plan.length; j++) {
          this.company_name = this.travel_list[i].travel_plan[j]['company_name'] + ',' + this.company_name


        }
        console.log(this.company_name);
        this.travel_list[i].travel_type = 'Party Visit';
        

        this.excel_data.push({ 'Date from': this.travel_list[i].date_from, 'Date to': this.travel_list[i].date_to, 'TravelType': this.travel_list[i].travel_type,'ERPCode':this.travel_list[i].executive_erp_id, 'Executive name': this.travel_list[i].name, 'Status': this.travel_list[i].status, 'Company Name': this.company_name });

      }
      console.log(this.districtAppend);

      // this.excel_data.push({ 'Date from': this.travel_list[i].date_from, 'Date to': this.travel_list[i].date_to, 'TravelType': this.travel_list[i].travel_type, 'Executive name': this.travel_list[i].name, 'Status': this.travel_list[i].status, 'State': this.state4xl, 'District': this.districtAppend });

    }

    console.log(this.travel_list.length);

    console.log(this.excel_data);
    this.serve.exportAsExcelFile(this.excel_data, 'Travel Plan Sheet');
    this.excel_data = [];

  }
  addTravelPlan() {
    const dialogRef = this.dialog.open(addTravelListModal, {
      width: '720px',
      data: {

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTravelList();
      setTimeout(() => {
        this.loader = '';
      }, 100);

      if (result != false) {
        this.active_tab = 'Approved'
        this.getTravelList();
      }
      else {
        this.active_tab = 'Pending'
        this.getTravelList();
      }

    });


  }

}
