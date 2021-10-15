import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { TranslateService } from "@ngx-translate/core";
import { OutsourcingPlanModel } from "app/core/models/outsourcing-plan/outsourcing-plan.model";
import { Subscription } from "rxjs";
import { JhiEventManager } from "ng-jhipster";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "app/shared/services/common.service";
import { OutsourcingPlanService } from "app/core/services/outsourcing-plan/outsourcing-plan.service";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { ProjectManagementModel } from "app/core/models/project-management/project-management.model";
import { ImportExcelOutsourcingPlanComponent } from "app/modules/outsourcing-plan/import-excel-outsourcing-plan/import-excel-outsourcing-plan.component";
import { ShareDataFromProjectService } from "app/core/services/outsourcing-plan/share-data-from-project";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { ToastService } from "app/shared/services/toast.service";
import { RejectPlanPopupComponent } from "app/modules/outsourcing-plan/reject-plan-popup/reject-plan-popup.component";
import {
  BUSINESS,
  OUTSOURCE_TYPE,
  PLAN_STATUS,
  PRODUCT
} from "app/shared/constants/param.constants";
import { ContractManagerService } from "app/core/services/contract-management/contract-manager.service";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";

@Component({
  selector: "jhi-outsourcing-plan",
  templateUrl: "./outsourcing-plan.component.html",
  styleUrls: ["./outsourcing-plan.component.scss"]
})
export class OutsourcingPlanComponent implements OnInit {
  height: number;
  form: FormGroup;
  itemsPerPage: any;
  maxSizePage: any;
  pageSize: any;
  routeData: any;
  page: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  private eventSubscriber: Subscription;

  outsourcingPlan: OutsourcingPlanModel[];
  lst = [];
  planStatusList: any;
  outsourceTypeList: any;

  currentPmCode: ProjectManagementModel;

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;
  planStatusDefault: any;

  businessUnitList: any;
  productUnitList: any;
  storage: Storage;
  //deleteStatus = ['SUCCESS', 'ELEMENT_USED', 'SYSTEM_ERROR'];

  deleteStatus = ["SUCCESS", "ELEMENT_USED", "SYSTEM_ERROR", "APPROVE_STATUS"];

  columns = [
    {
      key: 0,
      value: this.translateService.instant("outsourcingPlan.plan-code"),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant("outsourcingPlan.project-code"),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant("outsourcingPlan.project-name"),
      isShow: false
    },
    {
      key: 3,
      value: this.translateService.instant("outsourcingPlan.pm"),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant("outsourcingPlan.production-unit"),
      isShow: true
    },
    {
      key: 5,
      value: this.translateService.instant("outsourcingPlan.am"),
      isShow: false
    },
    {
      key: 6,
      value: this.translateService.instant("outsourcingPlan.business-unit"),
      isShow: false
    },
    {
      key: 7,
      value: this.translateService.instant("outsourcingPlan.start-time"),
      isShow: true
    },
    {
      key: 8,
      value: this.translateService.instant("outsourcingPlan.end-time"),
      isShow: true
    },
    {
      key: 9,
      value: this.translateService.instant("outsourcingPlan.outsourcing-type"),
      isShow: true
    },
    {
      key: 10,
      value: this.translateService.instant("outsourcingPlan.mmos"),
      isShow: false
    },
    {
      key: 11,
      value: this.translateService.instant("outsourcingPlan.human-number"),
      isShow: true,
      col: 5
    },
    {
      key: 12,
      value: this.translateService.instant("outsourcingPlan.human-required"),
      isShow: true,
      col: 4
    },
    {
      key: 13,
      value: this.translateService.instant("outsourcingPlan.sum"),
      isShow: true
    },
    {
      key: 14,
      value: this.translateService.instant("outsourcingPlan.baNumber"),
      isShow: true
    },
    {
      key: 15,
      value: this.translateService.instant("outsourcingPlan.devNumber"),
      isShow: true
    },
    {
      key: 16,
      value: this.translateService.instant("outsourcingPlan.testNumber"),
      isShow: true
    },
    {
      key: 17,
      value: this.translateService.instant("outsourcingPlan.baRequired"),
      isShow: true
    },
    {
      key: 18,
      value: this.translateService.instant("outsourcingPlan.devRequired"),
      isShow: true
    },
    {
      key: 19,
      value: this.translateService.instant("outsourcingPlan.testRequired"),
      isShow: true
    },
    {
      key: 20,
      value: this.translateService.instant("outsourcingPlan.description"),
      isShow: false
    },
    {
      key: 21,
      value: this.translateService.instant("outsourcingPlan.devMobileNumber"),
      isShow: true
    },
    {
      key: 22,
      value: this.translateService.instant("outsourcingPlan.devMobileRequired"),
      isShow: true
    }
  ];

  nonShowColumns: number[] = [11, 12];

  checkedList: OutsourcingPlanModel[] = [];

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

  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    //ThucDV-IIST modify start 29/05/2020
    private router: Router,
    private eventManager: JhiEventManager,
    //ThucDV-IIST modify end 29/05/2020
    private outsourcingPlanService: OutsourcingPlanService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private appParamsService: AppParamsService,
    private versionManagementService: VersionManagementService,
    private shareDataFromProjectService: ShareDataFromProjectService,
    private organizationCategoriesService: OrganizationCategoriesService,
    private toastService: ToastService,
    private contractManagerService: ContractManagerService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      if (data && data.pagingParams) {
        this.page = data.pagingParams.page;
        this.previousPage = data.pagingParams.page;
        this.reverse = data.pagingParams.ascending;
        this.predicate = data.pagingParams.predicate;
      }
    });
    this.storage = window.localStorage;
  }

  ngOnInit() {
    // listenning data from projectmanagement
    this.versionManagementService.currentOutsourcePlan.subscribe(data => {
      this.currentPmCode = data;
    });

    this.buidForm();
    this.onResize();
    this.getFlanStatusList();
    this.getOutsourceTypeList();
    this.getOrgList();
    this.registerChange();
    this.search(true);
    this.setDecimal();
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      planStatus: [""],
      projectManagementCode: [""],
      planCode: [""],
      outsourceType: [""],
      businessUnit: [""],
      productUnit: [""],
      startTime: [""],
      endTime: [""],
      am: ["", [Validators.maxLength(50)]],
      pm: ["", [Validators.maxLength(50)]],
      ba: [""],
      dev: [""],
      devMobile: [""],
      test: [""]
    });
    if (this.currentPmCode != null) {
      this.form
        .get("projectManagementCode")
        .setValue(this.currentPmCode.projectCode);
      this.form.get("projectManagementCode").disable();
    }
  }

  get formControl() {
    return this.form.controls;
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.transition();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    const formValue = this.form.value;
    this.search(false);
  }

  checkShowColumns(index) {
    for (const key of this.nonShowColumns) {
      if (key === index) {
        return false;
      }
    }
    return true;
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
    if (
      col.key === 13 ||
      col.key === 14 ||
      col.key === 15 ||
      col.key === 16 ||
      col.key === 21
    ) {
      this.columns[11].col =
        col.isShow === true
          ? this.columns[11].col + 1
          : this.columns[11].col - 1;
    } else if (
      col.key === 17 ||
      col.key === 18 ||
      col.key === 19 ||
      col.key === 22
    ) {
      this.columns[12].col =
        col.isShow === true
          ? this.columns[12].col + 1
          : this.columns[12].col - 1;
    }
  }

  search(isShowFirst: boolean) {
    this.spinner.show();

    // check validate
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }

    // trim space
    this.form.get("planCode").setValue(this.form.get("planCode").value.trim());
    this.form
      .get("projectManagementCode")
      .setValue(this.form.get("projectManagementCode").value.trim());
    this.form.get("am").setValue(this.form.get("am").value.trim());
    this.form.get("pm").setValue(this.form.get("pm").value.trim());

    // set show first page
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }

    const data = {
      planStatus: this.form.value.planStatus,
      projectManagementCode: this.form.get("projectManagementCode").value,
      planCode: this.form.value.planCode,
      outsourceType: this.form.value.outsourceType,
      businessUnit: this.form.value.businessUnit,
      productUnit: this.form.value.productUnit,
      am: this.form.value.am,
      pm: this.form.value.pm,
      startTime: this.form.value.startTime,
      endTime: this.form.value.endTime,
      baNumber: this.form.value.ba,
      devNumber: this.form.value.dev,
      devMobileNumber: this.form.value.devMobile,
      testNumber: this.form.value.test
    };

    const paging = {
      page: this.page - 1,
      size: this.itemsPerPage
    };

    this.outsourcingPlanService.search(data, paging).subscribe(
      res => {
        this.spinner.hide();
        this.outsourcingPlan = res.body.content;

        this.totalItems = res.body.totalElements;
      },
      error => {
        this.spinner.hide();
        this.commonService.openToastMess(
          error.error.code,
          true,
          this.translateService.instant("common.action.search")
        );
      }
    );
  }

  getFlanStatusList() {
    this.getParamList(PLAN_STATUS, "planStatus");
  }

  getOutsourceTypeList() {
    this.getParamList(OUTSOURCE_TYPE, "outsourceType");
  }

  getParamList(paramType, code) {
    this.spinner.show();
    this.appParamsService.getParamByCode(paramType).subscribe(
      res => {
        this.spinner.hide();
        if (code === "planStatus") {
          this.planStatusList = res.body;
          // this.planStatusDefault = this.planStatusList[0];
          // this.form.get('planStatus').setValue(this.planStatusDefault.paramCode);
        }
        if (code === "outsourceType") {
          this.outsourceTypeList = res.body;
        }
      },
      error => {
        this.spinner.hide();
        this.commonService.openToastMess(
          error.error.code,
          true,
          this.translateService.instant("common.action.search")
        );
      }
    );
  }

  onDelete(id) {
    // Kiểm tra xem có được xóa không
    this.outsourcingPlanService.checkDeleteOutPlan(id).subscribe(
      res => {
        // Không thể xóa
        if (
          res.body.statusCode === this.deleteStatus[1] ||
          res.body.statusCode === this.deleteStatus[2] ||
          res.body.statusCode === this.deleteStatus[3]
        )
          this.toastService.openErrorToast(
            res.body.message,
            this.translateService.instant("common.toastr.title.error")
          );
        // Có thể xóa & Mở popup
        else if (res.body.statusCode === this.deleteStatus[0]) {
          const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: "static"
          });
          modalRef.componentInstance.type = "delete";
          modalRef.componentInstance.param = this.translateService.instant(
            "projectManagement.popup.this-value"
          );
          modalRef.componentInstance.onCloseModal.subscribe(value => {
            // Đồng ý xóa
            if (value === true) {
              this.outsourcingPlanService.deleteOutPlan(id).subscribe(resp => {
                // Có lỗi xảy ra
                if (
                  resp.body.statusCode === this.deleteStatus[1] ||
                  resp.body.statusCode === this.deleteStatus[2]
                )
                  this.toastService.openErrorToast(
                    resp.body.message,
                    this.translateService.instant("common.toastr.title.error")
                  );
                // Xóa thành công
                else if (resp.body.statusCode === this.deleteStatus[0]) {
                  this.toastService.openSuccessToast(
                    this.translateService.instant(
                      "projectManagement.toast.success.delete"
                    ),
                    this.translateService.instant(
                      "projectManagement.toast.success.title"
                    )
                  );
                }
                this.search(true);
              });
            }
          });
        }
      },
      error => {
        this.toastService.openErrorToast(
          error.body.message,
          this.translateService.instant("common.toastr.title.error")
        );
      }
    );
  }

  //ThucDV-IIST modify start 29/05/2020
  openModal(type?: string) {
    if (type === "add") {
      this.router.navigate(["/outsourcing-plan-add"]);
    }
    if (type === "import") {
      const modalRef = this.modalService.open(
        ImportExcelOutsourcingPlanComponent,
        {
          size: "lg",
          windowClass: "modal-import",
          backdrop: "static",
          keyboard: false
        }
      );
      modalRef.componentInstance.type = type;
      modalRef.result
        .then(result => {
          if (result === "import") {
            this.page = 1;
            this.search(true);
          }
        })
        .catch(() => {});
      // this.router.navigate(['/import-excel-outsourcing-plan']);
    }
  }

  openModalUpdate(item?: any, type?: string) {
    this.outsourcingPlanService.getPlanById(item.id).subscribe(res => {
      const data = { actionType: type, data: res.body };
      this.shareDataFromProjectService.getDataFromList(data);
      if (
        res.body.planStatusCode === "DRAFT" ||
        res.body.planStatusCode === "REJECT"
      ) {
        this.router.navigate(["/outsourcing-plan-add"]);
      } else if (res.body.planStatusCode === "APPROVE") {
        this.router.navigate(["/outsourcing-plan-update"]);
      }
    });
  }

  registerChange() {
    this.eventSubscriber = this.eventManager.subscribe(
      "outSourcingPlan",
      response => this.search(true)
    );
  }

  //ThucDV-IIST modify end 29/05/2020

  // convert Organization name -> code
  convertOrgCombo(name, orgList) {
    for (let i = 0; i < orgList.length; i++) {
      if (orgList[i].name === name) {
        return orgList[i].id;
      }
    }
    return;
  }

  getOrgList() {
    // get product unit list
    const bodyProduct = {
      page: 0,
      size: 500,
      groupCode: PRODUCT
    };

    this.organizationCategoriesService.search(bodyProduct).subscribe(res => {
      this.productUnitList = res.data;
    });

    // get business unit list
    const bodyBusiness = {
      page: 0,
      size: 500,
      groupCode: BUSINESS
    };

    this.organizationCategoriesService.search(bodyBusiness).subscribe(res => {
      this.businessUnitList = res.data;
    });
  }

  onApprovePlan(item) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static"
    });
    modalRef.componentInstance.type = "approve";
    modalRef.componentInstance.param = this.translateService.instant(
      "projectManagement.popup.this-value"
    );
    modalRef.componentInstance.onCloseModal.subscribe(value => {
      if (value === true) {
        const body = { id: item.id };
        this.outsourcingPlanService.approvePlan(body).subscribe(
          res => {
            if (res.body.statusCode === "NOT_DRAFT") {
              this.toastService.openErrorToast(
                this.translateService.instant("common.toastr.title.error"),
                res.body.message
              );
            }
            if (res.body.statusCode === "SYSTEM_ERROR") {
              this.toastService.openErrorToast(
                this.translateService.instant("common.toastr.title.error"),
                res.body.message
              );
            }
            if (res.body.statusCode === "SUCCESS") {
              this.toastService.openSuccessToast(
                this.translateService.instant(
                  "outsourcingPlan.toast.approveSuccess"
                ),
                res.body.message
              );
              // link to actual screen
              this.openModalUpdate(item, "update");
            }
          },
          error => {
            this.toastService.openErrorToast(
              error.body.message,
              this.translateService.instant("common.toastr.title.error")
            );
          }
        );
      }
    });
  }

  onRejectPlan(item, type) {
    const modalRef = this.modalService.open(RejectPlanPopupComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.selectedData = item;
    modalRef.componentInstance.type = type;
    modalRef.result.then(result => {}).catch(() => {});
  }

  onChecked(item) {
    if (this.checkedList.length === 0) {
      this.checkedList.push(item);
      return;
    }

    for (let i = 0; i < this.checkedList.length; i++) {
      if (this.checkedList[i].id === item.id) {
        this.checkedList.splice(i, 1);
        return;
      }
    }

    this.checkedList.push(item);
  }

  createNewContract() {
    if (this.checkedList.length !== 0) {
      this.onViewOrUpdateData(this.checkedList, "create");
    } else {
      this.toastService.openErrorToast(
        "Vui lòng chọn ít nhất một kế hoạch thuê ngoài có trạng thái kế hoạch là Phê duyệt"
      );
    }
  }

  // trangnc view hiển thị xem
  onViewOrUpdateData(item: any, action: any) {
    if (action === "create") {
      const lstPush: any = [];
      const vItem: any = {};

      const listPlan: Plan[] = [];
      const planMap = new Map();

      item.forEach(element => {
        if (planMap.has(element.projectCode)) {
          listPlan.forEach(it => {
            if (it.idProject === element.projectCode) {
              const index = listPlan.findIndex(
                x => x.idProject === it.idProject
              );
              listPlan[index].planId = it.planId + "," + element.id;
            }
          });
        } else {
          listPlan.push({
            idProject: element.projectCode,
            planId: element.id + ""
          });
          planMap.set(element.projectCode, element.id);
        }
      });

      vItem.data = listPlan;

      vItem.type = action;
      this.setObject("QLDT_SEND_DATA", vItem);
      // this.contractManagerService.changeInvoice(vItem);
      // luu vao local s
      this.router.navigate(["/contract-management/create"]);

      /*
      if (item.length > 0) {


        const mySet = new Set();

        item.forEach(element => {
          mySet.add(element.idProject);
        });
        mySet.forEach(element => {
          const objj: any = {};
          const idProject = element; // id dự án
          let projectCode = ''; // mã dự án
          let projectName = ''; // tên dự án
          let planId = ','; // id kế hoạch
          let planCode = ','; // mã kế hoạch
          let lstbusinessOrgName = ''; // tên đơn vj kinh doanh
          let lstbusinessOrgId = ''; // danh sách id đơn vị kinh doanh
          let lstamId = ''; // id đầu mối kinh doanh
          let lstamName = ''; // tên đầu mối kinh doanh
          let lstproductionOrgId = ''; // danh sách id đơn vị sản xuất
          let lstproductionOrgName = ''; // danh sách tên đơn vị sản xuất
          let lstpmId = ''; // danh sách id Đầu mối kỹ thuật
          let lstpmName = ''; // danh sách tên Đầu mối kỹ thuật
          let totalMMos = 0; //
          for (let index = 0; index < item.length; index++) {
            let element = item[index];
            if (idProject === element.idProject) {
              projectCode = element.projectCode;
              projectName = element.projectName;
              planId += element.id + ',';
              planCode += element.planCode + ',';
              // đơn vị kinh doanh
              lstbusinessOrgName += element.businessUnitActual + ',';
              lstbusinessOrgId += element.idBusinessUnit + ',';
              //đầu mối kinh doanh
              lstamId += element.amId + ',';
              lstamName += element.am + ',';
              // Đơn vị sản xuất
              lstproductionOrgId += element.idProductionUnit + ',';
              lstproductionOrgName += element.productUnitActual + ',';
              // Đầu mối kỹ thuật
              lstpmId += element.pmId + ',';
              lstpmName += element.pm + ',';
              // mmOS
              totalMMos += Number(this.check1(element.mmos));
            }
            objj.idProject = idProject;
            objj.projectCode = projectCode;
            objj.projectName = projectName;
            objj.planId = planId;
            objj.planCode = planCode;

            objj.lstbusinessOrgName = ',' + lstbusinessOrgName;
            objj.lstbusinessOrgId = ',' + lstbusinessOrgId;

            objj.lstamId = ',' + lstamId;
            objj.lstamName = ',' + lstamName;

            objj.lstproductionOrgId = ',' + lstproductionOrgId;
            objj.lstproductionOrgName = ',' + lstproductionOrgName;

            objj.lstpmId = ',' + lstpmId;
            objj.lstpmName = ',' + lstpmName;
            // objj.totalAppraisedMM = this.check4(totalMMos);
            objj.totalAppraisedMM = totalMMos;
          }
          lstPush.push(objj);
        });
        vItem.data = lstPush;

        vItem.type = action;
        this.contractManagerService.changeInvoice(vItem);
        this.router.navigate(['/contract-management/create']);
      }
      */
    }
  }

  check1(data: any) {
    data = data + "";
    if (data === null || data === "null" || data === "") {
      return 0;
    } else {
      return Number(data);
    }
  }

  check4(data: any) {
    data = data + "";

    if (data === 0) {
      return Number(data);
    }

    data = data + "";
    if (data.includes(".")) {
      while (data.toString().includes(".")) {
        data = data.replace(".", ";"); // . -> ;
      }
    }

    if (data.includes(",")) {
      while (data.toString().includes(",")) {
        data = data.replace(",", ".");
      }
    }

    if (data.includes(";")) {
      while (data.toString().includes(";")) {
        data = data.replace(";", ",");
      }
    }
    return data;
  }

  formatPreShow(content: string) {
    if (window.screen.width <= 1400) {
      if (content.length > 50) return content.substring(0, 50) + "...";
      else return content;
    } else {
      if (content.length > 80) return content.substring(0, 80) + "...";
      else return content;
    }
  }

  onTrimZero(event) {
    const value = event.target.value;
    event.target.value = value.replace(/^0+/, "");
  }

  setDecimal() {
    this.currencyMask = createNumberMask({ ...this.currencyMask });
  }

  setObject(key: string, value: any): void {
    if (!value) {
      return;
    }
    this.storage[key] = JSON.stringify(value);
  }
}

export class Plan {
  idProject: string;
  planId: string;

  constructor(idProject: string, planId: string) {
    this.idProject = idProject;
    this.planId = planId;
  }
}
