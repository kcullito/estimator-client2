import { Injectable } from '@angular/core';
import { User } from '../_models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

    constructor() { }

    getUser(): User {
        let user = new User();
        user = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
        let token = user.token;
        return user;
    }

    getToken() {
        let user: User = this.getUser();
        if (user) {
            return user.token;
        }
        return '';
    }

    validToken() {
        let user = this.getUser();
        return this.tokenExpired(user.token);
    }

    setUser(user: User) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    removeUser() {
        localStorage.removeItem('currentUser');
        //localStorage.clear();
    }

    private tokenExpired(token: string) {
        if (token) {
            const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
            return (Math.floor((new Date).getTime() / 1000)) < expiry;
        } else {
            return true;
        } 
    }

    setCurrentTheme(theme: string) {
        localStorage.setItem('currentTheme', theme);
    }

    getCurrentTheme() {
        return localStorage.getItem('currentTheme');
    }

}
