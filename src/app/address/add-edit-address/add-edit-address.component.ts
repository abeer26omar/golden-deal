import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddressesService } from 'src/app/services/addresses.service';
import { Address } from 'src/app/models/user.model';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
declare var window: any;

@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.component.html',
  styleUrls: ['./add-edit-address.component.css']
})
export class AddEditAddressComponent implements OnInit {
  edit: boolean = false;
  successAdd: any;
  faildAdd: any;
  loaderAdd:boolean = false;
  addId!: number;
  msg: string = '';
  addRes: Address = {
    data: {
      address_type: '',
      building: '',
      city: '',
      id: 0,
      is_primary: 0,
      street: '',
      title: '',
      user_id: 0
    }
  };

  private routeSub: Subscription = new Subscription;
  private addSub: Subscription = new Subscription;

  addForm = new FormGroup({
    addKind: new FormControl('',[Validators.required]),
    title: new FormControl('',[Validators.required]),
    city: new FormControl('',[Validators.required]),
    streetNo: new FormControl('',[Validators.required]),
    buildingNo: new FormControl('',[Validators.required])
  })
  constructor(private addService: AddressesService,
    private route: Router,
    private router: ActivatedRoute,
    private macService: MacPrefixService) { }
  get f() { return this.addForm.controls; }

  ngOnInit(): void {
    this.successAdd = new window.bootstrap.Modal(
      document.getElementById('successAdd'),{backdrop: this.macService.backdrop}
    );
    this.faildAdd = new window.bootstrap.Modal(
      document.getElementById('faildAdd'),{backdrop: this.macService.backdrop}
    );
    this.routeSub = this.router.params.subscribe((params: Params) => {
    this.addId = params['id'];
    if(this.route.url !== '/add'){
      this.loadEditAdd(this.addId)
      this.edit = true; 
    }
    })
}
  onSubmit(){
    const title = this.addForm.get('title')?.value;
    const addKind = this.addForm.get('addKind')?.value;
    const city = this.addForm.get('city')?.value;
    const streetNo = this.addForm.get('streetNo')?.value;
    const buildingNo = this.addForm.get('buildingNo')?.value;
    if(this.edit){
      this.loaderAdd = true
      this.addSub = this.addService
      .updateAddress(this.addId,title,addKind,city,streetNo,buildingNo)
      .subscribe({
        next: (res: ResponseSuccess)=>{
          this.loaderAdd = false;
          this.msg = res.data;
          this.successAdd.show();
          setTimeout(()=>{
            this.successAdd.hide()
            this.route.navigate(['/address'])
          },1000)
        }, 
        error: (err: HttpErrorResponse)=>{
          this.loaderAdd = false;
          if(err.error.data){
            this.msg = err.error.data;
          }else{
            this.msg = err.statusText;
          }
          this.faildAdd.show()
        }
      })

    } else{
      if (this.addForm.valid) {
        this.loaderAdd = true
        this.addSub = this.addService
        .addNewAddress(title, addKind,city,streetNo,buildingNo)
        .subscribe({
          next: (res: ResponseSuccess)=>{
            this.loaderAdd = false;
            this.msg = res.data;
            this.successAdd.show();
            this.addForm.reset();
            setTimeout(()=>{
              this.successAdd.hide()
              this.route.navigate(['/address'])
            },1000)
          },
          error: (err: HttpErrorResponse)=>{
            this.loaderAdd = false;
            if(err.error.data){
              this.msg = err.error.data;
            }else{
              this.msg = err.statusText;
            }
            this.faildAdd.show();
          }
        })
      } else{
        return;
      }
    }
  }
  loadEditAdd(id: number){
    this.addSub = this.addService.getAddress(id).subscribe({
      next: (res: Address)=>{
        this.addRes = res;
        this.addForm = new FormGroup({
          addKind: new FormControl(this.addRes.data.address_type),
          title: new FormControl(this.addRes.data.title),
          city: new FormControl(this.addRes.data.city),
          streetNo: new FormControl(this.addRes.data.street),
          buildingNo: new FormControl(this.addRes.data.building)
        })
      },
      error: (err: HttpErrorResponse)=>{
        this.loaderAdd = false;
        if(err.error.data){
          this.msg = err.error.data;
        }else{
          this.msg = err.statusText;
        }
        this.faildAdd.show()
      }
    })
  }
  ngOnDestory() :void{
    if(this.addSub){
      this.addSub.unsubscribe();
    }
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
