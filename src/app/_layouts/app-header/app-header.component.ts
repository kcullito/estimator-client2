import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SpeedDial } from 'primeng/speeddial';
import { first } from 'rxjs';
import { User } from 'src/app/_models/user.model';
import { StorageService } from 'src/app/_services/storage.service';
import { ThemeService } from 'src/app/_services/theme.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {

    menuItems: MenuItem[] = [];
    user: User;
    showProfileDialog: boolean = false;
    password1: string;
    password2: string;
    submitted: boolean = false;
    passwordsMatch: boolean;
    roles: string[] = [];

    validEmail: boolean = false;

    speedDialItems: MenuItem[];
    showStyleMenu: boolean = false;
    currentTheme: string;

    
    constructor(
        private storage:                StorageService,
        private router:                 Router,
        private confirmationService:    ConfirmationService,
        private messageService:         MessageService,
        private userService:            UserService,
        private themeService:           ThemeService,
        private route:                  ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.getUser();
        this.getMenuItems();
        this.getSpeedDialItems();
    }

    getUser() {
        this.user = this.storage.getUser();
        
        this.user.authorities.forEach(role => {
            this.roles.push(role.authority);
        })

    }

    logout() {
        //console.log("logout called");
        this.confirmationService.confirm({
            message: 'Are you sure you want to logout?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.storage.removeUser();
                this.router.navigate(['login']);
            }
        })
    }

    showUserProfile() {
        //console.log("showUserProfile");
        this.password1 = "";
        this.password2 = "";
        this.showProfileDialog = true;

    }


    home() {
        this.router.navigate(['home']);
    }




    /***************************************
     *                                     *
     *       RESET PASSWORD RESET          *
     *                                     *
     ***************************************/

    hideDialog() {
        this.showProfileDialog = false;
    }

    /**
     * 
     */
        validateForm() {
            this.submitted = true;
            // validate name and email
            if (
                this.user.firstname &&
                this.user.lastname
            ) 
            {
                this.validEmail = false;
                if (this.user.email) {
                    if (this.validateEmail(this.user.email)) {
                        this.validEmail = true;
                        
                        this.processPasswords();
                    } else {
                        this.validEmail = false;
                        //return;
                    }
                }
            }
        }
    
        processPasswords() {
            // validate passwords
            this.user.username = this.user.email;
            if (this.password1 && this.password1.length > 0) {
                console.log("app-header:processing passwords");
                if (this.password1 !== this.password2) {
                    //console.log("passwords don't match");
                    this.passwordsMatch = false;
                } else {
                    console.log("app-header:passwords match");
                    //console.log("passwords match for " + this.user.username);
                    this.passwordsMatch = true;
                    this.user.password = this.password1;
                    
                    this.submitted = false;
                    this.updateUser();
                    this.hideDialog();
                }
            } else {
                console.log("passwords not changed, value is " + this.user.password);
                //this.user.username = this.user.email;
                
                this.updateUser();
                this.submitted = false;
                this.hideDialog();
            }
        }
/*    
    validateForm() {
        this.submitted = true;
        if (this.password1 && this.password1.length > 0) {
            if (this.password1 !== this.password2) {
                console.log("passwords don't match");
                this.passwordsMatch = false;
            } else {
                console.log("passwords match for " + this.user.username);
                this.passwordsMatch = true;
                this.submitted = false;
                this.user.username = this.user.email;
                this.user.password = this.password1;
                
                this.userService.updateUser(this.user);
                this.hideDialog();

            }
        } else {
            console.log("passwords not changed, just save user");
            this.userService.updateUser(this.user).pipe(first()).subscribe(
                response => {
                    this.user = response.data.user;
                    //console.log(response.data.user.username);
                }
            );
            this.submitted = false;
            this.hideDialog();
        }
    }
*/

    /**
     * Validate the user entered a valid email address
     * 
     * @param email string representing the email address
     * @returns boolean representing success/failure of validation
     */
    validateEmail(email: string) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    updateUser() {
        
        this.user.username = this.user.email;
        this.storage.setUser(this.user);
        this.storage.setCurrentTheme(this.currentTheme);
        this.userService.updateUser(this.user).pipe(first()).subscribe(
            response => {
                this.user = response.data.user;
                this.user.email = this.user.username;
                this.user.token = this.storage.getToken();
//                this.storage.setUser(this.user);
                this.messageService.add({severity:'success', summary: 'Successful', detail: response.message, life: 3000});

            }
        );

    }

    getProfile() {
        

    }

    saveProfile() {

    }

    changeStyleMenu() {
        this.showStyleMenu = !this.showStyleMenu;
        this.hideDialog();
    }

    changeTheme(theme: string) {
        this.themeService.switchTheme(theme);
        this.showStyleMenu = false;
        this.currentTheme = theme;
        this.storage.setCurrentTheme(theme);
        this.user.currentTheme = theme;
        this.updateUser();
        this.hideDialog();
    }

    getSpeedDialItems() {
        
        this.speedDialItems = [
            {
                tooltipOptions: {
                    tooltipLabel: "Dark Blue"
                },
                icon:'pi pi-star-fill',
                command: () => {
                    this.changeTheme('theme-bs-dark-blue');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Light Blue"
                },
                icon:'pi pi-star',
                command: () => {
                    this.changeTheme('theme-bs-light-blue');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Dark Teal"
                },
                icon:'pi pi-heart-fill',
                command: () => {
                    this.changeTheme('theme-lara-dark-teal');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Light Teal"
                },
                icon:'pi pi-heart',
                command: () => {
                    this.changeTheme('theme-lara-light-teal');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Viva Dark"
                },
                icon:'pi pi-flag-fill',
                command: () => {
                    this.changeTheme('theme-viva-dark');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Viva Light"
                },
                icon:'pi pi-flag',
                command: () => {
                    this.changeTheme('theme-viva-light');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Nova"
                },
                icon:'pi pi-bookmark',
                command: () => {
                    this.changeTheme('theme-nova');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Rhea"
                },
                icon:'pi pi-bell',
                command: () => {
                    this.changeTheme('theme-rhea');
                }
            }

        ];

    }

    /***********************
     *                     *
     *      Main Menu      *
     *                     *
     ***********************/
    getMenuItems() {
        this.menuItems = [];
        if (this.roles.includes("USER")) {
            this.menuItems.push(
                {
                    label:'Dashboard',
                    icon:'pi pi-th-large',
                    routerLink: ['']
                },
            );
        }

        if (this.roles.includes("ESTIMATOR")) {
            this.menuItems.push(
                {
                    label:'Estimates',
                    icon:'pi pi-calculator',
                    routerLink: ['estimates']
                },
                {
                    label:'Customers',
                    icon:'pi pi-users',
                    routerLink: ['customers']
                },
                // records
                {
                    label:'Records',
                    icon:'pi pi-folder-open',
                    items:[
                        {
                            label:'Estimate Records',
                            icon:'pi pi-tags',
                            routerLink: ['estimate-records']
                        },
                        {
                            label:'Products',
                            icon:'pi pi-box',
                            routerLink: ['products']
                        },/*
                        {
                            label:'Line Items',
                            icon:'pi pi-list',
                            routerLink: ['record-types']
                        },

                        {
                            label:'Categories',
                            icon:'pi pi-copy',
                            routerLink: ['categories']
                        },
                        {
                            label:'Estimate Types',
                            icon:'pi pi-dollar',
                            routerLink: ['estimate-types']
                        },
                        {
                            label:'Estimate Statuses',
                            icon:'pi pi-question-circle',
                            routerLink: ['estimate-status']
                        },*/
                        {
                            label: 'Company',
                            icon: 'pi pi-building',
                            routerLink: ['company']
                        },
                    ]
                },

            )
        };

        if (this.roles.includes("ANALYSIS")) {
            this.menuItems.push(
                {
                    label: 'Analysis',
                    icon: 'pi pi-chart-bar',
                    items:[
                        {
                            label: 'Reports',
                            icon: 'pi pi-chart-line',
                            routerLink: ['reports']
                        },
                        {
                            label: 'Surveys',
                            icon: 'pi pi-comments',
                            routerLink: ['surveys']
                        },
                    ]
                }
            );
        }

        if (this.roles.includes("ADMIN")) {
            this.menuItems.push(
                {
                    label:'Admin',
                    icon:'pi pi-folder-open',
                    items:[
                        {
                            label:'Manage Users',
                            icon:'pi pi-user-plus',
                            routerLink: ['register']
                        },
                        {
                            label:'Manage Roles',
                            icon:'pi pi-clone',
                            routerLink: ['roles']
                        }
                    ]
                }
            );
        }


    }


}
