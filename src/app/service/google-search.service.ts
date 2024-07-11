import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleSearchService {
  private apiKey = 'AIzaSyACoQoJZGuT3a9nLaAp2uenZ_2Jdk33sUA'; //Clave de API
  private id = '36ef51fead70d4dc2'; //ID de Custom Search

  constructor(private http: HttpClient) { }

  searchNews(query: string) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${this.apiKey}&cx=${this.id}&num=5&sort=date`;
    return this.http.get(url);
  }
}
