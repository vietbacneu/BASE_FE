import { Component, ViewChild, OnInit } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ApexMarkers
} from "ng-apexcharts";
import { UserGroupAddComponent } from "app/modules/system-categories/user-group-categories/user-group-add/user-group-add.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PartnerEmployeeListComponent } from "app/modules/dashboard/partner-employee/partner-employee-list/partner-employee-list.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";
import { EmployeeOfPartnerModel } from "app/core/models/outsourcing-plan/employee-of-partner.model";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { CommonService } from "app/shared/services/common.service";
import { TranslateService } from "@ngx-translate/core";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";
import { PartnerOrganizationZoomComponent } from "app/modules/dashboard/partner-organization/partner-organization-zoom/partner-organization-zoom.component";
import { PartnerEmployeeChartZoomComponent } from "app/modules/dashboard/partner-employee/partner-employee-chart-zoom/partner-employee-chart-zoom.component";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  marker: ApexMarkers;
};

@Component({
  selector: "jhi-partner-employee-chart",
  templateUrl: "./partner-employee-chart.component.html",
  styleUrls: ["./partner-employee-chart.component.scss"]
})
export class PartnerEmployeeChartComponent implements OnInit {
  form: FormGroup;
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  dataBA: number[] = [];
  dataDev: number[] = [];
  dataDevMobile: number[] = [];
  dataTester: number[] = [];
  dataShortPartnerName: string[] = [];
  page: any;
  totalItems: any;
  maxSizePage: any;
  itemsPerPage: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private profileAppraisalService: ProfileAppraisalService,
    private commonService: CommonService,
    private translateService: TranslateService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.page = 1;
    this.itemsPerPage = 10;
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadAll();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      employeeSum: [""]
    });
  }

  openModalDetail() {
    const modalRef = this.modalService.open(PartnerEmployeeListComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal"
    });
    modalRef.result.then(result => {}).catch(() => {});
  }

  drawChart() {
    this.chartOptions = {
      series: [
        {
          name: "BA",
          data: this.dataBA
        },
        {
          name: "Dev",
          data: this.dataDev
        },
        {
          name: "Dev Mobile",
          data: this.dataDevMobile
        },
        {
          name: "Tester",
          data: this.dataTester
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: this.dataShortPartnerName
      },
      legend: {
        show: true,
        position: "top", // right
        offsetY: 0,
        labels: {
          // colors: undefined,
          colors: ["#acc3e0", "#84b0e0", "#4586c2", "#467bad"],
          useSeriesColors: false
        }
      },
      fill: {
        opacity: 1,
        colors: ["#acc3e0", "#84b0e0", "#4586c2", "#467bad"]
      }
    };
  }

  loadAll() {
    const formValue = this.form.value;
    this.profileAppraisalService
      .getEmployeeOfPartner({
        page: this.page - 1,
        size: 500,
        partnerShortName: "",
        employeeSum: formValue.employeeSum === "" ? "" : formValue.employeeSum,
        devAmount: "",
        devMobileAmount: "",
        testerAmount: "",
        baAmount: ""
      })
      .subscribe(
        (res: HttpResponse<EmployeeOfPartnerModel[]>) => {
          this.dataBA = [];
          this.dataDev = [];
          this.dataDevMobile = [];
          this.dataTester = [];
          this.dataShortPartnerName = [];
          res.body["content"].forEach(obj => {
            this.dataShortPartnerName.push(obj.shortPartnerName);
            this.dataBA.push(this.coverValueNull(obj.baSum));
            this.dataDev.push(this.coverValueNull(obj.devSum));
            this.dataDevMobile.push(this.coverValueNull(obj.devMobileSum));
            this.dataTester.push(this.coverValueNull(obj.testerSum));
          });
          this.drawChart();
        },
        err => {
          this.commonService.openToastMess(
            err.error.code,
            true,
            this.translateService.instant("common.action.search")
          );
        }
      );
  }

  coverValueNull(value) {
    if (value === null) return 0;
    return value;
  }

  trimSpace(element) {
    const value = this.getValueOfField(element);
    if (value) {
      this.setValueToField(element, value.trim());
    }
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  onKeyInput(event, element) {
    const value = this.getValueOfField(element);
    let valueChange = event.target.value;

    if ("employeeSum" === element) {
      const parseStr = valueChange.split("");
      if (parseStr[0] === "0") {
        valueChange = valueChange.replace("0", "");
      } else {
        valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.INTEGER, "");
      }
    }

    if (value !== valueChange) {
      this.setValueToField(element, valueChange);
      return false;
    }
  }

  openModalZoom() {
    const modalRef = this.modalService.open(PartnerEmployeeChartZoomComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal"
    });
    modalRef.result.then(result => {}).catch(() => {});
  }
}
