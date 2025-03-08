import { Injectable } from '@angular/core';
import {Section} from "./model/section.model";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private sectionSubject = new BehaviorSubject<Section | null>(null);
  section$ = this.sectionSubject.asObservable();

  setSection(section: Section) {
    this.sectionSubject.next(section);
  }

  getSection(): Section | null {
    return this.sectionSubject.value;
  }

  constructor() { }
}
