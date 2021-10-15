import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {HeightService} from "app/shared/services/height.service";

@Component({
  selector: 'jhi-standard-destination-approve',
  templateUrl: './standard-destination-approve.component.html',
  styleUrls: ['./standard-destination-approve.component.scss']
})
export class StandardDestinationApproveComponent implements OnInit {
  height: any;
  formGroup: FormGroup;
  totalInItems = 0;
  totalOutItems = 0;
  pageIn = 0;
  pageOut = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  maxSizePage = MAX_SIZE_PAGE;
  lstPriceIn = [];
  lstPriceOut = [];
  columns = [
    {name: 'partner.orderNo', size: 'small'},
    {name: 'partner.priceOut.dest', size: 'medium'},
    {name: 'partner.commitment.flow2', size: 'medium'},
    {name: 'partner.priceCommitment', size: 'medium'},
    {name: 'partner.commitment.overPrice', size: 'medium'},
    {name: 'partner.commitment.total', size: 'medium'},
  ];

  columnsTotal = [
    {name: '', size: 'small'},
    {name: 'partner.commitment.flow2', size: 'medium'},
    {name: 'partner.commitment.total', size: 'medium'},
  ];

  constructor(private heightService: HeightService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.prepareData()
  }

  prepareData() {
    this.onResize();
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  loadPageIn(page) {

  }

  loadPageOut(page) {

  }

  changePageSizeIn(event) {

  }

  changePageSizeOut(event) {

  }
}
