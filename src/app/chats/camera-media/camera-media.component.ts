import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Observable, Subscription } from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { ChatService } from 'src/app/services/chat.service';
import { ResponseSuccess } from 'src/app/models/actions.model';

@Component({
  selector: 'app-camera-media',
  templateUrl: './camera-media.component.html',
  styleUrls: ['./camera-media.component.css']
})
export class CameraMediaComponent implements OnInit {

  // private storage = new Storage({
  //   projectId: 'lithe-timer-396713',
  //   keyFilename: '6b8cb5646e3c8172de852809206d523e3b3a9dcc'
  // });

  allowCameraSwitch = true;
  showWebcam = true;
  multipleWebcamsAvailable = false;
  deviceId!: string;
  facingMode: string = 'environment';
  error: boolean = false;
  messages: any;
  receiverId: any;
  userId: any;
  // latest snapshot
  webcamImage: WebcamImage | any = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  public chatSub: Subscription = new Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private chatService: ChatService) {
    this.userId = data.sender;
    this.receiverId = data.receiver;
  }

  ngOnInit(): void {
    this.readAvailableVideoInputs();
  }

  triggerSnapshot(): void {
    this.trigger.next();
    this.showWebcam = false;
  }

  toggleWebcam(): void {
    // Stop the webcam and release camera resources when hiding it
    if (this.showWebcam) {
      this.showWebcam = false;
      this.webcamImage = null; // Clear the current snapshot
      this.trigger.complete(); // Complete the trigger observable to stop capturing images
      this.nextWebcam.complete(); // Complete the nextWebcam observable to stop switching cameras
    } else {
      this.showWebcam = true;
      this.readAvailableVideoInputs(); // Refresh available video inputs when showing the webcam
    }
  }
  
  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      this.error = true;
      this.messages = 'User denied camera access';
    }
  }

  showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage): void {
    console.log(webcamImage);
    this.webcamImage = webcamImage;
  }

  cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
    this.readAvailableVideoInputs();
  }


  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== '') {
      result.facingMode = { ideal: this.facingMode };
    }

    return result;
  }

  private readAvailableVideoInputs() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }
  saveImagStorage(body: any){
    this.chatSub = this.chatService.sendImageRequest(body).subscribe({
      next: (res: ResponseSuccess)=>{
        console.log(res);
      },
      error: ()=>{
      }
    })
  }
  sendMsg(type: number){
    console.log(this.webcamImage);
    
    const data = {
      sender: this.userId,
      receiver: this.receiverId,
      message: this.webcamImage.imageAsDataUrl,
      type: type
    }    
      this.chatService.sendMessage(data);
  }
}
