import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-activityreport',
  templateUrl: './activityreport.component.html',
  styleUrls: ['./activityreport.component.scss']
})
export class ActivityreportComponent implements OnInit {

  data_not_found = false;
  skelton: any = {};
  add: any = {};
  assign_login_data2: any = [];

  delete: any = {};

  edit: any = {};
  assign_login_data: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  constructor(public serve: DatabaseService, public route: Router, public dialog: DialogComponent, public session: sessionStorage) {
    this.activityList();

    this.data.date_to==''
    this.data.date_from==''

    this.today_date = new Date();

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;

    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);

    let flag = 0;
    const index = this.assign_login_data.findIndex(row => row.module_name == 'Distribution Distributors');

  }

  ngOnInit() {
    this.User()
    this.search_val = this.serve.directDealerListSearch
    this.skelton = new Array(10);
  }
  value: any = {};

  activity_list: any = [];
  start: any = 0;
  count: any;
  total_page: any;
  pagenumber: any;
  state_values: any = [];
  exp_loader: any;
  loader: any;
  data: any = [];
  type: any = 7
  search_val: any = {}
  dr_count: any;
  today_date: Date;
  othertype = [{ team_state: 'All' }]

  public onDate(event): void {
    this.search_val.date_created = moment(event.value).format('YYYY-MM-DD');
  }

  activityList() {


    if (this.data.date_from) {
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
    }
    console.log(this.data.date_to);
    if (this.data.date_to) {
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
      console.log(this.data.date_to);

    }
    // console.log(this.data.search);

    // 
    console.log(this.data.user_id)
    this.exp_loader = true;

    // this.loader = true;
    this.serve.fetchData({ 'date_from': this.data.date_from, 'date_to': this.data.date_to, 'team_state': this.data.team_state }, "dwr/checkin_report")
      .subscribe((result => {
        console.log(result);
        this.activity_list = result['data'];
        for(var i=0;i<this.activity_list.length; i++)
        {
          this.activity_list[i].total=parseInt(this.activity_list[i].distributorCount)+parseInt(this.activity_list[i].retailerCount)+parseInt(this.activity_list[i].electricianCount)+parseInt(this.activity_list[i].otherCount)
  console.log(this.activity_list[i].total);
  
  
        }



        setTimeout(() => {
          this.exp_loader = false;

        }, 500);
        if (this.activity_list.length == 0) {
          this.data_not_found = true;
        } else {
          this.data_not_found = false;

        }
        this.serve.count_list();
      }))
  }
  systemuserlist: any = []
state_list: any = []

  channel_partner_list1: any = []
  User() {

    this.serve.fetchData({}, "dwr/team_state").subscribe((result => {
      console.log(result);
      this.systemuserlist = result['team_state']
      this.state_list= result['team_state'];

      this.channel_partner_list1.push(this.othertype[0])
      for (var i = 0; i < this.systemuserlist.length; i++) {
        this.channel_partner_list1.push(this.systemuserlist[i])
        console.log(this.channel_partner_list1);


      }
      console.log(this.systemuserlist);

    }))

  }
  refresh() {
    this.activity_list=[];
    this.data.date_from='';
    this.data.date_to='';
    this.data.team_state='';

  }



  tmpsearch1: any = {};
  excel_data: any = [];
  exp_data: any = [];
  exportAsXLSX(): void {
    if (this.data.date_from) {
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
    }
    console.log(this.data.date_to);
    if (this.data.date_to) {
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
      console.log(this.data.date_to);

    }
    this.exp_loader = true;
    this.serve.FileData({ 'date_from': this.data.date_from, 'date_to': this.data.date_to, 'team_state': this.data.team_state }, "dwr/checkin_report")
      .subscribe(resp => {
        console.log(resp);
        this.exp_data = resp['data'];
        console.log(this.exp_data);


        for (let i = 0; i < this.exp_data.length; i++) {
          this.exp_data[i].total=parseInt(this.exp_data[i].distributorCount)+parseInt(this.exp_data[i].retailerCount)+parseInt(this.exp_data[i].electricianCount)+parseInt(this.exp_data[i].otherCount)
          this.excel_data.push({ 'Region':this.exp_data[i].region,'State': this.exp_data[i].team_state, 'Team Name':this.exp_data[i].employee_id,'Employee ID': this.exp_data[i].employee_id,  'Sales User': this.exp_data[i].name, 'Dealer/Distributor': this.exp_data[i].distributorCount, 'Retailer': this.exp_data[i].retailerCount,'Electrician': this.exp_data[i].total,'Others': this.exp_data[i].otherCount,'Total Checkins': this.exp_data[i].workingDays,'Working Days': this.exp_data[i].workingDays,'Leave Days': this.exp_data[i].leave,'Spend Hours': this.exp_data[i].spendhour,'Working Hours': this.exp_data[i].workinghour});
        }
        this.exp_loader = false;

        this.serve.exportAsExcelFile(this.excel_data, 'ACTIVITY SHEET');
        this.excel_data = [];
        this.exp_data = [];
      })
  }
tmpsearch:string

  filter_dr(dr_name){
    console.log("filter_dr method calls");
    console.log(dr_name);
    this.tmpsearch='';
    this.channel_partner_list1 = [];
    for (var i = 0; i < this.state_list.length; i++) {
      dr_name = dr_name.toLowerCase();
      this.tmpsearch = this.state_list[i]['team_state'].toLowerCase();
      if (this.tmpsearch.includes(dr_name)) {
        this.channel_partner_list1.push(this.state_list[i]);
        console.log(this.systemuserlist)

      }
    }
  }
  id: any;
  state: any;
  tothepage(id, state, type) {
    this.route.navigate(['/distribution-detail/' + id], { queryParams: { state, id, type } });

  }
}
