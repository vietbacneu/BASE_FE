import { Component, OnInit } from "@angular/core";
import { HeightService } from "app/shared/services/height.service";

@Component({
  selector: "jhi-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  height: number;

  constructor(private heightService: HeightService) {}

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }
}
