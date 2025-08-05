// services/url.service.ts
import { Injectable } from "@angular/core";
import { environment } from "../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class URLService {
  constructor() {
    console.log("URL Service object is loaded");
  }
  
  // Base URLs
  public readonly baseUrl: string = environment.apiUrl || "http://localhost:8080/api";
  public readonly studentBaseUrl: string = `${this.baseUrl}/students`;
  public readonly authBaseUrl: string = `${this.baseUrl}/auth`;
  
  // Auth endpoints
  public readonly loginAPI: string = `${this.authBaseUrl}/login`;
  public readonly signupAPI: string = `${this.authBaseUrl}/signup`;
  
  // Student management endpoints
  public readonly getAllStudentsAPI: string = `${this.studentBaseUrl}/studentlist`;
  public readonly getStudentByIdAPI: string = `${this.studentBaseUrl}/by-id`;
  public readonly updateStudentAPI: string = `${this.studentBaseUrl}/updatestudent`;
  public readonly deleteStudentAPI: string = `${this.studentBaseUrl}/deletestudent`;
  public readonly getStudentsPaginatedAPI: string = `${this.studentBaseUrl}/paginated`;
  
}