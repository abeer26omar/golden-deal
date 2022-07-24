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
  deleteModal: any;
  editModal: any;
  successModal: any;
  faildModel: any;
  edit:boolean = true;
  delete:boolean = false;
  changeBtn: boolean = false;
  editTitle: string = '' ;
  editSuccessTitle:string = '';
  private userSub: Subscription = new Subscription;
  constructor(public authService: AuthService,
    private route: Router,
    private profileService: ProfileService ) {
   }
   userForm = new FormGroup({
    name: new FormControl({value: this.userData.data.name, disabled: this.edit}),
    phone: new FormControl({value: '', disabled: this.edit}),
    birthdate: new FormControl({value: '', disabled: this.edit}),
    email: new FormControl({value: '', disabled: this.edit}),
    gender: new FormControl({value: '', disabled: this.edit}),
    address: new FormControl({value: '', disabled: this.edit})
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
    this.getProfileInfo()
  }
  get fuser(){
    return this.userForm.controls;
  }
  setDefaultValues(){
    const userName = this.userForm.get('name')?.setValue(this.userData.data.name);
    const userEmail = this.userForm.get('email')?.setValue(this.userData.data.email);
    const userBirthDate = this.userForm.get('birthdate')?.setValue(this.userData.data.birth_date);
    const userPhone = this.userForm.get('phone')?.setValue(this.userData.data.phone);
  }
  getProfileInfo(){
    this.userSub = this.profileService.profileInfo()
    .subscribe((userDetails: Profile)=>{
      this.userData = userDetails;
      // console.log(this.userData.data);
    })
  }
  
  submitEdit(){ 
  const nameval = this.userForm.get('name')?.value;
  const emailval = this.userForm.get('email')?.value;
  const birthval = this.userForm.get('birthdate')?.value;
  const phoneval = this.userForm.get('phone')?.value;
console.log(this.userForm.value)
    // console.log(nameval,emailval,birthval,phoneval)
    // this.userSub = this.profileService
    // .editProfile(nameval, emailval,phoneval,birthval)
    // .subscribe({
    //   next: (res)=>{
    //     console.log(res)
    //       this.openSuccessModal();
    //       this.editSuccessTitle = 'تم الحفظ بنجاح';
    //   },
    //   error: (err)=>{
    //     console.log(err)
    //   }
    // })
  }
  allowEdit(){
    this.edit = false;
    this.toggleFormState()
    if(this.edit == false){
      this.changeBtn = true;
      this.openEditModal();
      this.editTitle = 'هل تريد تعديل البيانات' ; 
    }
    this.editModal.hide();
  }
  askEdit(){
    if(this.changeBtn){
      this.openSuccessModal();
      this.editSuccessTitle = 'تم الحفظ بنجاح';
    }else{
      this.openEditModal();
      this.editTitle = 'هل تريد تعديل البيانات' ;
    }
  }
  askDelete(){
    this.openEditModal();
    // this.delete = true;
    this.editTitle = 'هل تريد حذف البيانات' ;
    if(this.delete == true){
      this.editSuccessTitle = 'تم الحذف بنجاح';
      this.openSuccessModal();
    }
  }
  openDeleteModal(){
    this.deleteModal.show();
  }
  openEditModal(){
    this.editModal.show();
  }
  openFaildModel(){
    this.faildModel.show();
  }
  openSuccessModal(){
    this.successModal.show();
  }
  public toggleFormState() {
    const state = this.edit ? 'disable' : 'enable';

    Object.keys(this.userForm.controls).forEach((formControlName) => {
        this.userForm.controls[formControlName][state](); 
    });
  }
}
