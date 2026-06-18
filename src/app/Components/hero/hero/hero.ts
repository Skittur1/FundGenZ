import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
})
export class Hero {

  parallax =
'translate(0px,0px)';



mouseMove(event:MouseEvent){


const x =
(event.clientX / window.innerWidth - .5)
* 30;


const y =
(event.clientY / window.innerHeight - .5)
* 30;



this.parallax =
`
translate(
${x}px,
${y}px
)
`;

}


}
