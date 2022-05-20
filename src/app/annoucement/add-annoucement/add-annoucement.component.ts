import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService'
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-add-annoucement',
  templateUrl: './add-annoucement.component.html',
  animations: [slideToTop()]
})
export class AddAnnoucementComponent implements OnInit {
  cityList:any=[];

  announcementData:any={};
  stateList:any=[];
  districtList:any=[];
  distributorList:any=[];
  directDealerList:any=[];
  dealertList:any=[];
  salesUserList:any=[];
  urls=new Array<string>();
  selectedFile=[];
  submit = false;
  loader:any;
  formData=new FormData();
  userData:any;
  userId:any;
  userName:any;
search:any={}
  
  constructor(public serve:DatabaseService,public rout:Router,public dialog:DialogComponent) 
  {
    this.getStateList();
    this.getUserDrList();
    this.announcementData.dealers = [];
    this.announcementData.direct_dealer =[];
    this.announcementData.distributors=[];
    this.announcementData.users=[];
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    console.log(this.userData);
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    console.log(this.userId);
  }
  
  ngOnInit() {
  }
  
  getStateList()
  {
    this.serve.fetchData('',"Announcement/state_list").subscribe((response=>
      {
        console.log(response); 
        this.stateList = response
      }));
    }
    
    getDistrictList()
    {
      this.serve.fetchData({'state':this.announcementData.state},"Announcement/district_list").subscribe((response=>
        {
          console.log(response); 
          this.districtList = response
        }));
      }
      getCityList()
      {
        this.serve.fetchData({'state':this.announcementData.state,'district':this.announcementData.district},"Announcement/city_list").subscribe((response=>
          {
            console.log(response); 
            this.cityList = response
          }));
        }
      getUserDrList()
      {
        this.serve.fetchData({'state':this.announcementData.state,'district':this.announcementData.district,'city':this.announcementData.city,'search':this.announcementData.search},"Announcement/user_dr_list").subscribe((response=>
          {
            console.log(response); 
            this.distributorList = response['distributor_list'];
            this.directDealerList = response['direct_dealer_list'];
            this.dealertList = response['dealer_list'];
            this.salesUserList = response['user_list'];
            
            // this.announcementData.dealers = [];
            // this.announcementData.direct_dealer =[];
            // this.announcementData.distributors=[];
            // this.announcementData.users=[];
            
            console.log(this.distributorList);
            
          }));
        }
        selectAll(action)
        {
          if(action == 'dealers')
          {
            setTimeout(() => 
            {
              if(this.announcementData.all_dealers == true)
              {
                const dealerData = [];
      
                for (let i = 0; i < this.dealertList.length; i++) 
                {
                  // let index = this.announcementData.dealers.findIndex(row =>row == this.dealertList[i].id)
                  // if(index == -1)
                  // {
                    dealerData.push(this.dealertList[i].id);
                  // }
                }
                this.announcementData.dealers = dealerData ;
              }
              else
              {
                this.announcementData.dealers = []
              }
              
            }, 200);
           
          }
      
          if(action == 'direct_dealer')
          {
            setTimeout(() => 
            {
              if(this.announcementData.all_direct_dealer == true)
              {
                const directDealerData = [];
      
                for (let i = 0; i < this.directDealerList.length; i++) 
                {
                  // let index = this.announcementData.direct_dealer.findIndex(row =>row == this.directDealerList[i].id)
                  // if(index == -1)
                  // {
                    directDealerData.push(this.directDealerList[i].id);
                  // }
                }
                this.announcementData.direct_dealer = directDealerData;
              }
              else
              {
                this.announcementData.direct_dealer = []
              }
            },200);
          }
      
          if(action == 'distributors')
          {
      
            setTimeout(() => 
            {
              if(this.announcementData.all_distributors == true)
              {
      
                const distributorData = [];
                for (let i = 0; i < this.distributorList.length; i++) 
                {
                  // let index = this.announcementData.distributors.findIndex(row =>row == this.distributorList[i].id)
                  // if(index == -1)
                  // {
                    distributorData.push(this.distributorList[i].id);
                  // }
                }
      
                console.log(distributorData);
      
                this.announcementData.distributors = distributorData;
              }
              else
              {
                this.announcementData.distributors = []
              }
              console.log(this.announcementData.distributors);   
      
            },200)
          }
      
          if(action == 'users')
          {
            console.log(this.announcementData.all_users);
      
            setTimeout(() => 
            {
              if(this.announcementData.all_users == true)
              {
                const userData = [];
                for (let i = 0; i < this.salesUserList.length; i++) 
                {
                  // let index = this.announcementData.users.findIndex(row =>row == this.salesUserList[i].id)
                  // if(index == -1)
                  // {
                    userData.push(this.salesUserList[i].id);
                  // }
                }
      
                this.announcementData.users = userData;
              }
              else
              {
                this.announcementData.users = []
              }
            },200)
          }
          // console.log(this.announcementData);
          
        }
        test()
           {
                console.log(this.announcementData.distributors);   
          }
      
        
        // addToList()
        // {
        //   console.log(this.announcementData);
          
        // }
        
        
        insertImage(data)
        {
          let files = data.target.files;
          if (files) 
          {
            for (let file of files) 
            {
              let reader = new FileReader();
              reader.onload = (e: any) => 
              {
                this.urls.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          
          for(var i=0; i<data.target.files.length; i++)
          {
            this.selectedFile.push(data.target.files[i]);
          }
        }
        
        
        delete_img(index:any)
        {
          this.urls.splice(index,1)
        }
        
        
        
        submitAnnouncement()
        {
          console.log(this.announcementData);
          
          if(!this.announcementData.dealers.length && !this.announcementData.direct_dealer.length &&!this.announcementData.distributors.length && !this.announcementData.users.length)
          {
            this.dialog.error('Select any Sales Executive');
          }
          else
          {
            this.loader = true;
            this.submit = true;
            this.announcementData.uid = this.userId
            this.announcementData.userName = this.userName
            
            this.serve.fetchData(this.announcementData,"Announcement/add_announcement").subscribe((result)=>
            {
              
              this.loader = false;
              console.log(result);
              
              let id=result['announcement_id'];
              
              for(var i=0; i<this.selectedFile.length; i++)
              {
                this.formData.append("image"+i,this.selectedFile[i],this.selectedFile[i].name);
              }
              
              this.formData.append('id',id);
              
              if(this.selectedFile && this.selectedFile.length > 0)
              {
                this.loader = true;
                this.serve.upload_image(this.formData,"Announcement/insert_image").subscribe((resp)=>
                {
                  this.loader = false;
                  console.log(resp);
                  if(resp)
                  {
                    this.dialog.success("Announcement","Sent");
                    this.rout.navigate(['/announcement-list']);
                  }
                });
              } 
              else 
              {
                this.dialog.success("Announcement","Sent");
                this.rout.navigate(['/announcement-list']);
              }
            })
          }
          
        }




        
      }
      