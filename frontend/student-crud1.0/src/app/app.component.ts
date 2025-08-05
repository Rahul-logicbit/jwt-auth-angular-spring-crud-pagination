import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'student-crud1.0';

  constructor(){
    console.log("App Component is loaded====");
    
  }
}
