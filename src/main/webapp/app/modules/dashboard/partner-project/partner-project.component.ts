import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { BaseChartDirective, Label, SingleDataSet } from "ng2-charts";
import { ChartType } from "chart.js";
import "chart.piecelabel.js";
import "chartjs-plugin-piechart-outlabels";
import "hammerjs";
import "chartjs-plugin-zoom";
import { PartnerContractService } from "app/modules/dashboard/partner-project/service/partner-contract-service";
import { OrganizationCategoriesAddComponent } from "app/modules/system-categories/organization-categories/organization-categories-add/organization-categories-add.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { InvoiceSerialModel } from "app/core/models/announcement-management/invoice-serial.model";
import { PartnerEmployeeListComponent } from "app/modules/dashboard/partner-employee/partner-employee-list/partner-employee-list.component";
import { PartnerDetailComponent } from "app/modules/dashboard/partner-project/partner-detail/partner-detail.component";
import { OutsideProjectZoomComponent } from "app/modules/dashboard/outside-project/outside-project-zoom/outside-project-zoom.component";
import { PartnerProjectZoomComponent } from "app/modules/dashboard/partner-project/partner-project-zoom/partner-project-zoom.component";
import { PartnerProjectCkZoomComponent } from "app/modules/dashboard/partner-project/partner-project-ck-zoom/partner-project-ck-zoom.component";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";

@Component({
  selector: "jhi-partner-project",
  templateUrl: "./partner-project.component.html",
  styleUrls: ["./partner-project.component.scss"]
})
export class PartnerProjectComponent implements OnInit {
  pieChartLegend;
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  dataSearch;
  totalMMRemains: number[] = [];
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartLabel: Label[] = [];
  public pieChartDatas: SingleDataSet = [];
  public pieChartType: ChartType = "pie";
  public pieChartLegends = true;
  public pieChartPlugins = {};
  public pieChartOptions: any = {
    responsive: true,
    legend: { position: "bottom", align: "left" },
    maintainAspectRatio: false,
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x"
        },
        zoom: {
          enabled: true,
          mode: "x"
        }
      },
      outlabels: {
        text: "%p",
        color: "black",
        backgroundColor: "#ebebeb",
        stretch: 15,
        font: {
          minSize: 12,
          maxSize: 16
        }
      }
    },
    layout: {
      padding: {
        left: 50,
        right: 50
      }
    },
    tooltips: {
      callbacks: {
        label(tooltipItem, data) {
          const number = data["datasets"][0]["data"][tooltipItem.index];
          return (
            data["labels"][tooltipItem.index] +
            ": " +
            number.toString().replace(".", ",")
          );
        }
      }
    }
  };
  public pieChartColors: Array<any> = [
    {
      backgroundColor: [
        "#ffc000",
        "#4472c4",
        "#ed7d31",
        "#baddda",
        "#4CAF50",
        "#ffa1b5",
        "#86c7f3",
        "#ffe29a",
        "#f1f2f4",
        "#fd7e14",
        "#FFCE67",
        "#56CC9D",
        "#5bc0de",
        "#005cbf",
        "#6a71e5",
        "#6fce3f",
        "#8a6d3b",
        "#40d9ca",
        "#a94442",
        "#ffff00",
        "#c1e2b3",
        "#e95555",
        "#d0e9c6",
        "#6a71e5",
        "#005cbf"
      ],
      borderColor: ["#ffffff"]
    }
  ];

  constructor(
    private partnerContractService: PartnerContractService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.buildData(null);
  }

  formatCurrency(number) {
    if ([null, undefined, ""].indexOf(number) >= 0) {
      return "";
    }
    let numSplit = number.split(".")[0];
    let count = 0;
    for (let i = numSplit.length - 1; i > 0; i--) {
      count++;
      if (count % 3 === 0) {
        numSplit = this.insert(numSplit, i, ".");
      }
    }
    if (number.indexOf(".") >= 0) {
      numSplit += "," + number.split(".")[1];
    }
    return numSplit;
  }

  insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
  }

  convertDate(str) {
    const date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  buildData(dataSearch: string) {
    if (
      this.dataSearch === undefined ||
      this.dataSearch === "" ||
      this.dataSearch === null
    ) {
      this.partnerContractService.fetchDataDk().subscribe(
        res => {
          this.pieChartData = res.totalMMRemain;
          this.pieChartLabels = res.partnerShortName;
        },
        error => {}
      );
      this.partnerContractService.fetchDataCk().subscribe(
        res => {
          this.pieChartDatas = res.totalMMRemain;
          this.pieChartLabel = res.partnerShortName;
        },
        error => {}
      );
    } else {
      this.partnerContractService.fetchDataDk(this.dataSearch).subscribe(
        res => {
          this.pieChartData = res.totalMMRemain;
          this.pieChartLabels = res.partnerShortName;
        },
        error => {}
      );
      this.partnerContractService.fetchDataCk(this.dataSearch).subscribe(
        res => {
          this.pieChartDatas = res.totalMMRemain;
          this.pieChartLabel = res.partnerShortName;
        },
        error => {}
      );
    }
  }

  onChangeData(value) {
    this.buildData(value);
  }

  openModalZoom() {
    const modalRef = this.modalService.open(PartnerProjectZoomComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal"
    });
    modalRef.result.then(result => {}).catch(() => {});
  }

  openModalZoomCk() {
    const modalRef = this.modalService.open(PartnerProjectCkZoomComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal"
    });
    modalRef.result.then(result => {}).catch(() => {});
  }

  openModal4523(type?: string) {
    this.partnerContractService.fetchDataCk(this.dataSearch).subscribe(
      res => {
        this.pieChartDatas = res.totalMMRemain;
        this.pieChartLabel = res.partnerShortName;
      },
      error => {}
    );

    if (type === "add" || type === "update") {
      const modalRef = this.modalService.open(
        OrganizationCategoriesAddComponent,
        {
          size: "lg",
          backdrop: "static",
          keyboard: false
        }
      );
      modalRef.componentInstance.type = type;
      // modalRef.componentInstance.selectedData = selectedData;
      modalRef.result.then(result => {});
    }
  }

  openModal(type?: any, selectedData?: any) {
    const modalRef = this.modalService.open(PartnerDetailComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal"
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.selectedData = selectedData;
    modalRef.result.then(result => {}).catch(() => {});
  }
}
