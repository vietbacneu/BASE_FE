import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseChartDirective, Label, SingleDataSet } from "ng2-charts";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { StatisticsPartnerContractService } from "app/modules/dashboard/outside-project/service/statistics-partner-contract-service";
import { LiabilitiesOutPartnerService } from "app/core/services/dashboard/liabilities-out- partner.service";
import { NgxSpinnerService } from "ngx-spinner";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";

@Component({
  selector: "jhi-liabilities-partner-column-chart-zoom",
  templateUrl: "./liabilities-partner-column-chart-zoom.component.html",
  styleUrls: ["./liabilities-partner-column-chart-zoom.component.scss"]
})
export class LiabilitiesPartnerColumnChartZoomComponent implements OnInit {
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

  /**
   * Column chart Setup
   */

  dataColumnChart: any;
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

  constructor(
    private statisticsPartnerContractService: StatisticsPartnerContractService,
    private modalService: NgbModal,
    private liabilitiesOutPartnerService: LiabilitiesOutPartnerService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.buidForm();
    this.getDataChart(null);
    this.setDecimal();
  }

  onCloseModal() {
    this.activeModal.dismiss();
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
      this.dataColumnChart = res.body.content;
      this.prepareDataChart();
    });
  }

  prepareDataChart() {
    this.barChartLabels = [];
    this.dataTotalMMUsedLK = [];
    this.dataTotalMMPayed = [];
    this.dataTotalMMOwed = [];

    for (let i = 0; i < this.dataColumnChart.length; i++) {
      if (this.dataColumnChart[i].out_ORG_CODE !== null) {
        // colum chart handle
        if (
          (this.dataColumnChart[i].mmUsed !== null &&
            this.dataColumnChart[i].mmUsed !== 0) ||
          (this.dataColumnChart[i].mmPayed !== null &&
            this.dataColumnChart[i].mmPayed !== 0) ||
          (this.dataColumnChart[i].mmOwed !== null &&
            this.dataColumnChart[i].mmOwed !== 0)
        ) {
          this.barChartLabels.push(this.dataColumnChart[i].out_ORG_CODE);
          this.dataTotalMMUsedLK.push(this.dataColumnChart[i].mmUsed);
          this.dataTotalMMPayed.push(this.dataColumnChart[i].mmPayed);
          this.dataTotalMMOwed.push(this.dataColumnChart[i].mmOwed);
        }
      }
    }

    this.barChartData[0].data = this.dataTotalMMUsedLK;
    this.barChartData[1].data = this.dataTotalMMPayed;
    this.barChartData[2].data = this.dataTotalMMOwed;

    this.chart.update();
  }

  /**
   * form
   */
  private buidForm() {
    this.form = this.formBuilder.group({
      MMRemain: [""]
    });
  }

  onTrimZero(event) {
    const value = event.target.value;
    event.target.value = value.replace(/^0+/, "");
  }

  setDecimal() {
    this.currencyMask = createNumberMask({ ...this.currencyMask });
  }
}
