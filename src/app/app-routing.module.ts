import { NgModule} from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import { LoginComponent} from "./login/login.component";
import { RegisterComponent} from "./register/register.component";
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';

const appRoutes: Routes = [
  {path: 'profile', component: ProfileComponent},  
  {path: 'login', component: LoginComponent},
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin', component: AdminComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
