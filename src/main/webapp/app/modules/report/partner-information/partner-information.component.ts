import { Component, OnInit } from "@angular/core";
import { HeightService } from "app/shared/services/height.service";

@Component({
  selector: "jhi-partner-information",
  templateUrl: "./partner-information.component.html",
  styleUrls: ["./partner-information.component.scss"]
})
export class PartnerInformationComponent implements OnInit {
  height: number;
  constructor(private heightService: HeightService) {}

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }
}
