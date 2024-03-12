import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';

@Component({
  selector: 'app-camera-media',
  templateUrl: './camera-media.component.html',
  styleUrls: ['./camera-media.component.css']
})
export class CameraMediaComponent implements OnInit {

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public facingMode: string = 'environment';
  error: boolean = false;
  public messages: any;

  // latest snapshot
  public webcamImage: WebcamImage | null = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  // constructor(private dialogRef: MatDialog){}

  public ngOnInit(): void {
    this.readAvailableVideoInputs();
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.showWebcam = false;
  }

  public toggleWebcam(): void {
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
  
  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      this.error = true;
      this.messages = 'User denied camera access';
    }
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.log(webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
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
}
