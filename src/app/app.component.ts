import { Component, Renderer2 } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { AuthGuard } from './auth.guard';
import { sessionStorage } from './localstorage.service';

// import

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'abacusdesk';
  login_data:any={};
  constructor(public serve:DatabaseService,public session:sessionStorage,public renderer:Renderer2){
    
    console.log(this.serve.can_active);
    console.log("can");
    this.session.getSession()
    .subscribe(resp=>{
      console.log(resp);
      this.login_data = resp.data;
    });
  }
}
