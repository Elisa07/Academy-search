import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../data.service";
import {Result} from "../data.service";

@Component({
  selector: 'app-search-edit',
  templateUrl: './search-edit.component.html',
  styleUrls: ['./search-edit.component.css']
})
export class SearchEditComponent implements OnInit {

  editForm!: FormGroup;
  id!:number;
  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.initForm(this.id);
  }

  private initForm(id: number) {
    console.log('Init form');
    const search: Result | undefined = this.dataService.getSearch(+id);
    if (search) {
      this.editForm = new FormGroup({
        'id': new FormControl(this.dataService.results),
        'title': new FormControl(search.titolo, Validators.required),
        'description': new FormControl(search.descrizione, Validators.required),
        'keys': new FormControl(search.chiavi, Validators.required),
        'url': new FormControl(search.url, [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])
      });
    }
    else {
      this.editForm = new FormGroup({
        /*'id': new FormControl(this.dataService.results),*/
        'title': new FormControl(null, Validators.required),
        'description': new FormControl(null, Validators.required),
        'keys': new FormControl(null, Validators.required),
        'url': new FormControl(null, [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])
      });
      }
  }

  onEditSearchItem() {
    //edit
    const postData = {
      "titolo": this.editForm.value.title,
      "descrizione": this.editForm.value.description,
      "chiavi": this.editForm.value.keys,
      "url": this.editForm.value.url
    }
    this.dataService.setResearch(this.id, postData);
  }

}
