import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-upload',
    standalone: true,
    templateUrl: './upload.component.html',
    imports: [FormsModule, CommonModule] // Added CommonModule
})
export class UploadComponent {
    selectedFile: File | null = null;
    caption: string = '';
    isUploading = false; // For showing a loader
    uploadSuccess: boolean | null = null; // Success or failure indicator

    constructor(private http: HttpClient) {}

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    uploadPost() {
        if (!this.selectedFile) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", this.selectedFile);
        formData.append("caption", this.caption);

        this.isUploading = true; // Show loading state
        this.uploadSuccess = null;

        this.http.post("https://instabe-8qlv.onrender.com/upload", formData, { withCredentials: true })
            .subscribe({
                next: (response) => {
                    console.log("Upload successful", response);
                    this.uploadSuccess = true;
                    this.caption = "";
                    this.selectedFile = null;
                },
                error: (error) => {
                    console.error("Upload failed", error);
                    this.uploadSuccess = false;
                },
                complete: () => {
                    this.isUploading = false; // Hide loading state
                }
            });
    }
}
