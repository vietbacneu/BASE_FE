import { Component, OnInit } from "@angular/core";
import { HeightService } from "app/shared/services/height.service";

@Component({
  selector: "jhi-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.scss"]
})
export class CustomerListComponent implements OnInit {
  height: number;
  constructor(private heightService: HeightService) {}

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }
}
