import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

const Materials = [
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
];

@NgModule({
  imports: [Materials],
  exports: [Materials],
})
export class MaterialModule {}
