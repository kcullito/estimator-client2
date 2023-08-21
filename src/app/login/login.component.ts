import { Component } from '@angular/core';
import { User } from '../_models/user.model';
import { BehaviorSubject, catchError, first, map, Observable, of, startWith } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { MessageService } from 'primeng/api';
import { ThemeService } from '../_services/theme.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    user: User = new User();
    loginError: string;

    emailAddress: string;
    pwd: string;
    pwd2: string;

    submitted: boolean = false;
    defaultTheme: 'theme-nova';


    emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private storage: StorageService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private themeService: ThemeService
    ) {}
        
    ngOnInit(): void {
        //console.log("login:ngOnInit()")
        this.getCredentials();
        if (this.user) {
            this.emailAddress = this.user.email;
            this.pwd = this.user.password;
            //this.emailAddress = "kevin@culliton.net";
            //this.pwd = "password";
            if (this.emailAddress && this.pwd) {
                this.login();
            }
        }
    }

    login() {
        //console.log("calling login.componenet:login:email:" + this.emailAddress + ":pwd:" + this.pwd);
        this.submitted = true;
        if (this.emailAddress && this.pwd) {
            this.storage.removeUser();
            this.authenticationService.login(this.emailAddress, this.pwd).pipe(first()).subscribe(
                response => {

                    this.user = response.data.user;
                    this.user.email = this.user.username;
                    if (this.user.id && this.user.email) {
                        this.user.token = response.token;
                        //this.getRoles(this.user.token);
                        this.user.tokenExpiration = response.tokenExpiration;
                        this.user.password = this.pwd;
                        this.storage.setUser(this.user);
                        this.user.password = "";
                        
                        if (this.user.currentTheme === undefined || this.user.currentTheme.length < 10) {
                            this.user.currentTheme = 'theme-bs-dark-blue';
                        }
                        this.themeService.switchTheme(this.user.currentTheme);
                        this.storage.setCurrentTheme(this.user.currentTheme);

                        this.router.navigate(['']);

                    } else {
                        this.messageService.add({severity:'error', summary: 'Error', detail: response.message, life: 5000})
                    }

                }
                //, 
                //error => this.messageService.add({severity:'error', summary: 'Error', detail: "Email address or password incorrect", life: 5000}),
                //() => console.log("Login successful")
            )
        }
    }

    getCredentials() {
        //this.user = this.storage.getUser();
    }

    handleKeyUp(e){
        if(e.keyCode === 13){
           this.login();
        }
     }
/*
    getRoles(token: string) {
        const roles = (JSON.parse(atob(token.split('.')[1]))).roles;
        console.log('Login:getRoles:roles: ' + roles);
        
        let jwtData = token.split('.')[1];
        console.log('Login:getRoles:jwtData: ' + jwtData);
        
        let decodedJwtJsonData = window.atob(jwtData);
        console.log('Login:getRoles:decodedJwtJsonData: ' + decodedJwtJsonData);
        
        let decodedJwtData = JSON.parse(decodedJwtJsonData);
        console.log('Login:getRoles:decodedJwtData: ' + decodedJwtData);
        console.log('Login:getRoles:admin: ' + decodedJwtData.roles);        

    }
*/


}
