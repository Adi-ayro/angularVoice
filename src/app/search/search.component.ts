import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { statesAndDistricts } from '../data/places';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, AutoCompleteModule, ButtonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  constructor(private cdr: ChangeDetectorRef) {}
  @ViewChild('autoComplete')
  autoComplete!: AutoComplete;

  items: any[] | undefined;

  selectedItem: any;

  placeholder: string = "Select State or City";

  suggestions: string[] = [];

  cities =  statesAndDistricts;

  search(event: any) {
    if (event && event.query && typeof event.query === 'string') {
      const searchText = event.query.toLowerCase();
      console.log('search event:', event);
      this.suggestions = this.cities.flatMap(state => [...state.districts, state.state])
                                    .filter(item => item.toLowerCase().includes(searchText));
      console.log('suggestions:', this.suggestions);
      this.cdr.detectChanges();
      this.autoComplete.show();
    } else {
      console.error('Invalid search event:', event);
    }
  }

  change: boolean = false;
  results: string = "";

  startListening() {
    this.placeholder = "Start Speaking";
    // let voiceHandler = this.hiddenSearchHandler?.nativeElement;
    if ('webkitSpeechRecognition' in window) {
      const { webkitSpeechRecognition }: any = window as any;
      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = false;
      vSearch.interimresults = false;
      vSearch.lang = 'en-US';
      vSearch.start();
      vSearch.onresult = (e: { results: { transcript: string; }[][]; }) => {
        console.log(e);
        // voiceHandler.value = e?.results[0][0]?.transcript;
        this.results = e.results[0][0].transcript;
        console.log(this.results);
        console.log(typeof(this.results))
        this.placeholder = "Select State or City";
        this.cdr.detectChanges();
        this.search({ query: this.results });
        vSearch.stop();
      };
    } else {
      alert('Your browser does not support voice recognition!');
    }
  }

  refresh(){
    this.results = "";
    this.placeholder = "Select State or City";
    this.cdr.detectChanges();
  }
}
