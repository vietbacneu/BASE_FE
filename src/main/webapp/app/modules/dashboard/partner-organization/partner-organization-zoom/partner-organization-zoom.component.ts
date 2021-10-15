import { Component, OnInit, ViewChild } from "@angular/core";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PartnerOrganService } from "app/core/services/dashboard/partner-organ.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
// import { BaseChartDirective } from 'ng2-charts';
import * as Highcharts from "highcharts";

@Component({
  selector: "jhi-partner-organization-zoom",
  templateUrl: "./partner-organization-zoom.component.html",
  styleUrls: ["./partner-organization-zoom.component.scss"]
})
export class PartnerOrganizationZoomComponent implements OnInit {
  // @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
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
    integerLimit: 15,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };
  isModalConfirmShow = false;

  highchartsZoom = Highcharts;

  chartOptionsZoom = {
    title: "",
    values: "",
    chart: {
      renderTo: "contain",
      type: "column"
    },
    xAxis: {
      categories: []
    },
    yAxis: [
      {
        title: {
          text: ""
        },
        min: 0,
        showEmpty: false
      },
      {
        opposite: true,
        title: {
          text: ""
        },
        min: 0,
        showEmpty: false
      }
    ],

    plotOptions: {
      column: {
        stacking: "normal"
      }
    },
    tooltip: {
      shared: false,
      backgroundColor: "black",
      borderColor: "black",
      borderRadius: 10,
      color: "white",
      useHTML: true,
      borderWidth: 0,
      headerFormat: "",
      // pointFormat: '<b style="color: #fff;">{series.name}: {point.y}</b>',
      formatter() {
        if (this.y === undefined) {
          this.y = "";
        }
        return (
          '<div style="color: #fff;">' +
          this.point.name +
          "</div>" +
          '<div style="color: #fff;"> ' +
          this.series.name +
          ": " +
          this.y.toString().replace(".", ",") +
          "</div>"
        );
      }
      // pointFormatter () {
      //   return '<b style="color: #fff;">{series.name}: {point.y.toString().replace(/\\./g, \',\')}</b>';
      // }
    },

    series: []
  };

  afterData = [];

  constructor(
    private partnerOrganService: PartnerOrganService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadData();
    this.setDecimal();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      totalMmOwed: [""]
    });
  }

  loadData() {
    this.partnerOrganService
      .getAll({
        page: 0,
        size: 1000,
        totalMmOwed: this.form
          .get("totalMmOwed")
          .value.toString()
          .replace(",", ".")
          .replace(/\./g, "")
          ? this.form
              .get("totalMmOwed")
              .value.toString()
              .replace(",", ".")
              .replace(/\./g, "")
          : ""
      })
      .subscribe(res => {
        if (res) {
          this.prepareData(res);
        }
      });
  }

  coverValueNull(value) {
    if (value === null || value <= 0) return 0;
    return value;
  }

  onTrimZero(event) {
    const value = event.target.value;
    event.target.value = value.replace(/^0+/, "");
  }

  setDecimal() {
    this.currencyMask = createNumberMask({ ...this.currencyMask });
  }

  onCloseAddModal() {
    this.isModalConfirmShow = true;
    this.activeModal.dismiss();
    this.activeModal.dismiss(true);
  }

  deleteZero(event) {
    const value = event.target.value;
    if (Number(value) === 0) {
      event.target.value = value.replace(value, "");
    }
  }

  prepareData(data) {
    if (data.body.content.length === 0) {
      // Trường hợp không có data để build chart
      this.chartOptionsZoom.xAxis.categories = [""];
      this.chartOptionsZoom.series = [
        {
          showInLegend: false,
          name: "",
          color: "#6ba939",
          data: [[0]],
          stack: 1
        }
      ];
    } else {
      // Trường hợp có data để build chart
      this.afterData = [];
      this.chartOptionsZoom.xAxis.categories = [];
      this.chartOptionsZoom.series = [];
      /**
       * HungND 26/08/2020
       *
       * Sắp xếp lại data
       * input: this.data
       * output: this. afterData
       *
       * Description: đưa các object đối tác (là đối tác của đơn vị) vào mảng 'child' của chính đơn vị đó
       */
      for (let i = 0; i < data.body.content.length; i++) {
        if (
          data.body.content[i].outOrganName != null &&
          data.body.content[i].partnerId == null
        ) {
          this.afterData.push(data.body.content[i]);
          this.afterData[this.afterData.length - 1].child = [];
        }
        if (data.body.content[i].partnerShortName != null) {
          this.afterData[this.afterData.length - 1].child.push(
            data.body.content[i]
          );
        }
      }

      /**
       * HungND 01/09/2020
       * Validate: Xóa các object có tất cả các trường dữ liệu hiển thị cùng bằng 0 hoặc bằng null
       */
      let maxLength = 0;

      for (let i = 0; i < this.afterData.length; i++) {
        for (let j = 0; j < this.afterData[i].child.length; j++) {
          // Xóa các cột không có dữ liệu
          if (
            (this.afterData[i].child[j].totalMmOwed == null ||
              this.afterData[i].child[j].totalMmOwed === 0) &&
            (this.afterData[i].child[j].totalMmPayed == null ||
              this.afterData[i].child[j].totalMmPayed === 0) &&
            (this.afterData[i].child[j].totalMmUsing == null ||
              this.afterData[i].child[j].totalMmUsing === 0)
          ) {
            this.afterData[i].child.splice(j, 1);
            j--;
          }
        }

        // Nếu cả group không có dữ liệu => xóa cả group
        if (this.afterData[i].child.length === 0) {
          this.afterData.splice(i, 1);
          i--;
        }
        if (maxLength < this.afterData[i].child.length)
          maxLength = this.afterData[i].child.length;
      }

      /**
       * HungND 26/08/2020
       *
       * Chuyển dữ liệu từ this.afterData vào this.chartOptionsZoom để vẽ chart
       */

      //SyPT edit 15/09/2020
      for (let i = 0; i < maxLength; i++) {
        // element1 tương ứng với stack bên dưới
        const stackElement1 = {
          showInLegend: false,
          name: "MM còn nợ",
          color: "#ed7d31",
          data: [],
          stack: i
        };

        // element2 tương ứng với stack bên trên
        const stackElement2 = {
          showInLegend: false,
          name: "MM đã thanh toán",
          color: "#4472c4",
          data: [],
          stack: i
        };

        this.chartOptionsZoom.series.push(stackElement1);
        this.chartOptionsZoom.series.push(stackElement2);
      }

      for (let i = 0; i < this.afterData.length; i++) {
        this.chartOptionsZoom.xAxis.categories.push(
          this.afterData[i].outOrganName
        );
        for (let j = 0; j < this.afterData[i].child.length; j++) {
          this.chartOptionsZoom.series[j * 2].data[i] = [
            this.afterData[i].child[j].partnerShortName,
            this.afterData[i].child[j].totalMmOwed
          ];
          this.chartOptionsZoom.series[j * 2 + 1].data[i] = [
            this.afterData[i].child[j].partnerShortName,
            this.afterData[i].child[j].totalMmPayed
          ];
        }

        if (this.afterData[i].child.length < maxLength) {
          for (let j = this.afterData[i].child.length; j < maxLength; j++) {
            this.chartOptionsZoom.series[j * 2].data.push(["", 0]);
            this.chartOptionsZoom.series[j * 2 + 1].data.push(["", 0]);
          }
        }
      }
      //end SyPT edit

      // for (let i = 0; i < this.afterData.length; i++) {
      //   // Label Name
      //   this.chartOptionsZoom.xAxis.categories.push(this.afterData[i].outOrganName);
      //
      //   for (let j = 0; j < this.afterData[i].child.length; j++) {
      //     // element1 tương ứng với stack bên dưới
      //     const stackElement1 = {
      //       showInLegend: false,
      //       name: 'MM còn nợ',
      //       color: '#ed7d31',
      //       data: [],
      //       stack: j
      //     };
      //
      //     // element2 tương ứng với stack bên trên
      //     const stackElement2 = {
      //       showInLegend: false,
      //       name: 'MM đã thanh toán',
      //       color: '#4472c4',
      //       data: [],
      //       stack: j
      //     };
      //
      //     // Nếu group có thêm 1 cột(stack) mà các group không có
      //     // ví dụ: group 1 có 3 cột(stack), group 2 có 5 cột(stack) => thì từ cột thứ 4 trở đi sẽ vào trường hợp này!
      //     // debugger;
      //     if ((j + 1) * 2 > this.chartOptionsZoom.series.length) {
      //       this.chartOptionsZoom.series.push(stackElement1);
      //       this.chartOptionsZoom.series.push(stackElement2);
      //       for (let k = 0; k < maxLength; k++) {
      //         this.chartOptionsZoom.series[j * 2].data.push(['', 0]);
      //         this.chartOptionsZoom.series[j * 2 + 1].data.push(['', 0]);
      //       }
      //     }
      //
      //     this.chartOptionsZoom.series[j * 2].data[i] = [
      //       this.afterData[i].child[j].partnerShortName,
      //       this.afterData[i].child[j].totalMmOwed
      //     ];
      //     this.chartOptionsZoom.series[j * 2 + 1].data[i] = [
      //       this.afterData[i].child[j].partnerShortName,
      //       this.afterData[i].child[j].totalMmPayed
      //     ];
      //   }
      // }
    }

    // debugger;
    // @ts-ignore
    this.highchartsZoom.chart("contain", this.chartOptionsZoom).redraw();

    // Xóa license "HighChart.com"
    $("highcharts-chart div svg text.highcharts-credits")[0].outerHTML = "";
  }
}
