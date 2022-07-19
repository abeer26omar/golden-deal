import { Component, OnInit } from '@angular/core';
declare var window: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  deleteModal: any;
  editModal: any;
  successModal: any;
  faildModel: any;
  edit:boolean = true;
  delete:boolean = false;
  changeBtn: string = 'تعديل';
  editTitle: string = '' ;
  editSuccessTitle:string = '';
  constructor() { }

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
  }
  allowEdit(){
    this.edit = false;
    if(this.edit == false){
      this.changeBtn = 'حفظ';
    }
    this.editModal.hide();
  }
  askEdit(){
    if(this.changeBtn == 'حفظ'){
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
}
