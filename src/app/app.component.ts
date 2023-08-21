import { Component } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { ThemeService } from './_services/theme.service';
import { StorageService } from './_services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

    defaultTheme: string = 'theme-bs-dark-blue';
    currentTheme: string = 'theme-bs-dark-blue';

    constructor(
        private primengConfig: PrimeNGConfig,
        private themeService: ThemeService,
        private storage: StorageService,

    ) {

    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.setCurrentTheme();
    }

    setCurrentTheme() {
        this.currentTheme = this.storage.getCurrentTheme();
        if (this.currentTheme != undefined && this.currentTheme.length > 1) {
            this.themeService.switchTheme(this.currentTheme);
        } else {
            this.themeService.switchTheme(this.defaultTheme);
        }
    }


}
