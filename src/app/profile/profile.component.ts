import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../user.model';

declare var window: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
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
        cover_url: ''
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

  private userSub: Subscription = new Subscription;
  constructor(public authService: AuthService,
    private route: Router,
    private profileService: ProfileService) {
      this.profileService.refresh.subscribe((res)=>{
        this.getProfileInfo();
      })
   }
   userForm = new FormGroup({
    name: new FormControl({value: '', disabled: this.edit}),
    phone: new FormControl({value: '', disabled: this.edit}),
    birthdate: new FormControl({value: '', disabled: this.edit}),
    email: new FormControl({value: '', disabled: this.edit}),
    address: new FormControl({value: '', disabled: this.edit})
   });
   photoForm = new FormGroup({
    fileSource: new FormControl('')
   })
  ngOnInit(): void {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('modalRemove')
    );
    this.editModal = new window.bootstrap.Modal(
      document.getElementById('modalEdit')
    );
    this.successModal = new window.bootstrap.Modal(
      document.getElementById('editSuccess')
    );
    this.faildModel = new window.bootstrap.Modal(
      document.getElementById('editFaild')
    );
    this.getProfileInfo();
  }
  get fuser(){
    return this.userForm.controls;
  }
  get fphoto(){
    return this.photoForm.controls;
  }
  getProfileInfo(){
    this.userSub = this.profileService.profileInfo()
    .subscribe({
      next:(userDetails: Profile)=>{
        // console.log(userDetails)
        this.userData = userDetails;
        this.userForm = new FormGroup({
          name: new FormControl({value:this.userData.data.name,disabled: this.edit}),
          phone: new FormControl({value:this.userData.data.phone,disabled: this.edit}),
          birthdate: new FormControl({value:this.userData.data.birth_date,disabled: this.edit}),
          email: new FormControl({value:this.userData.data.email,disabled: this.edit}),
          address: new FormControl({value:'',disabled: this.edit})
         })
      }
    })
  }
  submitEdit(){ 
  const nameval = this.userForm.get('name')?.value;
  const emailval = this.userForm.get('email')?.value;
  const birthval = this.userForm.get('birthdate')?.value;
  const phoneval = this.userForm.get('phone')?.value;
  this.loadProfile = true;
    this.userSub = this.profileService
    .editProfile(nameval, emailval,phoneval,birthval)
    .subscribe({
      next: (res)=>{
        this.loadProfile = false;
        this.successModal.show();
        this.edit = true;
        this.changeBtn = false;

      },
      error: (err)=>{
        this.loadProfile = false;
        this.faildModel.show();
        this.edit = true;
        this.changeBtn = false;
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
    this.userSub = this.profileService.deleteAccount()
    .subscribe({
      next: res=>{
        console.log(res)
      },
      error: err=>{
        console.log(err)
      }
    })
  }
  
  public toggleFormState() {
    const state = this.edit ? 'disable' : 'enable';

    Object.keys(this.userForm.controls).forEach((formControlName) => {
        this.userForm.controls[formControlName][state](); 
    });
  }
  
  onFileChange(event:any) {
    // const reader = new FileReader();
    // reader.readAsDataURL(event.target.files[0]);
    // reader.onload=()=>{
    //   this.imageUrl = reader.result;
    // } 
    // this.userSub = this.profileService.updatePhoto(this.imageUrl).subscribe({
    //   next: res=>{
    //     console.log(res)
    //   },
    //   error: err=>{
    //     console.log(err)
    //   }
    // })
    this.imageUrl =<File>event.target.files[0]
    let imgData = new FormData();
    imgData.append('image',this.imageUrl,this.imageUrl.name)
   this.userSub = this.profileService.updatePhoto(imgData).subscribe({
      next: res=>{
        console.log(imgData) 
        console.log(res)
      },
      error: err=>{
        console.log(err)
      }
    })
  }
  upload(){
    let imgData = new FormData();
    imgData.append('image',this.imageUrl.name,this.imageUrl)
    console.log(this.imageUrl)
    // this.userSub = this.profileService.updatePhoto(imgData).subscribe({
    //   next: res=>{
    //     console.log(imgData) 
    //     console.log(res)
    //   },
    //   error: err=>{
    //     console.log(err)
    //   }
    // })
  }
  ngOnDestory() :void{ 
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
 
}
