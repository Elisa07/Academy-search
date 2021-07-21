import { NgModule } from "@angular/core";

import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.components";

@NgModule({
    declarations: [
        LoadingSpinnerComponent,
    ],
    exports: [LoadingSpinnerComponent]
})
export class SharedModule { }