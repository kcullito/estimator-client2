import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/_services/theme.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {

    //speedDialItems: MenuItem[];
    //showStyleMenu: boolean = false;

    constructor(
        //private themeService: ThemeService,
    ) {

    }

    ngOnInit() {
        //this.getSpeedDialItems();
    }
/*
    changeStyleMenu() {
        this.showStyleMenu = !this.showStyleMenu;
    }

    getSpeedDialItems() {
        
        this.speedDialItems = [
            {
                tooltipOptions: {
                    tooltipLabel: "Dark Blue"
                },
                icon:'pi pi-box',
                command: () => {
                    this.changeTheme('theme-bs-dark-blue');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Arya Purple"
                },
                icon:'pi pi-bell',
                command: () => {
                    this.changeTheme('theme-arya-purple');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Light Blue"
                },
                icon:'pi pi-briefcase',
                command: () => {
                    this.changeTheme('theme-bs-light-blue');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Dark Teal"
                },
                icon:'pi pi-camera',
                command: () => {
                    this.changeTheme('theme-lara-dark-teal');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Light Teal"
                },
                icon:'pi pi-car',
                command: () => {
                    this.changeTheme('theme-lara-light-teal');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Nova"
                },
                icon:'pi pi-truck',
                command: () => {
                    this.changeTheme('theme-nova');
                }
            },
            
            {
                tooltipOptions: {
                    tooltipLabel: "Saga Greem"
                },
                icon:'pi pi-apple',
                command: () => {
                    this.changeTheme('theme-saga-green');
                }
            },
            {
                tooltipOptions: {
                    tooltipLabel: "Saga Orange"
                },
                icon:'pi pi-wrench',
                command: () => {
                    this.changeTheme('theme-saga-orange');
                }
            },
        

        ];

    }

    changeTheme(theme: string) {
        this.themeService.switchTheme(theme);
    }

*/
}
