import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs';
import { Role } from 'src/app/_models/role.model';
import { AdminService } from 'src/app/_services/admin.service';
import { RoleService } from 'src/app/_services/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
    role: Role;
    roles: Role[] = [];

    selectedRoles: Role[] = [];
    roleDialog: boolean = false;
    submitted: boolean = false;

    dialogTitle: string;

    constructor(
        private roleService:            RoleService,
        private adminService:           AdminService,
        private messageService:         MessageService,
        private confirmationService:    ConfirmationService,
    ) {}

    ngOnInit(): void {
        this.getRoles();

    }

    getRoles() {
        this.roleService.getRoles().pipe(first()).subscribe(
            response => {
                this.roles = response.data.roles;
                //this.roles.forEach(role => {console.log("role:" + role.authority)})
            }
        )
    }

    saveRole(role:Role) {
        role.authority = role.authority.toUpperCase();
        this.adminService.saveRole(role).pipe(first()).subscribe(
            response => {
                if (response.message === "Role already exists") {
                    this.messageService.add({severity:'error', summary: 'Error', detail: response.message, life: 5000})
                } else {
                    role = response.data.role;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
                }
                this.getRoles();
            }
        )
    }

    openNew() {
        this.dialogTitle = "Add New Role";
        this.role = new Role;
        this.submitted = false;
        this.roleDialog = true;
    }

    editRole(role: Role) {
        this.dialogTitle = "Edit Role";
        this.role = {...role};
        this.roleDialog = true;

    }

    deleteRole(role: Role) {

    }

    hideDialog() {
        this.roleDialog = false;
    }

    validateForm() {
        this.submitted = true;
        this.saveRole(this.role);
//        console.log("Updated Role:" + this.role.authority);
        this.roleDialog = false;
        this.submitted = false;
    }


}
