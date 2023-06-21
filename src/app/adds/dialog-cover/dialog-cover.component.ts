import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-dialog-cover',
  templateUrl: './dialog-cover.component.html',
  styleUrls: ['./dialog-cover.component.css']
})
export class DialogCoverComponent implements OnInit, OnDestroy {
  imgSrc: any;
  load: boolean = false;
  file!: File;
  msg: string = '';
  msgErr: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private profileService: ProfileService) {
    this.imgSrc = data.imgSrc;
   } 
  private addSub: Subscription = new Subscription;
  ngOnInit(): void {
  }
  onFileChange(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc = reader.result;
    }
  }
  update(){
    this.load = true;
    let formData = new FormData();
    formData.append('cover',this.file,this.file.name);
    this.addSub = this.profileService.updateCover(formData).subscribe({
      next: (res: ResponseSuccess)=>{
        this.load = false;
        this.msg = res.data;
      },
      error: (err: HttpErrorResponse)=>{
        this.load = false;
        if(err.error.data){
          this.msgErr = err.error.data;
        }else{
          this.msgErr = err.statusText;
        }
      }
    })
  }
  ngOnDestroy() :void{
    if(this.addSub){
      this.addSub.unsubscribe()
    }
  }
}
