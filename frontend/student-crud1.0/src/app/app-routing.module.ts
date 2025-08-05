  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';

  const routes: Routes = [
     {
      path: '',
      redirectTo: 'students',
      pathMatch:'full'
    },
    
    {
      path: 'students',
      loadChildren: () =>
        import('../pages/student-module/student-module').then(m => m.StudentModuleModule)
    }
    
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {
    constructor() {
      console.log("App routing module loaded ====");
    }
  }
