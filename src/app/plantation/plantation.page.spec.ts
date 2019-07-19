import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantationPage } from './plantation.page';

describe('PlantationPage', () => {
  let component: PlantationPage;
  let fixture: ComponentFixture<PlantationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
