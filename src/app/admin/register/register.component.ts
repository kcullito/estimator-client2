import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs';
import { Role } from 'src/app/_models/role.model';
import { User } from 'src/app/_models/user.model';
import { AdminService } from 'src/app/_services/admin.service';
import { RoleService } from 'src/app/_services/role.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    user:           User = new User;
    repeatPassword: string;
    users:          User[] = [];
    selectedUsers:  User[] = [];
    userDialog:     boolean;

    submitted:      boolean = false;
    validEmail:     boolean = false;
    //roles:          string[] = ['USER', 'MARKETING', 'ADMIN'];
    roleDialog:     boolean = false;

    roles:          Role[] = [];

    password1:      string;
    password2:      string;
    passwordsMatch: boolean = false;
    passwordError:  string = "";
    passwordTitle:  string = "";
    dialogTitle:    string = "";
    newUser:        boolean = false;
    emailError:     string = "";


    constructor(
        private userService:            UserService,
        private roleService:            RoleService,
        private adminService:           AdminService,
        private messageService:         MessageService,
        private confirmationService:    ConfirmationService,
    ) {}

    ngOnInit(): void {
        this.getUsers();
        this.getRoles();

    }

    openNew() {
        this.user = new User;
        //this.user.accountNonLocked = false;
        this.user.enabled = true;
        this.passwordTitle = "Create a new Password"
        this.dialogTitle = "Add new User";
        this.submitted = false;
        this.newUser = true;
        this.resetPasswordFields();
    }

    editUser(user: User) {
        this.user = {...user};
        this.user.password = '';
        this.passwordTitle = "Change Password"
        this.dialogTitle = "Profile for " + user.firstname + " " + user.lastname;
        this.newUser = false;
        this.resetPasswordFields();
    }

    resetPasswordFields() {
        this.password1 = "";
        this.password2 = "";
        this.emailError = "";
        this.passwordError = "";
        this.userDialog = true;
    }

    //comparePasswords() {
        //console.log("password1:" + this.password1 + " password2:" + this.password2);
    //}

    getUsers() {
        this.userService.getUsers().pipe(first()).subscribe(
            response => {
                this.users = response.data.users;
                this.users.forEach(user => {
                    user.email = user.username;
                    //user.authorities.forEach(role => {
                    //    console.log("getUsers:usr:" + user.username + " -Role:" + role.authority);
                    //})
                    //console.log("user:" + user.username);
                    //user.authorities.forEach(role => {
                    //    console.log("role:" + role.authority);
                    //})
                })
            }
        )
            
    }

    /**
     * 
     */
    validateForm() {
        this.submitted = true;
        // validate name and email
        if (
            this.user.firstname &&
            this.user.lastname &&
            this.user.email
        ) 
        {
            this.validEmail = false;
            this.emailError = "";
            this.passwordError = "";
                if (this.user.email) {
                if (this.validateEmail(this.user.email)) {
                    this.validEmail = true;
                    this.processPasswords();
                    //console.log("email is valid");
                } else {
                    this.validEmail = false;
                    //set email error message
                    this.emailError = "Invalid email address!";
                    //console.log("email is NOT valid");
                }
            } else {
                // set email error message
                //console.log("email is blank");
                this.emailError = "Email is required!";
            }
        }
    }

    processPasswords() {
        // validate passwords
        this.passwordError = "";
        this.user.username = this.user.email;
        if (this.newUser || (this.password1 && this.password1.length > 0)) {
            if (!this.password1) {
                this.passwordError = "Password is required!"
            } else if (this.password1 !== this.password2) {
                //console.log("passwords don't match");
                this.passwordsMatch = false;
                this.passwordError = "Passwords must match!";
            } else {
                //console.log("passwords match for " + this.user.username);
                this.passwordsMatch = true;
                this.submitted = false;
                //this.user.username = this.user.email;
                this.user.password = this.password1;
                
                this.saveUser();
            }
        } else {
            //console.log("passwords not changed, just save user");
            this.saveUser();
            this.submitted = false;
            this.userDialog = false;
        }
    }
    
    /**
     * 
     */
    saveUser() {
        //console.log("saveUser:newUser:" + this.newUser);
        //if (this.user.firstname.trim()) {
            //if (this.user.id > 0) {
            if (!this.newUser) {
                // update user
                this.user.username = this.user.email;
                this.userService.updateUser(this.user).pipe(first()).subscribe(
                    response => {
                        //console.log("saveUser:updateUser:message:" + response.message);
                        
                        this.getUsers();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: response.message, life: 3000});
                    }
                )
            
            } else {
                // save user
                this.user.username = this.user.email;
                //this.userService.saveUser(this.user).pipe(first()).subscribe(
                this.adminService.registerUser(this.user).pipe(first()).subscribe(
                    response => {
                        //console.log("saveUser:saveUser:message:" + response.message);
                        this.getUsers();
                        this.messageService.add({severity:'success', summary: 'Successful', detail: response.message, life: 3000});
                    }
                )
            }
            this.hideDialog();
            this.user = new User;
        //}
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected users?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedUsers = [];
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Selected Users Deleted', life: 3000});
            }
        });
    }

    deleteUser(user: User) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + user.firstname + ' ' + user.lastname + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.adminService.deleteUser(user.id).pipe(first()).subscribe(
                    response => {
                        let success: boolean = response.data.success;
                        //console.log("RegisterComponent::deleteUser:success:" + success);

                        if (success) {
                            this.messageService.add({severity:'success', summary: 'Successful', detail: response.message, life: 3000});
                        } else {
                            this.messageService.add({severity:'error', summary: 'Error', detail: response.message, life: 3000});
                        }
                        this.getUsers();
                    }
                )
            }
        });
    }
    
    /**
     * 
     */
    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    /**
     * 
     *  Roles
     * 
     */
    getUserRoles(user: User):string {
        let roleString: string = "";
        user.authorities.forEach(role => {
            roleString += role.authority + "  ";
        })
         return roleString;
    }

    getRoles() {
        this.roleService.getRoles().pipe(first()).subscribe(
            response => {
                this.roles = response.data.roles;
            }
        )
    }

    updateUserRoles(id: number, roles: Role[]) {
        this.adminService.updateUserRoles(id, roles).pipe(first()).subscribe(
            response => {
                this.getUsers();
            }
        )
        
    }

    manageRoles(user: User) {
        this.user = user;
        this.roles.forEach(role => {
            role.selected = false;
        })
        //this.user.authorities = [];
        //this.getRoles();
        //console.log("manageRoles:" + user.username);
        this.roles.forEach(role => {
            user.authorities.forEach(authority => {
                //console.log("manageroles::role:" + role.authority + " authority:" + authority.authority);
                if (role.id === authority.id) {
                    //console.log("roles match");
                    role.selected = true;
                //} else {
                  //  role.selected = false;
                }
            })
        })
        this.roleDialog = true;
    }



    hideRoleDialog() {
        this.roleDialog = false;
    }

    validateRoleForm() {
        this.user.authorities = [];

        this.roles.forEach(role => {
            //console.log("Role:" + role.authority + " - selected:" + role.selected);
            // add role to user
            if (role.selected) {
                this.user.authorities.push(role);
            }

            role.selected = false;
        })

        //this.user.authorities.forEach(role => {
            //console.log("validateRoleForm:" + role.authority);
        //})
        

        this.roleDialog = false;
        this.updateUserRoles(this.user.id, this.user.authorities);

    }


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



}
