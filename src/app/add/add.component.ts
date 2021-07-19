import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  addForm!: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.addForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'keys': new FormArray([]),
      'url': new FormControl(null, Validators.required)
    });
  }

  addKeyInput(): void {
    console.log('Add key');
    (<FormArray>this.addForm.get('keys')).push(
      new FormGroup({
        'key': new FormControl(null)
      })
    );
  }

  removeKey(i: number): void {
    (<FormArray>this.addForm.get('keys')).removeAt(i);
  }

  onAddSearchItem(): void {
    // Chiamare il server tramite il service

    this.initForm();
  }

  get controls(): AbstractControl[]{
    return (<FormArray>this.addForm.get('keys')).controls;
  }
}
