import {Component, inject, Input} from '@angular/core';
import {Section} from "../../../service/model/section.model";
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {SectionService} from "../../../service/section.service";

@Component({
  selector: 'app-home-category',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './home-category.component.html',
  styleUrl: './home-category.component.scss'
})
export class HomeCategoryComponent {
  private router = inject(Router);
  sectionService = inject(SectionService);

  @Input() section: Section | undefined;

  isRightLink(): boolean {
    return this.router.url === '/section';
  }

  // home-category.component.ts
  linkSection(section: Section | undefined) {
    if (!section) {
      console.error('Section is undefined.'); // Debugging
      return;
    }
    console.log('Navigating with state:', section); // Debugging
    this.sectionService.setSection(section); // Store the section
    this.router.navigate(['/section'], { state: { section } });
  }

}
