import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogImageComponent } from './dialog-image/dialog-image.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Regions, ResponseSuccess } from '../models/actions.model';
import { MacPrefixService } from '../services/mac-prefix.service';
import { DatePipe } from '@angular/common';
import { ActionsService } from '../services/actions.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Router } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:[DatePipe]
})
export class ProfileComponent implements OnInit {
  userData : Profile = {
    data: {
        id: 0,
        name: '',
        email: '',
        phone: '',
        image: '',
        cover: '',
        subscribed: 0,
        is_admin: 0,
        birth_date: '',
        gender: '',
        otp: 0,
        fcm_token: null,
        email_verified_at: null,
        image_url: '',
        cover_url: '',
        region_id: 0
    }
  }
  loadProfile: boolean = false;
  deleteModal: any;
  editModal: any;
  successModal: any;
  faildModel: any;
  edit:boolean = true;
  changeBtn: boolean = false;
  imageUrl: any ;
  error: string = '';
  sucMsg: string = '';
  regions: any = [];
  private userSub: Subscription = new Subscription;
  constructor(public authService: AuthService,
    private router: Router,
    private macService: MacPrefixService,
    private profileService: ProfileService,
    private dialogRef: MatDialog,
    private datePipe: DatePipe,
    private actionService: ActionsService,
    private errorHandel: ErrorHandlerService) {
      this.profileService.refresh.subscribe(()=>{
        this.getProfileInfo();
      })
   }
   userForm = new FormGroup({
    name: new FormControl({value: '', disabled: this.edit}),
    phone: new FormControl({value: '',disabled: this.edit}),
    birthdate: new FormControl({value: '', disabled: this.edit}),
    email: new FormControl({value: '', disabled: this.edit}),
    address: new FormControl({value: '', disabled: this.edit}),
    gender: new FormControl({value: '', disabled: this.edit})
   });
    photoForm = new FormGroup({
      fileSource: new FormControl('')
   })
  ngOnInit(): void {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('modalRemove'),{backdrop: this.macService.backdrop}
    );
    this.editModal = new window.bootstrap.Modal(
      document.getElementById('modalEdit'),{backdrop: this.macService.backdrop}
    );
    this.successModal = new window.bootstrap.Modal(
      document.getElementById('editSuccess'),{backdrop: this.macService.backdrop}
    );
    this.faildModel = new window.bootstrap.Modal(
      document.getElementById('editFaild'),{backdrop: this.macService.backdrop}
    );
    this.getProfileInfo();
    this.getRegions();
  }
  get fuser(){
    return this.userForm.controls;
  }
  get fphoto(){
    return this.photoForm.controls;
  }
  getRegions(){
    this.userSub = this.actionService.getRegions().subscribe({
      next: (res: Regions) => {
        this.regions = res.data        
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  getProfileInfo(){
    this.error = '';
    this.sucMsg = '';
    this.userSub = this.profileService.profileInfo()
    .subscribe({
      next:(userDetails: Profile)=>{
        this.userData = userDetails;
        localStorage.setItem('userImage', userDetails.data.image_url)        
        this.userForm = new FormGroup({
          name: new FormControl({value:this.userData.data.name,disabled: this.edit}),
          phone: new FormControl({value:this.userData.data.phone,disabled: this.edit}),
          birthdate: new FormControl({value:this.userData.data.birth_date,disabled: this.edit}),
          email: new FormControl({value:this.userData.data.email,disabled: this.edit}),
          address: new FormControl({value:this.userData.data.region_id,disabled: this.edit}),
          gender: new FormControl({value:this.userData.data.gender, disabled: this.edit})
        })
      },
      error:(err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  submitEdit(){ 
    this.error = '';
    this.sucMsg = '';
    const nameval = this.userForm.get('name')?.value;
    const emailval = this.userForm.get('email')?.value;
    const birthval = this.datePipe.transform(this.userForm.get('birthdate')?.value,"yyyy-MM-dd");
    const phoneval = this.userForm.get('phone')?.value;
    const genderVal = this.userForm.get('gender')?.value;
    const addressVal = this.userForm.get('address')?.value;
  this.loadProfile = true;
    this.userSub = this.profileService
    .editProfile(nameval, emailval,phoneval,birthval,genderVal,addressVal)
    .subscribe({
      next: (res:ResponseSuccess)=>{
        this.loadProfile = false;
        this.sucMsg = res.data
        this.successModal.show();
        this.edit = true;
        this.changeBtn = false;
      },
      error: (err: HttpErrorResponse)=>{
        this.loadProfile = false;
        this.edit = true;
        this.changeBtn = false;
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  allowEdit(){
    this.editModal.show();
  }
  goEdit(){
    this.edit = false;
    this.toggleFormState();
    this.editModal.hide();
    this.changeBtn = true;
  }
  deleteAcc(){
    this.deleteModal.show();
  }
  confirmDel(){
    this.error = '';
    this.sucMsg = '';
    this.userSub = this.profileService.deleteAccount()
    .subscribe({
      next: (res: ResponseSuccess)=>{
        this.sucMsg = res.data
        this.successModal.show();
        setTimeout(()=>{
          this.successModal.hide();
          localStorage.clear();
          this.router.navigate(['/register'])
          setTimeout(()=>{
            window.location.reload();
          },0)
        },50)
      },
      error:(err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  public toggleFormState() {
    const state = this.edit ? 'disable' : 'enable';

    Object.keys(this.userForm.controls).forEach((formControlName) => {
        this.userForm.controls[formControlName][state](); 
    });
  }
  editImgProfile(imgSrc: string){
    this.dialogRef.open(DialogImageComponent,{
      data: {
        imgSrc: imgSrc
      }
    })
  }
  ngOnDestory() :void{ 
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
 
}
