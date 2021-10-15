import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseChartDirective, Label } from "ng2-charts";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DataForChart } from "app/modules/dashboard/outside-project/model/data-for-chart.model";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { StatisticsPartnerContractService } from "app/modules/dashboard/outside-project/service/statistics-partner-contract-service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { HeightService } from "app/shared/services/height.service";

@Component({
  selector: "jhi-outside-project-zoom",
  templateUrl: "./outside-project-zoom.component.html",
  styleUrls: ["./outside-project-zoom.component.scss"]
})
export class OutsideProjectZoomComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  form: FormGroup;
  height: number;
  dataForChart: DataForChart[];
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
    }
    // animation: {
    //   onComplete() {
    //     const chartInstance = this.chart,
    //       ctx = chartInstance.ctx;
    //     ctx.textAlign = 'center';
    //     ctx.fontColor = 'black';
    //     ctx.textBaseline = 'bottom';
    //     this.data.datasets.forEach(function(dataset, i) {
    //       const meta = chartInstance.controller.getDatasetMeta(i);
    //       meta.data.forEach(function(bar, index) {
    //         const data = dataset.data[index];
    //         ctx.fillText(data, bar._model.x, bar._model.y - 5);
    //       });
    //     });
    //   }
    // }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = "bar";
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    {
      data: this.dataTotalMMUsedLK,
      label: "MM sử dụng lũy kế",
      backgroundColor: "#4472c4",
      hoverBackgroundColor: "#5C6BC0"
    },
    {
      data: this.dataTotalMMPayed,
      label: "MM đã thanh toán",
      backgroundColor: "#a5a5a5",
      hoverBackgroundColor: "#BDBDBD"
    },
    {
      data: this.dataTotalMMOwed,
      label: "MM còn nợ",
      backgroundColor: "#5b9bd5",
      hoverBackgroundColor: "#42A5F5"
    }
  ];

  MMOwed = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 15,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  constructor(
    private statisticsPartnerContractService: StatisticsPartnerContractService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private heightService: HeightService
  ) {}

  ngOnInit() {
    this.buidForm();
    this.onResize();
    this.buildChart(null);
    this.setDecimal();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      MMOwed: [""]
    });
  }
  onResize() {
    this.height = this.heightService.setMenuHeight();
  }

  setDecimal() {
    this.MMOwed = createNumberMask({ ...this.MMOwed });
  }

  onCloseAddModal() {
    this.activeModal.dismiss();
  }

  buildChart(value: number) {
    if (value === null) {
      this.statisticsPartnerContractService.fetchData().subscribe(
        res => {
          if (res.statusCode === "SUCCESS") {
            this.dataForChart = res.data;
            this.buildDataChart(this.dataForChart);
          }
        },
        error => {}
      );
    } else {
      this.statisticsPartnerContractService.fetchData(value).subscribe(
        res => {
          this.dataForChart = res.data;
          this.buildDataChart(this.dataForChart);
        },
        error => {
          this.dataForChart = null;
        }
      );
    }
  }

  buildDataChart(dataForChart: DataForChart[]) {
    this.reloadDataChart();
    for (let i = 0; i < dataForChart.length; i++) {
      this.barChartLabels.push(dataForChart[i].partnerShortName);
      this.dataTotalMMUsedLK.push(dataForChart[i].totalMMUseAccumulated); // tổng MM lũy kế
      this.dataTotalMMPayed.push(dataForChart[i].totalMMPayed); // toong MM da thanh toan
      this.dataTotalMMOwed.push(dataForChart[i].totalMMOwed); // toong MM da thanh toan
    }
    this.barChartData[0].data = this.dataTotalMMUsedLK;
    this.barChartData[1].data = this.dataTotalMMPayed;
    this.barChartData[2].data = this.dataTotalMMOwed;
    this.chart.update();
  }

  onChangeDataChart(value) {
    this.buildChart(value);
  }

  reloadDataChart() {
    this.barChartLabels = [];
    this.dataTotalMMUsedLK = [];
    this.dataTotalMMPayed = [];
    this.dataTotalMMOwed = [];
  }

  deleteZero(event) {
    const value = event.target.value;
    if (Number(value) === 0) {
      event.target.value = value.replace(value, "");
    }
  }
}
