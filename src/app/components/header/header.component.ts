import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  shareContent() {
    if (navigator.share) {
      navigator.share({
        title: 'Share this ToDo List',
        text: 'This is an amazing piece of content.',
        url: window.location.href,
      })
        .then(() => console.log('Content shared successfully!'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Sharing not supported in this browser.');
    }
  }
}
