import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseChartDirective, Label, SingleDataSet } from "ng2-charts";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { StatisticsPartnerContractService } from "app/modules/dashboard/outside-project/service/statistics-partner-contract-service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LiabilitiesPartnerPopupComponent } from "./liabilities-partner-popup/liabilities-partner-popup.component";
import { NgxSpinnerService } from "ngx-spinner";
import { LiabilitiesOutPartnerService } from "app/core/services/dashboard/liabilities-out- partner.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";
import { LiabilitiesPartnerColumnChartZoomComponent } from "app/modules/dashboard/liabilities-partner/liabilities-partner-column-chart-zoom/liabilities-partner-column-chart-zoom.component";
import { LiabilitiesPartnerCycleChartZoomComponent } from "app/modules/dashboard/liabilities-partner/liabilities-partner-cycle-chart-zoom/liabilities-partner-cycle-chart-zoom.component";

@Component({
  selector: "jhi-liabilities-partner",
  templateUrl: "./liabilities-partner.component.html",
  styleUrls: ["./liabilities-partner.component.scss"]
})
export class LiabilitiesPartnerComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  form: FormGroup;

  currencyMask = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: false,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  dataChart: any;

  /**
   * Column chart Setup
   */
  dataTotalMMUsedLK: number[] = [];
  dataTotalMMPayed: number[] = [];
  dataTotalMMOwed: number[] = [];

  public barChartOptions: ChartOptions = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    responsive: true,
    tooltips: {
      callbacks: {
        label(tooltipItem) {
          return tooltipItem.yLabel.toString().replace(".", ",");
          // return tooltipItem.yLabel.toString();
        }
      }
    },
    legend: {
      position: "bottom",
      align: "start"
    },
    layout: {
      padding: {
        bottom: 15
      }
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = "bar";
  barChartLegend = true;

  barChartData: ChartDataSets[] = [
    {
      data: this.dataTotalMMUsedLK,
      label: "Tổng MM sử dụng lũy kế",
      backgroundColor: "#70ad47",
      hoverBackgroundColor: "#66BB6A"
    },
    {
      data: this.dataTotalMMPayed,
      label: "MM đã thanh toán",
      backgroundColor: "#5b9bd5",
      hoverBackgroundColor: "#42A5F5"
    },
    {
      data: this.dataTotalMMOwed,
      label: "MM còn nợ",
      backgroundColor: "#ffc000",
      hoverBackgroundColor: "#FFD54F"
    }
  ];

  /**
   * Circle chart Setup
   * @param statisticsPartnerContractService
   */
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
      borderColor: ["#ababab"]
    }
  ];

  public pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "bottom",
      align: "start"
    },
    plugins: {
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
          if ([null, undefined, ""].indexOf(number) >= 0) {
            return data["labels"][0] + ": ";
          }
          let numSplit = ("" + number).split(".")[0];
          let count = 0;
          for (let i = numSplit.length - 1; i > 0; i--) {
            count++;
            if (count % 3 === 0) {
              numSplit = numSplit.substr(0, i) + "." + numSplit.substr(i);
              // numSplit = this.insert(numSplit, i, '.');
            }
          }
          if (("" + number).indexOf(".") >= 0) {
            numSplit += "," + ("" + number).split(".")[1];
          }
          return data["labels"][tooltipItem.index] + ": " + numSplit;
        }
      }
    }
  };

  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = "pie";
  public pieChartLegends = true;
  public pieChartPlugins = {};

  constructor(
    private statisticsPartnerContractService: StatisticsPartnerContractService,
    private modalService: NgbModal,
    private liabilitiesOutPartnerService: LiabilitiesOutPartnerService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.buidForm();
    this.getDataChart(null);
    this.setDecimal();
  }

  getDataChart(input: string) {
    // check validate
    if (input === "0" || input === "0,") {
      this.form.get("MMRemain").setValue("");
      return;
    }

    let data = null;
    if (input !== null) {
      data = {
        MMRemain: this.form.get("MMRemain").value.toString()
          ? this.form
              .get("MMRemain")
              .value.toString()
              .replace(/\./g, "")
              .replace(/\,/g, ".")
          : ""
      };
    }

    this.spinner.show();
    this.liabilitiesOutPartnerService.search(data).subscribe(res => {
      this.spinner.hide();
      this.dataChart = res.body.content;
      this.prepareDataChart();
    });
  }

  prepareDataChart() {
    this.barChartLabels = [];
    this.dataTotalMMUsedLK = [];
    this.dataTotalMMPayed = [];
    this.dataTotalMMOwed = [];
    this.pieChartLabels = [];
    this.pieChartData = [];

    for (let i = 0; i < this.dataChart.length; i++) {
      if (this.dataChart[i].out_ORG_CODE !== null) {
        // colum chart handle
        if (
          (this.dataChart[i].mmUsed !== null &&
            this.dataChart[i].mmUsed !== 0) ||
          (this.dataChart[i].mmPayed !== null &&
            this.dataChart[i].mmPayed !== 0) ||
          (this.dataChart[i].mmOwed !== null && this.dataChart[i].mmOwed !== 0)
        ) {
          this.barChartLabels.push(this.dataChart[i].out_ORG_CODE);
          this.dataTotalMMUsedLK.push(this.dataChart[i].mmUsed);
          this.dataTotalMMPayed.push(this.dataChart[i].mmPayed);
          this.dataTotalMMOwed.push(this.dataChart[i].mmOwed);
        }

        // circle chart handle
        if (
          this.dataChart[i].moneyOwed !== null &&
          this.dataChart[i].moneyOwed !== 0
        ) {
          this.pieChartLabels.push(this.dataChart[i].out_ORG_CODE);
          this.pieChartData.push(this.dataChart[i].moneyOwed);
        }
      }
    }

    this.barChartData[0].data = this.dataTotalMMUsedLK;
    this.barChartData[1].data = this.dataTotalMMPayed;
    this.barChartData[2].data = this.dataTotalMMOwed;

    this.chart.update();
  }

  /**
   * modal
   */
  openModal(show?: boolean) {
    const modalRef = this.modalService.open(LiabilitiesPartnerPopupComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal"
    });
    modalRef.componentInstance.show = show;
    modalRef.result.then(result => {}).catch(() => {});
  }

  /**
   * form
   */
  private buidForm() {
    this.form = this.formBuilder.group({
      MMRemain: [""]
    });
  }

  setDecimal() {
    this.currencyMask = createNumberMask({ ...this.currencyMask });
  }

  /**
   * open modal column chart zoom
   */
  openModalColumnZoom() {
    const modalRef = this.modalService.open(
      LiabilitiesPartnerColumnChartZoomComponent,
      {
        size: "lg",
        backdrop: "static",
        keyboard: false,
        windowClass: "custom-modal"
      }
    );
    modalRef.result.then(result => {}).catch(() => {});
  }

  /**
   * open modal cycle chart zoom
   */
  openModalCycleZoom() {
    const modalRef = this.modalService.open(
      LiabilitiesPartnerCycleChartZoomComponent,
      {
        size: "lg",
        backdrop: "static",
        keyboard: false,
        windowClass: "custom-modal"
      }
    );
    modalRef.result.then(result => {}).catch(() => {});
  }

  onTrimZero(event) {
    const value = event.target.value;
    if (value === "0,_") {
      event.target.value = value.replace("_", "");
    }
    const string = String(value).split("");
    if (value.length > 1 && Number(string[0]) === 0 && string[1] !== ",") {
      event.target.value = String(value).replace("0", "");
    }
  }
}
