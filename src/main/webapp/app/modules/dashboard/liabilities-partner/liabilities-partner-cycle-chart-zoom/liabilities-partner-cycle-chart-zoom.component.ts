import { Component, OnInit } from "@angular/core";
import { Label, SingleDataSet } from "ng2-charts";
import { ChartType } from "chart.js";
import { StatisticsPartnerContractService } from "app/modules/dashboard/outside-project/service/statistics-partner-contract-service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LiabilitiesOutPartnerService } from "app/core/services/dashboard/liabilities-out- partner.service";
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup } from "@angular/forms";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";

@Component({
  selector: "jhi-liabilities-partner-cycle-chart-zoom",
  templateUrl: "./liabilities-partner-cycle-chart-zoom.component.html",
  styleUrls: ["./liabilities-partner-cycle-chart-zoom.component.scss"]
})
export class LiabilitiesPartnerCycleChartZoomComponent implements OnInit {
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
      borderColor: ["#ffffff"]
    }
  ];

  public pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,

    legend: {
      position: "left",
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
        left: 0,
        right: 0,
        top: 80,
        bottom: 80
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
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.buidForm();
    this.getDataChart(null);
    this.setDecimal();
  }

  getDataChart(input: string) {
    let data = null;
    if (input !== null) {
      data = {
        MMRemain: input.replace(/\./g, "").replace(/\,/g, ".")
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
    this.pieChartLabels = [];
    this.pieChartData = [];

    for (let i = 0; i < this.dataChart.length; i++) {
      if (this.dataChart[i].out_ORG_CODE !== null) {
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
  }

  /**
   * form
   */
  private buidForm() {
    this.form = this.formBuilder.group({
      MMRemain: [""]
    });
  }

  onCloseModal() {
    this.activeModal.dismiss();
  }

  onTrimZero(event) {
    const value = event.target.value;
    event.target.value = value.replace(/^0+/, "");
  }

  setDecimal() {
    this.currencyMask = createNumberMask({ ...this.currencyMask });
  }
}
