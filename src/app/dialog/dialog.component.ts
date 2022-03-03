import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';


interface Food {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  freshness = ["Brand New", "Second Hand", "Refurbished"];
  productForm !: FormGroup;
  actionBtn: string = "Save"
  prod: any;
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required]
    });
    if (this.editData) {
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);


    }

  }
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Food' },
    { value: 'pizza-1', viewValue: 'Electronic' },
    { value: 'tacos-2', viewValue: 'clothes' },
  ];


  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('Product Added Successfully');
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert("Error While Adding Product");
          }

        });
        window.location.reload();
      }
    } else {
      this.updateProduct()
    }

  }

  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
      next: (res) => {
        alert('Product Updated Successfully');
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert("Error While updating Product");
      }
    })
  }


}