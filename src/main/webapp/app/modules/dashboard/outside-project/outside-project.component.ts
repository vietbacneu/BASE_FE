import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import { Label } from "ng2-charts";

import { BaseChartDirective } from "ng2-charts";
import { DataForChart } from "app/modules/dashboard/outside-project/model/data-for-chart.model";
import { StatisticsPartnerContractService } from "app/modules/dashboard/outside-project/service/statistics-partner-contract-service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DetailComponent } from "app/modules/dashboard/outside-project/detail/detail.component";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { PartnerEmployeeChartZoomComponent } from "app/modules/dashboard/partner-employee/partner-employee-chart-zoom/partner-employee-chart-zoom.component";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { FormBuilder, FormGroup } from "@angular/forms";
import { OutsideProjectZoomComponent } from "app/modules/dashboard/outside-project/outside-project-zoom/outside-project-zoom.component";

@Component({
  selector: "jhi-outside-project",
  templateUrl: "./outside-project.component.html",
  styleUrls: ["./outside-project.component.scss"]
})
export class OutsideProjectComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  form: FormGroup;
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
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.buidForm();
    this.buildChart(null);
    this.setDecimal();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      MMOwed: [""]
    });
  }

  setDecimal() {
    this.MMOwed = createNumberMask({ ...this.MMOwed });
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
  deleteZeroFirst(event) {
    const valueChange = event.target.value;
    const parseStr = valueChange.split("");
    if (parseStr[0] === "0") event.target.value = valueChange.replace("0", "");
  }

  reloadDataChart() {
    this.barChartLabels = [];
    this.dataTotalMMUsedLK = [];
    this.dataTotalMMPayed = [];
    this.dataTotalMMOwed = [];
  }

  openModal(type?: string, selectedData?: any) {
    if (type === "detail") {
      const modalRef = this.modalService.open(DetailComponent, {
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

  openModalZoom() {
    const modalRef = this.modalService.open(OutsideProjectZoomComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal"
    });
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
  deleteZero(event) {
    const value = event.target.value;
    if (Number(value) === 0) {
      event.target.value = value.replace(value, "");
    }
  }
}
