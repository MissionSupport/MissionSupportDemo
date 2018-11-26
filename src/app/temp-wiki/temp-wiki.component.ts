import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-temp-wiki',
  templateUrl: './temp-wiki.component.html',
  styleUrls: ['./temp-wiki.component.css']
})
export class TempWikiComponent implements OnInit {
  general = 'Wakanda is a very technological nation. They have highly advanced healing technologies, powerful defence tech, and exceptional weaponry. Though they are powerful, Wakanda likes to isolate themselves.';
  population = 'Wakanda is home to many tribes - the leader of all tribes, though, is decided through combat. Each tribe has the right to challenge the current leader for their position once a year at the tribal meetings. Their current leader is T"challa';
  culture = 'Due to recent events involving an exiled member of one of the tribes - Wakanda has recently decided to become less isolated and share their tech with the outside world';
  travel = 'Traveling to Wakanda is nearly impossible without a proper guide and an invitation. A force field both hides and restricts access to Wakanda';
  legislation = 'Wakanda is starting to take a larger role in public policy making. The former king, father to T"challa, died at the UN meeting bombing of 2016. Since then T"challa has stepped into the former king"s role and has continued with pushing new laws';
  naturalD = 'Not many natural disasters effect Wakanda due to their protective field.';
  political = 'Politically Wakanda has been historically looked down upon because other nations were unaware of Wakanda"s power. Since the reveal of thier true power and tech- they have gotten more power. They had an attempted coupe a few years ago - but no political issues are currently ongoing internal to Wakanda';
  constructor() { }

  ngOnInit() {
  }

}
