import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.css']
})
export class EditAddComponent implements OnInit {
  images : string[] = [];
  myForm = new FormGroup({
    agrement: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    productStatus: new FormControl('', [Validators.required]),
    productCategory: new FormControl('', [Validators.required]),
    productMark: new FormControl('', [Validators.required]),
    productName: new FormControl('', [Validators.required]),
    productPrice: new FormControl('', [Validators.required]),
    productSeller: new FormControl('', [Validators.required]),
    sellerinfo: new FormControl('', [Validators.required]),
    productDesc: new FormControl('', [Validators.required]),
    productMaterial: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  constructor(private http: HttpClient) { }
  get f(){
    return this.myForm.controls;
  }
  onFileChange(event:any) {
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
      
                reader.onload = (event:any) => {
                  console.log(event.target.result);
                   this.images.push(event.target.result); 
    
                   this.myForm.patchValue({
                      fileSource: this.images
                   });
                }
     
                reader.readAsDataURL(event.target.files[i]);
        }
    }
  }
  ngOnInit(): void {
  }
  
  submit(){
    if((this.myForm.get('agrement')?.invalid)){
      return;
    } else{
      
      if(this.myForm.valid){
          console.log('form valid')
      } else{
        console.log('form invalid')
      }
      // console.log(this.myForm);
    }
    
    // this.http.post('http://localhost:8001/upload.php', this.myForm.value)
    //   .subscribe(res => {
    //     console.log(res);
    //     alert('Uploaded Successfully.');
    //   })
  }
}
