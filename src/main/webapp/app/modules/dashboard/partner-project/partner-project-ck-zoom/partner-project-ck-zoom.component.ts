import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseChartDirective, Label, SingleDataSet } from "ng2-charts";
import { ChartType } from "chart.js";
import { PartnerContractService } from "app/modules/dashboard/partner-project/service/partner-contract-service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HeightService } from "app/shared/services/height.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "jhi-partner-project-ck-zoom",
  templateUrl: "./partner-project-ck-zoom.component.html",
  styleUrls: ["./partner-project-ck-zoom.component.scss"]
})
export class PartnerProjectCkZoomComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  dataSearch;
  height: number;
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
    legend: { position: "left" },
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
        left: 0,
        right: 0,
        top: 50,
        bottom: 50
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
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private heightService: HeightService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.buildData(null);
    this.onResize();
  }
  onResize() {
    this.height = this.heightService.setMenuHeight();
  }
  convertDate(str) {
    const date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  onCloseAddModal() {
    this.activeModal.dismiss();
  }

  buildData(dataSearch: string) {
    // const endDate = this.datePipe.transform(dataSearch, 'yyyy-MM-dd');
    if (
      this.dataSearch === undefined ||
      this.dataSearch === "" ||
      this.dataSearch === null
    ) {
      this.partnerContractService.fetchDataCk().subscribe(
        res => {
          this.pieChartData = res.totalMMRemain;
          this.pieChartLabels = res.partnerShortName;
        },
        error => {}
      );
    } else {
      dataSearch = this.datePipe.transform(dataSearch, "dd/MM/yyyy");
      this.partnerContractService.fetchDataCk(dataSearch).subscribe(
        res => {
          this.pieChartData = res.totalMMRemain;
          this.pieChartLabels = res.partnerShortName;
        },
        error => {}
      );
    }
  }

  onChangeData(value) {
    this.buildData(value);
  }
}
