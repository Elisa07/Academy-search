import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
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
  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.editForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'keys': new FormControl(null, Validators.required),
      'url': new FormControl(null, [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])
    });
    if (this.dataService._results)
      this.initForm(this.id);
    else
      this.router.navigate(['search']);
  }

  private initForm(id: number) {
    console.log('Init form');
    const search: Result | undefined = this.dataService.getSearch(+id);
    if (search) {
      console.log('Search');
      this.editForm = new FormGroup({
        'title': new FormControl(search.titolo, Validators.required),
        'description': new FormControl(search.descrizione, Validators.required),
        'keys': new FormControl(search.chiavi, Validators.required),
        'url': new FormControl(search.url, [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])
      });
    }
    else {
      this.router.navigate(['search']);
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
