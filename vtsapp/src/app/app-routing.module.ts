import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { SearchComponent } from './search/search.component';
import { ViewComponent } from './view/view.component';
import { HouseenrollComponent } from './houseenroll/houseenroll.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AuditComponent } from './audit/audit.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'search/tax', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'viewtax', component: ViewComponent, canActivate: [AuthGuard] },
  { path: 'transaction', component : TransactionComponent, canActivate:[AuthGuard]},
  { path: 'enroll', component : HouseenrollComponent, canActivate:[AuthGuard]},
  { path: 'audit', component : AuditComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  LoginComponent,
  HomeComponent
];