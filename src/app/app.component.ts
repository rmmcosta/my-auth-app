import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly apiUrl = "http://localhost:8080"
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${this.apiUrl}/resource`).subscribe(data => {
      console.log(`resource data: ${JSON.stringify(data)}`);
      this.greeting = data;
    });
  }
  title = 'my-auth-app';
  greeting: any = { 'id': 'XXX', 'message': 'Hello unknown' }
}
