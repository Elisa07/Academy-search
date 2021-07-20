import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEditComponent } from './search-edit.component';

describe('SearchEditComponent', () => {
  let component: SearchEditComponent;
  let fixture: ComponentFixture<SearchEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
