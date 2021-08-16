import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthgaurdService, OuterAuthgaurdService } from './services/authgaurd.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
     canActivate: [AuthgaurdService]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule),
    
  },
  {
    path: 'blockuser',
    loadChildren: () => import('./blockuser/blockuser.module').then( m => m.BlockuserPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'chatting',
    loadChildren: () => import('./chatting/chatting.module').then( m => m.ChattingPageModule)
  },
  {
    path: 'editprofile',
    loadChildren: () => import('./editprofile/editprofile.module').then( m => m.EditprofilePageModule)
  },
  {
    path: 'featureduser',
    loadChildren: () => import('./featureduser/featureduser.module').then( m => m.FeatureduserPageModule)
  },
  {
    path: 'features',
    loadChildren: () => import('./features/features.module').then( m => m.FeaturesPageModule)
  },
  {
    path: 'insight',
    loadChildren: () => import('./insight/insight.module').then( m => m.InsightPageModule)
  },
  {
    path: 'mappoint',
    loadChildren: () => import('./mappoint/mappoint.module').then( m => m.MappointPageModule)
  },
  {
    path: 'match',
    loadChildren: () => import('./match/match.module').then( m => m.MatchPageModule)
  },
  {
    path: 'matchcheckout',
    loadChildren: () => import('./matchcheckout/matchcheckout.module').then( m => m.MatchcheckoutPageModule)
  },
  {
    path: 'myprofile',
    loadChildren: () => import('./myprofile/myprofile.module').then( m => m.MyprofilePageModule)
  },
  {
    path: 'passwordreset',
    loadChildren: () => import('./passwordreset/passwordreset.module').then( m => m.PasswordresetPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'profilebuilder',
    loadChildren: () => import('./profilebuilder/profilebuilder.module').then( m => m.ProfilebuilderPageModule)
  },
  {
    path: 'profilebuilder1',
    loadChildren: () => import('./profilebuilder1/profilebuilder1.module').then( m => m.Profilebuilder1PageModule)
  },
  {
    path: 'profileimg',
    loadChildren: () => import('./profileimg/profileimg.module').then( m => m.ProfileimgPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'sidemenu',
    loadChildren: () => import('./sidemenu/sidemenu.module').then( m => m.SidemenuPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./subscription/subscription.module').then( m => m.SubscriptionPageModule)
  },
  {
    path: 'subscriptionpurchase',
    loadChildren: () => import('./subscriptionpurchase/subscriptionpurchase.module').then( m => m.SubscriptionpurchasePageModule)
  },
  {
    path: 'term-of-services',
    loadChildren: () => import('./term-of-services/term-of-services.module').then( m => m.TermOfServicesPageModule)
  },
  {
    path: 'userranking',
    loadChildren: () => import('./userranking/userranking.module').then( m => m.UserrankingPageModule)
  },
  {
    path: 'userrating',
    loadChildren: () => import('./userrating/userrating.module').then( m => m.UserratingPageModule)
  },
  {
    path: 'profilebuilder2',
    loadChildren: () => import('./profilebuilder2/profilebuilder2.module').then( m => m.Profilebuilder2PageModule)
  },
  {
    path: 'profilebuilder3',
    loadChildren: () => import('./profilebuilder3/profilebuilder3.module').then( m => m.Profilebuilder3PageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
