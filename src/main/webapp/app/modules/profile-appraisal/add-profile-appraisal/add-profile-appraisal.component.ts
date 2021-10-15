import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { Router } from "@angular/router";
import { v4 as uuid } from "uuid";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import {
  REGEX_PATTERN,
  REGEX_REPLACE_PATTERN
} from "app/shared/constants/pattern.constants";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "app/shared/services/common.service";
import { HttpResponse } from "@angular/common/http";
import { AppParamModel } from "app/core/models/profile-management/app-param.model";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { Subject, Subscription } from "rxjs";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { DownloadService } from "app/shared/services/download.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DateTimeModel } from "app/core/models/base.model";
import { DataFormatService } from "app/shared/services/data-format.service";
import { FileAttachmentService } from "app/core/services/outsourcing-plan/file-attachment.service";
import { UploadFileComponent } from "app/shared/components/upload-file/upload-file.component";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "jhi-add-profile-appraisal",
  templateUrl: "./add-profile-appraisal.component.html",
  styleUrls: ["./add-profile-appraisal.component.scss"]
})
export class AddProfileAppraisalComponent implements OnInit, OnDestroy {
  @Input() type;
  isEditTab1: boolean;
  isEditTab2: boolean;
  isEditTab3: boolean;
  isEditTab4: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  @ViewChild("tabset") tabset;
  commonProfileUUID: string = uuid();
  isModalConfirmShow = false;
  // paging nguon luc doi tác
  currentPage3 = 1;
  numberPerPage3 = 5;
  pageList3: any[] = [];
  numberOfPages3 = 0;
  numRecord3 = 0;
  arrNumberOfPages3;
  // paging nguon luc doi tác
  currentPage1 = 1;
  numberPerPage1 = 5;
  pageList1: any[] = [];
  numberOfPages1 = 0;
  numRecord1 = 0;
  arrNumberOfPages1;
  form: FormGroup;
  height: number;
  dem = 0;
  years: number[] = [];
  trainingProList: number[] = [];
  yy: number;

  groupPartnerSearch;
  categoryPartnerList = [];
  registeredBusinessLinesList = [];
  cityList = [];
  levelOfGrowthList = [];
  projectToolList = [];
  measuresList = [];
  reportMechanismList = [];
  eduProgramList = [];
  // data list tab view
  // hop dong tuong tu
  similarContractsList: any[] = [];
  similarContractsList2: any[] = [];
  similarContractsBackup: any;
  // nang luc tai chinh
  finacialCapacityList: any[] = [];
  finacialCapacityBackup: string;
  // nguon luc doi tac
  partnerResourceList: any[] = [];
  partnerResourceList2: any[] = []; // show list paging
  partnerResourceBackup: string;
  totalRevenue = 0;
  totalProfitBeforeTax = 0;
  totalScoreEvaluation = "";
  errTotalScoreEvaluation = false;
  errorTotalScoreContract = "";
  private subscription: Subscription;
  eventSubscriber: Subscription;

  // check data thay doi
  formValue;
  listValue = [];
  noProfileChecked = false;
  isYearDisable = false;
  isYear = false;

  // thêm mới
  file: any;
  @ViewChild("fileImport", { static: false }) fileImport: UploadFileComponent;
  @ViewChild("template", { static: true }) templateRef: TemplateRef<any>;
  importResult = false;
  listStatus: any = [];
  errImport = false;
  successImport = false;
  listUsers: any[] = [];
  listUserHandle: any[] = [];
  listOrganization: any[] = [];
  successMessage;
  errMessage;
  validMaxSize = 5;
  dataFileResultExcel: any;
  modalRef: BsModalRef;
  errorRecord = 0;
  currentProfile;
  startDateValidate = false;
  endDateValidate = false;

  regexReplaceSeparate;
  regexReplacePoint;
  debouncer: Subject<string> = new Subject<string>();
  partnerCode: string;
  codePartnerIsExist: string;
  totalScore = "0";

  // ThucDV modify end 29/06/2020
  constructor(
    private formBuilder: FormBuilder,
    private heightService: HeightService,
    private route: Router,
    private modalService: NgbModal,
    private bsModalService: BsModalService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private profileAppraisalService: ProfileAppraisalService,
    private versionManagementService: VersionManagementService,
    private organizationCategoriesService: OrganizationCategoriesService,
    private router: Router,
    private appParamsService: AppParamsService,
    private downloadService: DownloadService,
    private commonUtils: CommonUtils,
    private spinner: NgxSpinnerService,
    private dataFormatService: DataFormatService,
    private titleService: Title,
    private fileAttachmentService: FileAttachmentService
  ) {}

  ngOnInit() {
    this.onResize();
    this.isEditTab1 = false;
    this.isEditTab2 = false;
    this.subscription = this.profileAppraisalService.currentProfile.subscribe(
      profile => {
        if (profile === null) {
          this.router.navigate(["/profile-management"]);
        } else if (profile) {
          if (profile.type === "update") {
            this.type = "update";
            this.currentProfile = profile;
            this.buildForm();
          } else if (profile.type === "preview") {
            this.type = "preview";
            this.currentProfile = profile;
            this.buildForm();
          }
          // set title
          if (profile.type === "update")
            this.titleService.setTitle(
              this.translateService.instant("profileAppraisal.titleUpdate")
            );
          else if (profile.type === "preview")
            this.titleService.setTitle(
              this.translateService.instant("profileAppraisal.titleDetail")
            );
          else
            this.titleService.setTitle(
              this.translateService.instant("profileAppraisal.titleAdd")
            );
          // this.getSumFinancialCapacity(this.validateListIsNull(this.currentProfile.finacialCapacityList));
          // if (this.currentProfile.totalScoreEvaluation === null) {
          //   this.totalScoreEvaluation = '';
          // }
          this.searchUserRequest(profile.userRequestName);
          this.searchUserHandle(profile.handlerName);
          this.searchOrganization(profile.organizationRequestName);
        } else {
          this.type = "add";
          this.buildForm();
        }
      }
    );
    this.listStatus = [
      {
        id: 1,
        name: "Draft"
      },
      {
        id: 2,
        name: "New"
      },
      {
        id: 3,
        name: "Pending"
      },
      {
        id: 4,
        name: "Approve"
      }
      // , {
      //   id: 5,
      //   name: 'Close'
      // }, {
      //   id: 6,
      //   name: 'Rejected'
      // }
    ];
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.profileAppraisalService.changeProfile(null);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [""],
      code: [""],
      userRequest: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ],
      organizationRequest: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(20)])
      ],
      profileTitle: ["", Validators.required],
      srCode: [null, Validators.required],
      appName: ["", Validators.required],
      appCode: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: ["", Validators.required],
      handler: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(255)])
      ],
      file: null,
      status: [1, Validators.required]
    });

    if (
      this.currentProfile &&
      (this.type === "update" || this.type === "preview")
    ) {
      this.form.patchValue(this.currentProfile);
      this.arrPage1();
      this.loadList1();
      this.arrPage3();
      this.loadList3();
      this.setValueOfForm(this.form.value);
    }
  }

  validateListIsNull(list) {
    if (list === null) {
      return [];
    } else {
      return list;
    }
  }

  /**
   * huyenlt 17062020
   *
   * edit data combobox
   */

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  switchTab() {
    this.tabset.select("tabCommonInfo");
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  onDateChange(date: any) {}

  customSearchFn(term: string, item: any) {
    const replacedKey = term.replace(REGEX_PATTERN.SEARCH_DROPDOWN_LIST, "");
    const newRegEx = new RegExp(replacedKey, "gi");
    const purgedPartnerGroup = item.name.replace(
      REGEX_PATTERN.SEARCH_DROPDOWN_LIST,
      ""
    );
    return newRegEx.test(purgedPartnerGroup);
  }

  searchUserRequest(event) {
    if (event) {
      this.versionManagementService
        .getUserList(0, 50, event)
        .subscribe((res: HttpResponse<AppParamModel[]>) => {
          if (res) {
            this.listUsers = res.body["data"].map(i => {
              i.name = i.name + " - " + i.email;
              return i;
            });
          } else {
            this.listUsers = [];
          }
        });
    }
  }

  searchUserHandle(event) {
    if (event) {
      this.versionManagementService
        .getUserList(0, 50, event)
        .subscribe((res: HttpResponse<AppParamModel[]>) => {
          if (res) {
            this.listUserHandle = res.body["data"].map(i => {
              i.name = i.name + " - " + i.email;
              return i;
            });
          } else {
            this.listUserHandle = [];
          }
        });
    }
  }

  searchOrganization(event) {
    if (event) {
      this.organizationCategoriesService
        .getAllCodeOrName({
          name: event,
          type: ""
        })
        .subscribe(res => {
          if (res) {
            this.listOrganization = res.body["content"];
          } else {
            this.listOrganization = [];
          }
        });
    }
  }

  changePartnerCategory(event) {
    if (event) {
      this.setValueToField("partnerCategory", event.id);
    }
  }

  changePosition(event) {
    if (event) {
      this.setValueToField("position", event.id);
    }
  }

  onClearUserRequest(type) {
    if (type === 1) {
      this.listUsers = [];
    }
  }

  onClearOrganization(type) {
    if (type === 1) {
      this.listOrganization = [];
    }
  }

  onSubmit() {
    // console.log("da vao");
    if (this.type === "add") {
      if (!this.file) {
        this.errImport = true;
        this.successImport = false;
        this.errMessage = this.translateService.instant(
          "common.import.error.notChooseFile"
        );
      }
    }
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }
    if (this.type === "add") {
      if (!this.file) {
        return;
      }
    }

    if (!this.file) {
      if (CommonUtils.tctGetFileSize(this.file) > this.validMaxSize) {
        this.errImport = true;
        this.successImport = false;
        this.errMessage = this.translateService.instant(
          "common.import.error.exceedMaxSize"
        );
        return;
      }
    }

    this.spinner.show();
    const formData: FormData = new FormData();
    formData.append("code", this.form.value.code);
    formData.append("id", this.form.value.id);
    formData.append("userRequest", this.form.value.userRequest);
    formData.append("organizationRequest", this.form.value.organizationRequest);
    formData.append("profileTitle", this.form.value.profileTitle);
    formData.append("status", this.form.value.status);
    formData.append("srCode", this.form.value.srCode);
    formData.append(
      "startDate",
      this.dataFormatService.parseTimestampToDate(this.form.value.startDate)
    );
    formData.append(
      "endDate",
      this.dataFormatService.parseTimestampToDate(this.form.value.endDate)
    );
    formData.append("handler", this.form.value.handler);
    formData.append("appCode", this.form.value.appCode);
    formData.append("appName", this.form.value.appName);

    if (this.file == null && this.currentProfile != null) {
      formData.append("filePath", this.currentProfile.filePath);
      formData.append("filePathResult", this.currentProfile.filePathResult);
    } else {
      formData.append("file", this.file);
    }

    const apiCall = this.profileAppraisalService.save(formData);
    apiCall.subscribe(
      res => {
        if (res.status === STATUS_CODE.SUCCESS) {
          const status = Number(res.headers.get("status"));
          if (status === 2) {
            //this.dataFileResultExcel = res;
            //this.importResult = true;
            //this.errImport = true;
            //this.successImport = false;
            this.errMessage = this.translateService.instant(
              "common.import.error.resultImportFalse"
            );
          } else {
            this.dataFileResultExcel = res;
            this.errorRecord = Number(res.headers.get("errorRecord"));
            if (this.type === "add") {
              this.toastService.openSuccessToast(
                this.translateService.instant(
                  "profileAppraisal.toastr.messages.success.add"
                ),
                this.translateService.instant(
                  "profileAppraisal.toastr.messages.success.title"
                )
              );
            }
            if (this.type === "update") {
              this.toastService.openSuccessToast(
                this.translateService.instant(
                  "profileAppraisal.toastr.messages.success.update"
                ),
                this.translateService.instant(
                  "profileAppraisal.toastr.messages.success.title"
                )
              );
            }

            if (res.body.size !== 0) {
              this.modalRef = this.bsModalService.show(this.templateRef, {});
            } else {
              window.history.back();
            }
          }
          this.spinner.hide();
        }
      },
      err => {
        if (err.status === STATUS_CODE.BAD_REQUEST) {
          this.commonUtils.parseErrorBlob(err).subscribe(rs => {
            this.errMessage = rs.message;
          });
          this.errImport = true;
          this.successImport = false;
          this.errMessage = err.error.data
            ? err.error.data
            : this.translateService.instant("common.import.error.default");
        } else {
          this.toastService.openErrorToast(
            this.translateService.instant("user.toastr.messages.error.add"),
            this.translateService.instant("common.toastr.title.error")
          );
        }
        this.spinner.hide();
      }
    );
  }

  // them moi doi tuong trien grids
  onAddRowGrid(tab) {
    if (tab === 1) {
      if (this.isEditTab1) {
        return;
      }
      // start chuyển về page đầu tiên
      this.currentPage1 = 1;
      this.arrPage1();
      this.loadList1();
      // end chuyển về page đầu tiên
      this.isEditTab1 = true;
      const obj = {
        customerName: "",
        customerAddress: "",
        customerPhoneNumber: "",
        contractName: "",
        dateSignContract: "",
        dateEndContract: "",
        productProvider: "",
        contractValue: "",
        implementationScale: "",
        bidParticipants: "",
        moreInfo: "",
        staffEvaluation: "",
        scoreEvaluation: "",
        note: "",
        contractNum: "",
        status: false,
        id: null
      };
      this.similarContractsList.unshift(obj);
      this.similarContractsList2.unshift(obj);
    } else if (tab === 2) {
      if (this.isEditTab2) {
        return;
      }
      this.isEditTab2 = true;
      const obj = {
        year: "",
        totalAssets: "",
        totalLiabilities: "",
        shortTermAssets: "",
        totalCurrentLiabilities: "",
        revenue: "",
        profitBeforeTax: "",
        profitAfterTax: "",
        moreInfo: "",
        staffEvaluation: "",
        scoreAssessment: "",
        note: "",
        partnerCapacityProfileId: "",
        status: false,
        id: null
      };
      this.finacialCapacityList.unshift(obj);
      if (this.finacialCapacityList.length > 0) {
      }
    }
  }

  // sua doi tuong tren grid
  /**
   *
   * @param tab: 1- cac hop dong tuong tu; 2- nang luc tai chinh; 3- nguon luc doi tac; 4- Tong nhan su san xuat
   * 5- tong nhan su san sang tham gia du an VTS; 6- nang luc quan ly chat luong; 7- nang luc bao mat ATTT
   * @param idx
   */
  onEditGrid(tab, idx) {
    if (tab === 1) {
      const idx2 = (this.currentPage1 - 1) * this.numberPerPage1 + idx;
      if (this.isEditTab1) {
        return;
      }
      this.isEditTab1 = true;
      this.similarContractsList[idx2].status = false;
      this.similarContractsBackup = JSON.parse(
        JSON.stringify(this.similarContractsList[idx2])
      );
    } else if (tab === 2) {
      if (this.isEditTab2) {
        return;
      }
      this.isEditTab2 = true;
      this.finacialCapacityList[idx].status = false;
      this.finacialCapacityBackup = JSON.parse(
        JSON.stringify(this.finacialCapacityList[idx])
      );
    } else if (tab === 3) {
      const idx2 = (this.currentPage3 - 1) * this.numberPerPage3 + idx;
      if (this.isEditTab3) {
        return;
      }
      this.isEditTab3 = true;
      this.partnerResourceList2[idx2].status = false;
      this.partnerResourceBackup = JSON.parse(
        JSON.stringify(this.partnerResourceList2[idx2])
      );
    }
  }

  // luu doi tuong trien grid
  /**
   * dodv 05062020
   * @param tab 1- cac hop dong tuong tu; 2- nang luc tai chinh; 3- nguon luc doi tac; 4- Tong nhan su san xuat
   * 5- tong nhan su san sang tham gia du an VTS; 6- nang luc quan ly chat luong; 7- nang luc bao mat ATTT
   * @param idx
   */

  checkValidations(item, propertyObj) {
    if (
      (!item[propertyObj["0"]] && item[propertyObj["0"]] === "") ||
      item[propertyObj["0"]] === null
    ) {
      item[propertyObj["1"]] = true;
      return "1";
    } else {
      item[propertyObj["1"]] = false;
      return "0";
    }
  }

  onSaveGrid(tab, idx, item) {
    if (tab === 1) {
      const idx2 = (this.currentPage1 - 1) * this.numberPerPage1 + idx;
      this.similarContractsBackup = "";
      let dem = "iist";
      const propertyCheck = [
        { 0: "customerName", 1: "errCustomerName" },
        { 0: "contractName", 1: "errContractName" },
        { 0: "contractNum", 1: "errContractNum" },
        { 0: "dateSignContract", 1: "errDateSignContract" },
        { 0: "dateEndContract", 1: "errDateEndContract" },
        { 0: "contractValue", 1: "errContractValue" },
        { 0: "scoreEvaluation", 1: "errScoreEvaluation" }
      ];
      propertyCheck.forEach(el => {
        dem += this.checkValidations(item, el);
      });
      const checkDem = dem.indexOf("1");
      if (checkDem !== -1) {
        this.isEditTab1 = true;
        this.similarContractsList[idx2].status = false;
        this.toastService.openErrorToast(
          "Vui lòng nhập đầy đủ các trường bắt buộc"
        );
      } else {
        this.isEditTab1 = false;
        this.similarContractsList[idx2].status = true;
      }

      // load sdu lieu phan trang
      this.arrPage1();
      this.loadList1();
    } else if (tab === 2) {
      this.finacialCapacityBackup = "";
      let dem = "iist";
      const propertyCheck = [
        { 0: "year", 1: "errYear" },
        { 0: "year", 1: "errYear" },
        { 0: "totalAssets", 1: "errTotalAssets" },
        { 0: "totalLiabilities", 1: "errTotalLiabilities" },
        { 0: "shortTermAssets", 1: "errShortTermAssets" },
        { 0: "totalCurrentLiabilities", 1: "errTotalCurrentLiabilities" },
        { 0: "revenue", 1: "errRevenue" },
        { 0: "profitBeforeTax", 1: "errProfitBeforeTax" },
        { 0: "profitAfterTax", 1: "errProfitAfterTax" }
      ];
      propertyCheck.forEach(el => {
        dem += this.checkValidations(item, el);
      });
      const checkDem = dem.indexOf("1");
      if (checkDem !== -1) {
        this.isEditTab2 = true;
        this.finacialCapacityList[idx].status = false;
        this.toastService.openErrorToast(
          "Vui lòng nhập đầy đủ các trường bắt buộc"
        );
      } else {
        this.isEditTab2 = false;
        this.finacialCapacityList[idx].status = true;
      }

      /*if (this.totalScoreEvaluation === '' || Number(this.totalScoreEvaluation) === 0) {
        this.errTotalScoreEvaluation = true;
      }*/
    } else if (tab === 3) {
      const idx2 = (this.currentPage3 - 1) * this.numberPerPage3 + idx;
      this.partnerResourceBackup = "";
      let dem = "iist";
      const propertyCheck = [
        { 0: "timeEvaluation", 1: "errTimeEvaluation" },
        { 0: "totalPersonnel", 1: "errTotalPersonnel" },
        { 0: "scoreEvaluation", 1: "errScoreEvaluation" }
      ];
      propertyCheck.forEach(el => {
        dem += this.checkValidations(item, el);
      });
      const checkDem = dem.indexOf("1");
      if (checkDem !== -1) {
        this.isEditTab3 = true;
        this.partnerResourceList[idx2].status = false;
        this.toastService.openErrorToast(
          "Vui lòng nhập đầy đủ các trường bắt buộc"
        );
      } else {
        this.isEditTab3 = false;
        this.partnerResourceList[idx2].status = true;
      }
      // load du lieu phan trang
      this.arrPage3();
      this.loadList3();
    }
  }

  // xoa doi tuong tren grid
  /**
   * dodv 05062020
   * @param tab: 1- cac hop dong tuong tu; 2- nang luc tai chinh; 3- nguon luc doi tac; 4- Tong nhan su san xuat
   * 5- tong nhan su san sang tham gia du an VTS; 6- nang luc quan ly chat luong; 7- nang luc bao mat ATTT
   * @param idx
   */
  onDeleteGrid(tab, idx, item) {
    this.isModalConfirmShow = true;
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static"
    });
    modalRef.componentInstance.type = "confirmDelete";
    modalRef.componentInstance.onCloseModal.subscribe(value => {
      if (value === true) {
        if (tab === 1) {
          const i = (this.currentPage1 - 1) * this.numberPerPage1 + idx;
          this.similarContractsList.splice(i, 1);
          this.arrPage1();
          this.loadList1();

          this.checkScoreSimilarContracts();
        } else if (tab === 2) {
          this.finacialCapacityList.splice(idx, 1);
          this.onChangeTotal();
        } else if (tab === 3) {
          const i = (this.currentPage3 - 1) * this.numberPerPage3 + idx;
          this.partnerResourceList.splice(i, 1);
          this.arrPage3();
          this.loadList3();
          this.getSumFinancialCapacity(this.finacialCapacityList);
        }
      }
      this.isModalConfirmShow = false;
    });
  }

  // huy bo
  /**
   * dodv 05062020
   *
   * @param tab: 1- cac hop dong tuong tu; 2- nang luc tai chinh; 3- nguon luc doi tac; 4- Tong nhan su san xuat
   * 5- tong nhan su san sang tham gia du an VTS; 6- nang luc quan ly chat luong; 7- nang luc bao mat ATTT
   * @param idx
   */
  onCancel(tab, idx) {
    if (tab === 1) {
      this.isEditTab1 = false;

      if (
        this.similarContractsBackup === undefined ||
        this.similarContractsBackup === ""
      ) {
        this.similarContractsList.splice(idx, 1);
        this.arrPage1();
        this.loadList1();
        return;
      }
      this.similarContractsList[idx] = JSON.parse(
        JSON.stringify(this.similarContractsBackup)
      );
      this.similarContractsList[idx].status = true;
      this.similarContractsBackup = "";
      this.arrPage1();
      this.loadList1();
      this.checkScoreSimilarContracts();
    } else if (tab === 2) {
      this.isEditTab2 = false;

      if (!this.finacialCapacityBackup) {
        this.finacialCapacityList.splice(idx, 1);
        if (this.finacialCapacityList.length === 0) {
          this.totalScoreEvaluation = "";
        }
        return;
      }
      this.finacialCapacityList[idx] = JSON.parse(
        JSON.stringify(this.finacialCapacityBackup)
      );
      this.finacialCapacityList[idx].status = true;
      this.finacialCapacityBackup = "";
    } else if (tab === 3) {
      this.isEditTab3 = false;

      if (
        this.partnerResourceBackup === undefined ||
        this.partnerResourceBackup === ""
      ) {
        this.partnerResourceList.splice(idx, 1);
        this.arrPage3();
        this.loadList3();
        return;
      }
      this.partnerResourceList[idx] = JSON.parse(
        JSON.stringify(this.partnerResourceBackup)
      );
      this.partnerResourceList[idx].status = true;
      this.partnerResourceBackup = "";
      this.arrPage3();
      this.loadList3();
    }
  }

  /**
   * Use check input when key up event
   * @param event
   * @param item
   */
  checkValidation(item: any, property: string) {
    if (item[property] === "" || item[property] === null) {
      item.valid = false;
      return "has-error";
    } else {
      item.valid = true;
      return "";
    }
  }

  // chỉ cho nhập số không cho nhập text, clear sô 0 ơ đầu
  onInputChange(event) {
    const value = event.target.value;
    if (value === "0,_") {
      event.target.value = value.replace("_", "");
    }
    const string = String(value).split("");
    if (value.length > 1 && Number(string[0]) === 0 && string[1] !== ",") {
      event.target.value = String(value).replace("0", "");
    }
  }

  // kiểm tra điểm đánh giá trả về toast
  /**
   * huyenlt-16/06/2020
   *  start validate table
   * text mask
   */
  //kiểm tra điểm đánh giá trả về toast ở tab các hơp dồng tương ứng, nguồn lực đối tác
  checkValue(value, event, tab) {
    const convertValue = value.replace(",", ".");
    const valueTerm = event.target.value;
    if (Number(valueTerm) === 0) {
      event.target.value = valueTerm.replace(valueTerm, "");
    }
    if (tab === 1) {
      if (this.similarContractsList.length === 1) {
        if (parseFloat(convertValue) > 80 || parseFloat(convertValue) < 0) {
          this.dem++;
          this.toastService.openErrorToast(
            this.translateService.instant(
              "totalPersonnelVts.toast.error.table.scoreEvaluation"
            )
          );
        } else {
          this.dem--;
        }
      }
    } else {
      if (parseFloat(convertValue) > 80 || parseFloat(convertValue) < 0) {
        this.dem++;
        this.toastService.openErrorToast(
          this.translateService.instant(
            "totalPersonnelVts.toast.error.table.scoreEvaluation"
          )
        );
      } else {
        this.dem--;
      }
    }
  }

  //kiểm tra điểm đánh giá trả về toast tab năng lựu quản lý chất lượng, tab năng lực bảo mật ATTT
  checkValueScoreQuality(value) {
    const convertValue = value.toString().replace(",", ".");
    if (parseFloat(convertValue) > 400 || parseFloat(convertValue) <= 0) {
      this.dem++;
      this.toastService.openErrorToast(
        this.translateService.instant(
          "totalPersonnelVts.toast.error.table.totalScoreQuality"
        )
      );
    } else {
      this.dem--;
    }
  }

  //kiểm tra điểm đánh giá highlight ở tab các hơp dồng tương ứng, nguồn lực đối tác
  errValue(value) {
    const convertValue = value.toString().replace(",", ".");
    if (parseFloat(convertValue) > 80 || parseFloat(convertValue) < 0) {
      return "has-error";
    } else {
      return "";
    }
  }

  //validate diem danh gía highlight ở tab năng lựu quản lý chất lượng, tab năng lực bảo mật ATTT
  errValueScore(value) {
    const convertValue = value.toString().replace(",", ".");
    if (parseFloat(convertValue) > 400 || parseFloat(convertValue) < 0) {
      return "has-error";
    } else {
      return "";
    }
  }

  //kiểm tra điểm đánh giá trả về toast ơ tab nguồn lực tài chính
  checkValueTotal(event) {
    const convertValue = event.target.value.toString().replace(",", ".");
    if (Number(convertValue) === 0) {
      event.target.value = convertValue.replace(convertValue, "");
    }
    if (parseFloat(convertValue) > 40 || parseFloat(convertValue) < 0) {
      this.dem++;
      this.toastService.openErrorToast(
        this.translateService.instant(
          "totalPersonnelVts.toast.error.table.totalScoreEvaluation"
        )
      );
    } else {
      //this.dem--;
    }
  }

  errValueTotal(value) {
    const convertValue = value.toString().replace(",", ".");
    if (parseFloat(convertValue) > 40 || parseFloat(convertValue) < 0) {
      return "has-error";
    } else {
      return "";
    }
  }

  checkValidateTab2OnSubmit() {
    let term = false;
    this.similarContractsList.forEach(item => {
      if (!item.status) {
        term = true;
      }
    });
    return term;
  }

  checkValidateTab3OnSubmit() {
    let term = false;
    this.finacialCapacityList.forEach(item => {
      if (!item.status) {
        term = true;
      }
    });
    return term;
  }

  checkValidateTab4OnSubmit() {
    let term = false;
    this.partnerResourceList.forEach(item => {
      if (!item.status) {
        term = true;
      }
    });
    return term;
  }

  changeValueProduce(type, idx) {}

  replaceSeparate(value) {
    let temp = ("" + value).replace(this.regexReplaceSeparate, "");
    temp = temp.replace(this.regexReplacePoint, ".");
    return Number(temp);
  }

  onChangeTotal() {
    let totalRe = 0;
    let totalPro = 0;
    this.totalRevenue = 0;
    for (let index = 0; index < this.finacialCapacityList.length; index++) {
      const element = this.finacialCapacityList[index];
      if (element.revenue || element.profitBeforeTax) {
        const totalTermRe = this.replaceSeparate(element.revenue);
        totalRe += Number(totalTermRe);
        this.totalRevenue = totalRe;
        const totalTermPro = this.replaceSeparate(element.profitBeforeTax);
        totalPro += Number(totalTermPro);
        this.totalProfitBeforeTax = totalPro;
      }
    }
  }

  convertSimilarContract(list) {
    const dataSend = [];
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.contractValue) {
        element.contractValue = element.contractValue
          ? this.replaceSeparate(element.contractValue)
          : 0;
      }
      // ThucDV-IIST modifi start 29/06/2020
      if (element.scoreEvaluation) {
        element.scoreEvaluation = String(element.scoreEvaluation).replace(
          ",",
          "."
        );
      }
      // ThucDV-IIST modifi end 29/06/2020
      dataSend.push(element);
    }
    return dataSend;
  }

  convertFinacialCapacity() {
    const dataSend = [];
    for (let index = 0; index < this.finacialCapacityList.length; index++) {
      const element = this.finacialCapacityList[index];
      if (
        element.totalAssets ||
        element.totalLiabilities ||
        element.shortTermAssets ||
        element.totalCurrentLiabilities ||
        element.revenue ||
        element.profitBeforeTax ||
        element.profitAfterTax
      ) {
        element.totalAssets = element.totalAssets
          ? this.replaceSeparate(element.totalAssets)
          : 0;
        element.totalLiabilities = element.totalLiabilities
          ? this.replaceSeparate(element.totalLiabilities)
          : 0;
        element.shortTermAssets = element.shortTermAssets
          ? this.replaceSeparate(element.shortTermAssets)
          : 0;
        element.totalCurrentLiabilities = element.totalCurrentLiabilities
          ? this.replaceSeparate(element.totalCurrentLiabilities)
          : 0;
        element.revenue = element.revenue
          ? this.replaceSeparate(element.revenue)
          : 0;
        element.profitBeforeTax = element.profitBeforeTax
          ? this.replaceSeparate(element.profitBeforeTax)
          : 0;
        element.profitAfterTax = element.profitAfterTax
          ? this.replaceSeparate(element.profitAfterTax)
          : 0;
        dataSend.push(element);
      }
    }
    return dataSend;
  }

  convertPartnerResourceList(list) {
    const dataSend = [];
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (
        element.totalPersonnel ||
        element.dhcnttPerNum ||
        element.programCertNum ||
        element.testCertNum ||
        element.qtdaCertNum ||
        element.trainedPerNum ||
        element.scoreEvaluation
      ) {
        element.totalPersonnel = element.totalPersonnel
          ? this.replaceSeparate(element.totalPersonnel)
          : "";
        element.dhcnttPerNum = element.dhcnttPerNum
          ? this.replaceSeparate(element.dhcnttPerNum)
          : "";
        element.programCertNum = element.programCertNum
          ? this.replaceSeparate(element.programCertNum)
          : "";
        element.testCertNum = element.testCertNum
          ? this.replaceSeparate(element.testCertNum)
          : "";
        element.qtdaCertNum = element.qtdaCertNum
          ? this.replaceSeparate(element.qtdaCertNum)
          : "";
        element.trainedPerNum = element.trainedPerNum
          ? this.replaceSeparate(element.trainedPerNum)
          : "";
        element.scoreEvaluation = element.scoreEvaluation
          ? String(element.scoreEvaluation).replace(",", ".")
          : "";
        dataSend.push(element);
      }
    }
    return dataSend;
  }

  convertTotalPersonnelProduce() {}

  convertTotalPersonnelProduceVtsList() {}

  numTableContract(index, field, event) {
    const value = event.target.value;
    this.similarContractsList[index][field] = value.replace(
      REGEX_REPLACE_PATTERN.NUMBER,
      ""
    );
    event.target.value = value.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
  }
  onBlurPhoneNumberContact(event, item) {
    const value = event.target.value;
    if (value.length >= 1) {
      const string = String(value).substring(0, 2);
    }
  }
  numTablePartnerResource(index, field, event) {
    const value = event.target.value;
    this.partnerResourceList[index][field] = value.replace(
      REGEX_REPLACE_PATTERN.NUMBER,
      ""
    );
    event.target.value = value.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
  }

  setValueOfForm(formValue) {
    this.formValue = formValue;
  }

  checkValuesChanges() {
    const formValueChange = CommonUtils.convertObjectToArray(this.form.value);
    this.formValue = CommonUtils.convertObjectToArray(this.formValue);
    if (this.type == "update") {
      for (let i = 0; i < formValueChange.length; i++) {
        if (formValueChange[i] !== this.formValue[i]) {
          return true;
        }
      }
    }
    if (
      this.type == "add" &&
      (this.form.value.organizationRequest !== "" ||
        this.form.value.profileTitle !== "" ||
        this.form.value.appName !== "" ||
        this.form.value.endDate !== "" ||
        this.form.value.handler !== "" ||
        this.form.value.srCode !== null ||
        this.form.value.appCode !== null ||
        this.form.value.startDate !== null ||
        this.form.value.file !== null ||
        this.form.value.status != 1)
    ) {
      console.log(this.form.value);
      return true;
    }
    return false;
  }

  onCancelProfile() {
    if (this.checkValuesChanges()) {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "confirm";
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.form.reset();
          window.history.back();
        }
      });
    } else {
      window.history.back();
    }
  }

  displayFieldHasError(field: string) {
    return {
      "has-error": this.isFieldValid(field)
    };
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  get formControl() {
    return this.form.controls;
  }

  setErrorField(field: string, pattern) {
    const result = this.getValueOfField(field).match(pattern);
    if (result) {
      result.forEach(it => {
        if (it !== "") {
          this.form.controls[field].setErrors({ pattern: true });
        }
      });
    }
  }

  //check validate ma doi tac
  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  onPasteValidate(element) {
    let value = this.getValueOfField(element).trim();
    value = value.replace(REGEX_REPLACE_PATTERN.APPRAISAL_CODE_PRO, "");
    this.setValueToField(element, value);
  }

  onPartnerCodeInput(event, formName) {
    const value = event.target.value;
    if (!REGEX_PATTERN.PARTNER_CODE_PRO.test(value)) {
      this.form.controls[formName].setValue(
        value.replace(REGEX_REPLACE_PATTERN.APPRAISAL_CODE_PRO, "")
      );
    }
  }

  onKeyDown(event) {
    const key = event.key;
    const text = key.replace(REGEX_REPLACE_PATTERN.APPRAISAL_CODE_PRO, "");
    if (text.length === 0) {
      return false;
    }
  }

  //validate so dien thoai
  onKeyInput(event, element) {
    const value = this.getValueOfField(element);
    let valueChange = event.target.value;
    if ("phoneNumber" === element) {
      valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
      if (valueChange.length >= 1) {
        const string = String(valueChange).substring(0, 2);
        if (
          (string !== "09" &&
            string !== "07" &&
            string !== "08" &&
            string !== "05" &&
            string !== "03") ||
          value.length < 10
        ) {
          this.form.controls["phoneNumber"].setErrors({ invalid: true });
        }
      }
    }
    if ("directorPhoneNumber" === element) {
      valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
      if (valueChange.length >= 1) {
        const string = String(valueChange).substring(0, 2);
        if (
          (string !== "09" &&
            string !== "07" &&
            string !== "08" &&
            string !== "05" &&
            string !== "03") ||
          value.length < 10
        ) {
          this.form.controls["directorPhoneNumber"].setErrors({
            invalid: true
          });
        }
      }
    }
    if ("totalPersonnel" === element) {
      valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
    }
    if (value !== valueChange) {
      this.setValueToField(element, valueChange);
      return false;
    }
  }

  //validate email
  onBlurEmail(field) {
    const value =
      this.getValueOfField(field) !== null &&
      this.getValueOfField(field) !== undefined
        ? this.getValueOfField(field).trim()
        : "";
    this.setValueToField(field, value);
    if (!value.endsWith(";")) {
      const email = value.split(";");
      email.forEach(element => {
        if (!REGEX_PATTERN.EMAIL.test(element.trim())) {
          if (this.getValueOfField(field) !== "") {
            this.form.controls[field].setErrors({ invalid: true });
          }
        }
      });
    }
    if (value.endsWith(";")) {
      this.form.controls[field].setErrors({ invalid: true });
    }
  }
  //validate phone number
  onPhoneNumber(event) {
    const valueChange = event.target.value;
    if (valueChange.length > 1) {
      const string = String(valueChange).substring(0, 2);
      if (
        string !== "09" &&
        string !== "07" &&
        string !== "08" &&
        string !== "05" &&
        string !== "03"
      ) {
        this.form.controls["directorPhoneNumber"].setErrors({ invalid: true });
      }
    }
  }
  trimSpace(element) {
    let value = this.getValueOfField(element);
    if ("srCode" === element) {
      value = value.trim();
    }
    if ("profileTitle" === element) {
      value = value.trim();
    }
    if ("appCode" === element) {
      value = value.trim();
    }
    if ("appName" === element) {
      value = value.trim();
    }
    if ("note" === element) {
      value = value.trim();
    }
    if ("contactPointName" === element) {
      value = value.trim();
    }
    if ("cooperativeUnit" === element) {
      value = value.trim();
    }
    if (value) {
      this.setValueToField(element, value.trim());
    }
  }

  //trim space cac phan tu trong bang cac hop dong tuong tu
  trimSpaceOfTable(index, field, event) {
    const value = event.target.value;
    this.similarContractsList[index][field] = value.trim();
    event.target.value = value.trim();
  }

  //trim space cac phan tu trong bang nang luc tai chinh
  trimSpaceOfTableFinacialCapacity(index, field, event) {
    const value = event.target.value;
    this.finacialCapacityList[index][field] = value.trim();
    event.target.value = value.trim();
  }

  //trim space cac phan tu trong bang mnguon luc tai chinh
  trimSpaceOfTablePartnerResource(index, field, event) {
    const value = event.target.value;
    this.partnerResourceList[index][field] = value.trim();
  }

  /**
   * huyenlt-30062020
   *  phân trang tab nguồn lực đối tác
   * start
   */
  // load dữ liệu phân trang nguon luc doi tac
  loadList3() {
    const begin = (this.currentPage3 - 1) * this.numberPerPage3;
    const end = begin + Number(this.numberPerPage3);
    this.partnerResourceList2 = this.pageList3.slice(begin, end);
  }

  arrPage3() {
    this.pageList3 = this.partnerResourceList;

    this.numberOfPages3 = Math.ceil(
      this.pageList3.length / this.numberPerPage3
    );
    this.arrNumberOfPages3 = Array(this.numberOfPages3).fill(4);
    // cập nhật lại số bản ghi
    this.numRecord3 = this.partnerResourceList.length;
  }

  checkFirstAndPrev3() {
    if (this.currentPage3 === 1) {
      return "disabled";
    } else {
      return "";
    }
  }

  checkNextAndLast3() {
    if (this.currentPage3 === this.numberOfPages3) {
      return "disabled";
    } else {
      return "";
    }
  }

  checkActive3(i: number) {
    if (this.currentPage3 === i + 1) {
      return "active";
    } else {
      return "";
    }
  }

  changePage3(num: number) {
    this.currentPage3 = num + 1;
    this.loadList3();
  }

  onChangePage3(value?: number) {
    this.numberPerPage3 = value;
    this.numberOfPages3 = Math.ceil(
      this.pageList3.length / this.numberPerPage3
    );
    // nếu số trang hiên tại lớn tổng số page -> page cuối cùng
    if (this.numberOfPages3 < this.currentPage3) {
      this.currentPage3 = this.numberOfPages3;
    }
    this.arrNumberOfPages3 = Array(this.numberOfPages3).fill(4);
    // cập nhật lại số bản ghi
    this.numRecord3 = this.partnerResourceList.length;
    this.loadList3();
  }

  firstPage3() {
    this.currentPage3 = 1;
    this.loadList3();
  }

  lastPage3() {
    this.currentPage3 = this.numberOfPages3;
    this.loadList3();
  }

  previousPage3() {
    if (this.currentPage3 !== 1) {
      this.currentPage3 -= 1;
      this.loadList3();
    }
  }

  nextPage3() {
    if (this.currentPage3 !== this.numberOfPages3) {
      this.currentPage3 += 1;
      this.loadList3();
    }
  }

  /**
   * huyenlt-30062020
   *  phân trang tab nguồn lực đối tác
   * end
   */
  /**
   * huyenlt-30062020
   *  phân trang tab các hợp đông tương tự
   * start
   */
  // load dữ liệu phân trang nguon luc doi tac
  loadList1() {
    const begin = (this.currentPage1 - 1) * this.numberPerPage1;
    const end = begin + Number(this.numberPerPage1);
    this.similarContractsList2 = this.pageList1.slice(begin, end);
    // this.partnerResourceList2 = this.pageList1.slice(begin, end);
  }

  arrPage1() {
    this.pageList1 = this.similarContractsList;
    this.numberOfPages1 = Math.ceil(
      this.pageList1.length / this.numberPerPage1
    );
    this.arrNumberOfPages1 = Array(this.numberOfPages1).fill(4);
    // cập nhật lại số bản ghi
    this.numRecord1 = this.similarContractsList.length;
  }

  checkFirstAndPrev1() {
    if (this.currentPage1 === 1) {
      return "disabled";
    } else {
      return "";
    }
  }

  checkNextAndLast1() {
    if (this.currentPage1 === this.numberOfPages1) {
      return "disabled";
    } else {
      return "";
    }
  }

  checkActive1(i: number) {
    if (this.currentPage1 === i + 1) {
      return "active";
    } else {
      return "";
    }
  }

  changePage1(num: number) {
    this.currentPage1 = num + 1;
    this.loadList1();
  }

  onChangePage1(value?: number) {
    this.numberPerPage1 = value;
    this.numberOfPages1 = Math.ceil(
      this.pageList1.length / this.numberPerPage1
    );
    // nếu số trang hiên tại lớn tổng số page -> page cuối cùng
    if (this.numberOfPages1 < this.currentPage1) {
      this.currentPage1 = this.numberOfPages1;
    }
    this.arrNumberOfPages1 = Array(this.numberOfPages1).fill(4);
    // cập nhật lại số bản ghi
    this.numRecord1 = this.similarContractsList.length;
    this.loadList1();
  }

  firstPage1() {
    this.currentPage1 = 1;
    this.loadList1();
  }

  lastPage1() {
    this.currentPage1 = this.numberOfPages1;
    this.loadList1();
  }

  previousPage1() {
    if (this.currentPage1 !== 1) {
      this.currentPage1 -= 1;
      this.loadList1();
    }
  }

  nextPage1() {
    if (this.currentPage1 !== this.numberOfPages1) {
      this.currentPage1 += 1;
      this.loadList1();
    }
  }

  /**
   * huyenlt-30062020
   *  phân trang tab năng lực quản lý chất lượng
   * end
   */
  //xuat excel
  onExportExcel() {
    this.profileAppraisalService
      .exportFileExcel({ id: this.currentProfile.id })
      .subscribe(
        res => {
          this.spinner.hide();
          if (res) {
            this.downloadService.downloadFile(res);
          }
        },
        error => {
          this.spinner.hide();
          if (error.status === STATUS_CODE.BAD_REQUEST) {
            this.commonUtils.parseErrorBlob(error).subscribe(res => {
              this.toastService.openErrorToast(res.data);
            });
          } else {
            error.error.data
              ? this.toastService.openErrorToast(error.error.data)
              : this.toastService.openErrorToast(
                  this.translateService.instant(
                    "common.toastr.messages.error.export"
                  )
                );
          }
        }
      );
  }

  onCheckChange(event) {
    if (event.target.checked === true) {
      this.form.get("workInViettel").setValue(1);
    } else {
      this.form.get("workInViettel").setValue(0);
    }
  }

  //validate ngay ky hop dong < ngay ket thuc hop dong trong tab các hop dong tuong tu
  isDateErr(item) {
    const dt1 = DateTimeModel.fromLocalString(item.dateSignContract);
    const dt2 = DateTimeModel.fromLocalString(item.dateEndContract);
    if (dt1.year > dt2.year) {
      item.errDateSignContract = true;
      item.errDateEndContract = true;
      this.toastService.openErrorToast(
        "Thời gian kết thúc hợp đồng phải lớn hơn hoặc bằng Ngày ký hợp đồng"
      );
    } else if (dt1.year === dt2.year) {
      if (dt1.month > dt2.month) {
        item.errDateSignContract = true;
        item.errDateEndContract = true;
        this.toastService.openErrorToast(
          "Thời gian kết thúc hợp đồng phải lớn hơn hoặc bằng Ngày ký hợp đồng"
        );
      } else if (dt1.month === dt2.month) {
        if (dt1.day > dt2.day) {
          item.errDateSignContract = true;
          item.errDateEndContract = true;
          this.toastService.openErrorToast(
            "Thời gian kết thúc hợp đồng phải lớn hơn hoặc bằng Ngày ký hợp đồng"
          );
        } else {
          item.errDateSignContract = false;
          item.errDateEndContract = false;
        }
      } else {
        item.errDateSignContract = false;
        item.errDateEndContract = false;
      }
    } else {
      item.errDateSignContract = false;
      item.errDateEndContract = false;
    }
  }
  //Kiêm tra so luong nhan su  < = tong nhan su
  checkValidateTotalPersonal(item, tab) {
    const totalPersonal = Number(
      item.totalBA + item.totalDev + item.totalDevMobile + item.totalTest
    );
    if (tab === 3) {
      if (Number(item.dhcnttPerNum) > Number(item.totalPersonnel)) {
        item.errValidate1 = "has-error";
        this.toastService.openErrorToast(
          "Số lượng nhận sự có bằng ĐHCNTT phải nhỏ hơn hoặc bằng Tổng nhân sự"
        );
      } else if (Number(item.programCertNum) > Number(item.totalPersonnel)) {
        item.errValidate2 = "has-error";
        this.toastService.openErrorToast(
          "Số lượng nhân sự có chứng chỉ lập trình (Microsoft, Oracle, IBM, Amazon,...) phải nhỏ hơn hoặc bằng Tổng nhân sự"
        );
      } else if (Number(item.testCertNum) > Number(item.totalPersonnel)) {
        item.errValidate3 = "has-error";
        this.toastService.openErrorToast(
          "Số lượng nhân sự có chứng chỉ kiểm thử (ISTQB,...) phải nhỏ hơn hoặc bằng Tổng nhân sự"
        );
      } else if (Number(item.qtdaCertNum) > Number(item.totalPersonnel)) {
        item.errValidate4 = "has-error";
        this.toastService.openErrorToast(
          "Số lượng nhân sự có chứng chỉ QTDA (PMP, Scrum Master) phải nhỏ hơn hoặc bằng Tổng nhân sự"
        );
      } else if (Number(item.trainedPerNum) > Number(item.totalPersonnel)) {
        item.errValidate5 = "has-error";
        this.toastService.openErrorToast(
          "Số lượng nhân sự đã được đào tạo phải nhỏ hơn hoặc bằng Tổng nhân sự"
        );
      } else {
        item.errValidate1 = "";
        item.errValidate2 = "";
        item.errValidate3 = "";
        item.errValidate4 = "";
        item.errValidate5 = "";
      }
    }
  }

  //ThucDV-IIST modifi start 29/06/2020
  checkPartnerCodeIsExist() {
    const profileAppraisalCode = this.form.get("profileAppraisalCode").value; // get gia trai tren form edit
    if (this.partnerCode !== profileAppraisalCode) {
      this.profileAppraisalService
        .checkPartnerCodeIsExist(profileAppraisalCode)
        .subscribe(res => {
          if (res.body !== null) {
            this.form.controls["profileAppraisalCode"].setErrors({
              exist: true
            });
            this.codePartnerIsExist = profileAppraisalCode;
            return true;
          }
        });
    }
    return false;
  }

  coverScoreEvaluation(data) {
    if (null !== data) {
      let i = 0;
      for (i = 0; i < data.length; i++) {
        if (null !== data[i].scoreEvaluation)
          data[i].scoreEvaluation = String(data[i].scoreEvaluation).replace(
            ".",
            ","
          );
      }
    }
  }

  coverScoreEvaluationPartnerResource(data) {
    if (null !== data) {
      let i = 0;
      for (i = 0; i < data.length; i++) {
        if (null !== data[i].scoreEvaluation)
          this.partnerResourceList[i].scoreEvaluation = String(
            data[i].scoreEvaluation
          ).replace(".", ",");
        if (this.partnerResourceList[i].trainingProgram === null)
          this.partnerResourceList[i].trainingProgram = "";
      }
    }
  }

  changeTimeEvaluation(event, type, item) {
    if (type === 3) {
      item.timeEvaluation = event;
    } else if (type === 4) {
      item.timeEvaluation = event;
    } else if (type === 5) {
      item.timeEvaluation = event;
    } else if (type === 6) {
      item.timeEvaluation = event;
    } else if (type === 7) {
      item.timeEvaluation = event;
    }
  }

  coverScoreEvaluationQualityCapacity(data) {
    if (null !== data) {
      let i = 0;
      for (i = 0; i < data.length; i++) {
        if (null !== data[i].scoreEvaluate)
          data[i].scoreEvaluate = String(data[i].scoreEvaluate).replace(
            ".",
            ","
          );
      }
    }
  }

  convertQualityCapacityList(list) {
    const dataSend = [];
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.projectManagerToolArr === "") {
        element.projectManagerToolArr = null;
      }
      element.scoreEvaluate = String(element.scoreEvaluate).replace(",", ".");
      dataSend.push(element);
    }
    return dataSend;
  }

  convertCapacitySecurityList(list) {
    const dataSend = [];
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      element.scoreEvaluation = String(element.scoreEvaluation).replace(
        ",",
        "."
      );
      dataSend.push(element);
    }
    return dataSend;
  }

  getSumFinancialCapacity(list) {
    this.totalProfitBeforeTax = 0;
    let sumTotalRevenue = 0;
    let sumTotalProfitBeforeTax = 0;
    let i;
    for (i = 0; i < list.length; i++) {
      sumTotalRevenue += Number(String(list[i].revenue).replace(/\./g, ""));
      sumTotalProfitBeforeTax += Number(
        String(list[i].profitBeforeTax).replace(/\./g, "")
      );
    }
    if (sumTotalRevenue !== 0) {
      this.totalRevenue = Math.round(sumTotalRevenue / list.length);
    }
    this.totalProfitBeforeTax = sumTotalProfitBeforeTax;
  }

  getSumFinancial() {
    this.getSumFinancialCapacity(this.finacialCapacityList);
  }

  getIndexScoreEvaluation(list) {
    let i;
    let indexMaxScoreEvaluation = 0;
    let maxDate = DateTimeModel.fromLocalString("01/" + list[0].timeEvaluation);
    if (list.length === 1) {
      indexMaxScoreEvaluation = 0;
    } else {
      for (i = 1; i < list.length; i++) {
        const date = DateTimeModel.fromLocalString(
          "01/" + list[i].timeEvaluation
        );
        if (this.dataFormatService.before(maxDate, date)) {
          maxDate = DateTimeModel.fromLocalString(
            "01/" + list[i].timeEvaluation
          );
          indexMaxScoreEvaluation = i;
        } else if (this.dataFormatService.equals(maxDate, date)) {
          //  Xua ly khi truong update = null
          if (
            (list[indexMaxScoreEvaluation].updateDate === null &&
              list[i].updateDate === null) ||
            (list[indexMaxScoreEvaluation].updateDate === undefined &&
              list[i].updateDate === undefined)
          ) {
            if (
              this.dataFormatService.before(
                list[indexMaxScoreEvaluation].createDate,
                list[i].createDate
              )
            ) {
              maxDate = DateTimeModel.fromLocalString(
                "01/" + list[i].timeEvaluation
              );
              indexMaxScoreEvaluation = i;
            }
          } else if (
            (list[indexMaxScoreEvaluation].updateDate === null ||
              list[indexMaxScoreEvaluation].updateDate === undefined) &&
            (list[i].updateDate !== null || list[i].updateDate !== undefined)
          ) {
            maxDate = DateTimeModel.fromLocalString(
              "01/" + list[i].timeEvaluation
            );
            indexMaxScoreEvaluation = i;
          } else if (
            (list[indexMaxScoreEvaluation].updateDate !== null ||
              list[indexMaxScoreEvaluation].updateDate !== undefined) &&
            (list[i].updateDate === null || list[i].updateDate === undefined)
          ) {
            maxDate = DateTimeModel.fromLocalString(
              "01/" + list[i].timeEvaluation
            );
            indexMaxScoreEvaluation = i;
          } else if (
            (list[indexMaxScoreEvaluation].updateDate !== null ||
              list[indexMaxScoreEvaluation].updateDate !== undefined) &&
            (list[i] !== null || list[i].updateDate !== undefined)
          ) {
            // Xu ly truong update != null
            if (
              this.dataFormatService.before(
                list[indexMaxScoreEvaluation].updateDate,
                list[i].updateDate
              )
            ) {
              maxDate = DateTimeModel.fromLocalString(
                "01/" + list[i].timeEvaluation
              );
              indexMaxScoreEvaluation = i;
            }
          } else if (
            list[indexMaxScoreEvaluation].createDate === undefined &&
            list[i].createDate === undefined
          ) {
            maxDate = DateTimeModel.fromLocalString(
              "01/" + list[i].timeEvaluation
            );
            indexMaxScoreEvaluation = i;
          }
        }
      }
    }

    return indexMaxScoreEvaluation;
  }

  getSumScoreEvaluation() {
    let sum = 0;
    if (this.similarContractsList.length > 0) {
      this.similarContractsList.forEach(obj => {
        sum += Number(String(obj.scoreEvaluation).replace(",", "."));
      });
    }
    if (Number(this.totalScoreEvaluation.replace(",", ".")) > 0) {
      sum += Number(this.totalScoreEvaluation.replace(",", "."));
    }
    if (this.partnerResourceList.length > 0) {
      sum += Number(
        String(
          this.partnerResourceList[
            this.getIndexScoreEvaluation(this.partnerResourceList)
          ].scoreEvaluation
        ).replace(",", ".")
      );
    }
    if (sum !== 0) {
      const string = sum.toString().split("");
      let indexPoint = 0;
      let i;
      for (i = 0; i < string.length; i++) {
        if ("." === string[i]) {
          indexPoint = i;
        }
      }
      if (indexPoint !== 0) {
        this.totalScore = sum
          .toString()
          .replace(".", ",")
          .substring(0, indexPoint + 3);
      } else {
        this.totalScore = sum.toString();
      }
    } else {
      this.totalScore = "0";
    }

    return this.totalScore;
  }

  convertIdDeleteRowFromPartnerCapacity() {}

  checkSizeFile() {
    let i = 0;
    let sizeFileAll = 0;
    let sizeFile = 0;
    if (sizeFileAll > 150) {
      this.form.controls["listFile"].setErrors({ maxFile: true });
    }
  }

  onDeleteDocument(item) {
    let status;
    if (item.id !== undefined) {
      this.fileAttachmentService.deleteFile(item.id).subscribe(
        res => {
          if (res.status === STATUS_CODE.SUCCESS) {
            status = res.status;
            this.toastService.openSuccessToast(
              this.translateService.instant(
                "outsourcingPlan.toastr.delete.successful"
              )
            );
          }
        },
        error => {
          this.toastService.openErrorToast(
            this.translateService.instant("outsourcingPlan.toastr.delete.fail")
          );
        },
        () => {
          let data;
          if (status === STATUS_CODE.SUCCESS) {
            data = this.formControl.listFile.value.filter(value => {
              if (value.fileName !== undefined && item.fileName !== undefined) {
                return value.fileName !== item.fileName;
              }
              if (value.name !== undefined) {
                return value;
              }
            });
          } else {
            data = this.formControl.listFile.value.filter(value => {
              if (value.fileName !== undefined && item.fileName !== undefined) {
                return value.fileName;
              }
              if (value.name !== undefined) {
                return value;
              }
            });
          }
          this.setValueToField("listFile", data);
        }
      );
    } else {
      const data = this.formControl.listFile.value.filter(value => {
        if (value.name !== undefined && item.name !== undefined) {
          return value.name !== item.name;
        }
        if (value.fileName !== undefined) {
          return value;
        }
      });
      this.setValueToField("listFile", data);
      this.checkSizeFile();
    }
  }

  downloadFile(item) {
    if (item.id !== undefined) {
      this.spinner.show();
      this.fileAttachmentService.downloadFile(item.filePath).subscribe(res => {
        this.spinner.hide();
        if (res) {
          this.downloadService.downloadFile(res);
        }
      });
    }
  }

  checkScoreSimilarContracts() {
    let sum = 0;
    if (this.similarContractsList.length > 1) {
      this.similarContractsList.forEach(obj => {
        sum += Number(String(obj.scoreEvaluation).replace(",", "."));
      });
    }

    if (parseFloat(String(sum)) > 80) {
      this.toastService.openErrorToast(
        this.translateService.instant("similarContracts.toast.error.score")
      );
      this.errorTotalScoreContract = "has-error";
      return true;
    } else {
      this.errorTotalScoreContract = "";
    }

    return false;
  }

  deleteZeroFirst(event) {
    const valueChange = event.target.value;
    const parseStr = valueChange.split("");
    if (parseStr[0] === "0") event.target.value = valueChange.replace("0", "");
  }
  // ThucDV-IIST modifi end 29/06/2020

  loadPage1(page: number) {
    this.changePage1(page);
  }

  loadPage3(page: number) {
    this.changePage3(page);
  }
  // thêm mới
  deleteFileImport() {
    this.file = "";
    this.fileImport.delete();
    this.errImport = false;
    this.successImport = false;
    this.importResult = false;
  }

  onChangeFile(event) {
    this.errMessage = "";
    this.file = event;
    if (
      this.file != null &&
      CommonUtils.tctGetFileSize(this.file) > this.validMaxSize
    ) {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = this.translateService.instant(
        "common.import.error.exceedMaxSize"
      );
      return false;
    }
  }

  onError(event) {
    if (event === "") {
      this.errImport = false;
      this.successImport = true;
      this.successMessage = this.translateService.instant(
        "common.import.success.upload"
      );
    } else {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = event;
    }
  }

  downloadFileTemplate(fileName) {
    var fileExcel;
    this.spinner.show();
    if (fileName == "xlsx") {
      fileExcel = "ULNL_Template.xlsx";
    } else {
      fileExcel = "ULNL_Template.xls";
    }
    this.versionManagementService
      .downloadFileExcel(fileExcel)
      .subscribe(res => {
        this.spinner.hide();
        if (res.status === STATUS_CODE.SUCCESS) {
          const status = Number(res.headers.get("status"));
          if (status === 2) {
            this.toastService.openErrorToast(
              this.translateService.instant(
                "profileAppraisal.toastr.messages.fileNotFound"
              )
            );
          } else {
            this.downloadService.downloadFile(res);
          }
        }
      });
  }
  closeModalResult() {
    this.bsModalService.hide(1);
    window.history.back();
  }

  downloadFileImport() {
    this.downloadService.downloadFile(this.dataFileResultExcel);
    this.closeModalResult();
  }

  getStatus(status) {
    for (const element of this.listStatus) {
      if (element.id == status) {
        return element.name;
      }
    }
  }

  isShowErrorMessage(date) {
    this.startDateValidate = false;
    this.endDateValidate = false;
    if (this.equalDateStr(date, this.form.get("endDate").value) === 1) {
      this.startDateValidate = true;
    }
    if (this.equalDateStr(date, this.form.get("startDate").value) === -1) {
      this.endDateValidate = true;
    }
  }

  equalDateStr(date1: string, date2: string) {
    if (
      date1 == null ||
      date2 == null ||
      date1 === "" ||
      date2 === "" ||
      date1 === undefined ||
      date2 === undefined
    )
      return -2;
    const dt1 = this.fortmatDate(date1);
    const dt2 = this.fortmatDate(date2);
    if (dt1 > dt2) return 1;
    else if (dt1 < dt2) return -1;
    else return 0;
  }

  fortmatDate(dateString: string): DateTimeModel {
    const date = new Date(dateString);
    const isValidDate = !isNaN(date.valueOf());
    if (!dateString || !isValidDate) {
      return null;
    }
    return new DateTimeModel({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    });
  }

  downloadFileResult(fileName) {
    this.versionManagementService
      .downloadFileResultExcel(fileName)
      .subscribe(res => {
        this.spinner.hide();
        if (res.status === STATUS_CODE.SUCCESS) {
          const status = Number(res.headers.get("status"));
          if (status === 2) {
            this.toastService.openErrorToast(
              this.translateService.instant(
                "profileAppraisal.toastr.messages.fileNotFound"
              )
            );
          } else {
            this.downloadService.downloadFile(res);
          }
        }
      });
  }
}
