import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'hpi-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss'],
  providers: [NgbCarouselConfig],
})
export class SlideshowComponent implements OnInit {
  config = {
    width: '800px', //width of slides defaults to 800px
    height: '300px', //height of slides defaults to 300px
    autoPlay: false, //autoplay required or not defaults to false
    delay: 3000, // delay for autoplay
  };

  constructor(config: NgbCarouselConfig) {
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit() {}
}
