import { Component, OnInit , Input } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  name = null;
  email = null
  users = []
  currentUser : any;
  isLoading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private db: AngularFireDatabase,
  ) {
    this.isLoading = true;
    auth.getUser().subscribe((user) => {
      console.log("USER IS:", user);
      this.email = user?.email;
    });
    db.object("/users")
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.users = Object.values(obj);
          this.isLoading = false;
        } else {
          toastr.error("NO user found");
          this.users = [];
          this.isLoading = false;
        }
        this.users.map(cu =>{
          console.log(cu)
          if(this.email == cu.email) {
            this.name=cu.name;
          }
        })
    });

  }



  ngOnInit(): void {

  }



  async handleSignOut() {
    try {
      await this.auth.signOut();

      this.router.navigateByUrl("/signin");
      this.toastr.info("Logout success");
      this.name = null;
    } catch (error) {
      this.toastr.error("Problem in signout");
    }
  }
}
