import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponentComponent } from './empty-state-component/empty-state-component.component';

@NgModule({
  declarations: [EmptyStateComponentComponent],
  imports: [CommonModule],
  exports: [EmptyStateComponentComponent],
})
export class EmptyStateModule { }
