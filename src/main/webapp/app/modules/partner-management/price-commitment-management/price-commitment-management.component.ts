import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {PageSettingsModel, TreeGridComponent} from '@syncfusion/ej2-angular-treegrid';
import {ChangeEventArgs} from '@syncfusion/ej2-inputs';
import {map, toArray} from "rxjs/operators";
import {fromArray} from "rxjs/internal/observable/fromArray";

@Component({
    selector: 'jhi-price-commitment-management',
    templateUrl: './price-commitment-management.component.html',
    styleUrls: ['./price-commitment-management.component.scss']
})
export class PriceCommitmentManagementComponent implements OnInit {
    @ViewChild('treegrid', {static: false}) public treeGridObj: TreeGridComponent;
    @ViewChild('treegrid2', {static: false}) public treeGridObj2: TreeGridComponent;
    @Input() isSaving: boolean;
    @Input() disable = true;
    isShow = false;

    constructor(private router: Router) {
    }

    public pageSettings: PageSettingsModel;

    ngOnInit(): void {
        this.pageSettings = {pageSize: 10};
        fromArray(this.data).pipe(map((value: any, index) => {
            const task = {no: ++index};
            if (value.subtasks && value.subtasks.length > 0) {
                value.subtasks.map((subValue: any, subIndex: any) => {
                    subValue[`no`] = `${task.no}.${++subIndex}`;
                    return subValue;
                });
            }
            return {...task, ...value};
        }), toArray()).subscribe(value => {
            this.data = value;
            console.log(this.data);
        });
        this.dataSource();
    }

    toggle() {
        this.isShow = !this.isShow;
    }

    openPriceCommitmentSearch() {
        void this.router.navigateByUrl(`/partner-management/price-commitment-management`)
    }

    change(args: ChangeEventArgs) {
        this.treeGridObj.goToPage(args.value);
    }

    rowClick(event: any) {
        console.log(event);
    }

    public data: Object[] = [
        {
            taskID: 1,
            taskName: 'Planning',
            startDate: new Date('02/03/2017'),
            endDate: new Date('02/07/2017'),
            progress: 100,
            duration: 123232.243,
            priority: 'Normal',
            approved: false,
            isInExpandState: true,
            isExpand: false,
            subtasks: [
                {
                    taskID: 2,
                    taskName: 'Plan timeline',
                    startDate: new Date('02/03/2017'),
                    endDate: new Date('02/07/2017'),
                    duration: 5324234.212,
                    progress: 100,
                    priority: 'Normal',
                    approved: false,
                    direction: 'in'
                },
                {
                    taskID: 3,
                    taskName: 'Plan budget',
                    startDate: new Date('02/03/2017'),
                    endDate: new Date('02/07/2017'),
                    duration: 5234234.129,
                    progress: 100,
                    approved: true,
                    direction: 'out'
                },
            ]
        },
        {
            taskID: 6,
            taskName: 'Design',
            startDate: new Date('02/10/2017'),
            endDate: new Date('02/14/2017'),
            duration: 3,
            progress: 86,
            priority: 'High',
            isInExpandState: false,
            approved: false,
            subtasks: [
                {
                    taskID: 7,
                    taskName: 'Software Specification',
                    startDate: new Date('02/10/2017'),
                    endDate: new Date('02/12/2017'),
                    duration: 3,
                    progress: 60,
                    priority: 'Normal',
                    approved: false
                },
                {
                    taskID: 8,
                    taskName: 'Develop prototype',
                    startDate: new Date('02/10/2017'),
                    endDate: new Date('02/12/2017'),
                    duration: 3,
                    progress: 100,
                    priority: 'Critical',
                    approved: false
                },
                {
                    taskID: 9,
                    taskName: 'Get approval from customer',
                    startDate: new Date('02/13/2017'),
                    endDate: new Date('02/14/2017'),
                    duration: 2,
                    progress: 100,
                    approved: true
                },
                {
                    taskID: 10,
                    taskName: 'Design Documentation',
                    startDate: new Date('02/13/2017'),
                    endDate: new Date('02/14/2017'),
                    duration: 2,
                    progress: 100,
                    approved: true
                },
                {
                    taskID: 11,
                    taskName: 'Design complete',
                    startDate: new Date('02/14/2017'),
                    endDate: new Date('02/14/2017'),
                    duration: 0,
                    progress: 0,
                    priority: 'Normal',
                    approved: true
                }
            ]
        },
        {
            taskID: 12,
            taskName: 'Implementation Phase',
            startDate: new Date('02/17/2017'),
            endDate: new Date('02/27/2017'),
            priority: 'Normal',
            approved: false,
            duration: 11,
            subtasks: [
                {
                    taskID: 13,
                    taskName: 'Phase 1',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/27/2017'),
                    priority: 'High',
                    approved: false,
                    duration: 11,
                    subtasks: [{
                        taskID: 14,
                        taskName: 'Implementation Module 1',
                        startDate: new Date('02/17/2017'),
                        endDate: new Date('02/27/2017'),
                        priority: 'Normal',
                        duration: 11,
                        approved: false,
                        subtasks: [
                            {
                                taskID: 15,
                                taskName: 'Development Task 1',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/19/2017'),
                                duration: 3,
                                progress: '50',
                                priority: 'High',
                                approved: false
                            },
                            {
                                taskID: 16,
                                taskName: 'Development Task 2',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/19/2017'),
                                duration: 3,
                                progress: '50',
                                priority: 'Low',
                                approved: true
                            },
                            {
                                taskID: 17,
                                taskName: 'Testing',
                                startDate: new Date('02/20/2017'),
                                endDate: new Date('02/21/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Normal',
                                approved: true
                            },
                            {
                                taskID: 18,
                                taskName: 'Bug fix',
                                startDate: new Date('02/24/2017'),
                                endDate: new Date('02/25/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Critical',
                                approved: false
                            },
                            {
                                taskID: 19,
                                taskName: 'Customer review meeting',
                                startDate: new Date('02/26/2017'),
                                endDate: new Date('02/27/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'High',
                                approved: false
                            },
                            {
                                taskID: 20,
                                taskName: 'Phase 1 complete',
                                startDate: new Date('02/27/2017'),
                                endDate: new Date('02/27/2017'),
                                duration: 0,
                                priority: 'Low',
                                approved: true
                            }

                        ]
                    }]
                },
                {
                    taskID: 21,
                    taskName: 'Phase 2',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/28/2017'),
                    priority: 'High',
                    approved: false,
                    duration: 12,
                    subtasks: [{
                        taskID: 22,
                        taskName: 'Implementation Module 2',
                        startDate: new Date('02/17/2017'),
                        endDate: new Date('02/28/2017'),
                        priority: 'Critical',
                        approved: false,
                        duration: 12,
                        subtasks: [
                            {
                                taskID: 23,
                                taskName: 'Development Task 1',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/20/2017'),
                                duration: 4,
                                progress: '50',
                                priority: 'Normal',
                                approved: true
                            },
                            {
                                taskID: 24,
                                taskName: 'Development Task 2',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/20/2017'),
                                duration: 4,
                                progress: '50',
                                priority: 'Critical',
                                approved: true
                            },
                            {
                                taskID: 25,
                                taskName: 'Testing',
                                startDate: new Date('02/21/2017'),
                                endDate: new Date('02/24/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'High',
                                approved: false
                            },
                            {
                                taskID: 26,
                                taskName: 'Bug fix',
                                startDate: new Date('02/25/2017'),
                                endDate: new Date('02/26/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Low',
                                approved: false
                            },
                            {
                                taskID: 27,
                                taskName: 'Customer review meeting',
                                startDate: new Date('02/27/2017'),
                                endDate: new Date('02/28/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Critical',
                                approved: true
                            },
                            {
                                taskID: 28,
                                taskName: 'Phase 2 complete',
                                startDate: new Date('02/28/2017'),
                                endDate: new Date('02/28/2017'),
                                duration: 0,
                                priority: 'Normal',
                                approved: false
                            }

                        ]
                    }]
                },

                {
                    taskID: 29,
                    taskName: 'Phase 3',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/27/2017'),
                    priority: 'Normal',
                    approved: false,
                    duration: 11,
                    subtasks: [{
                        taskID: 30,
                        taskName: 'Implementation Module 3',
                        startDate: new Date('02/17/2017'),
                        endDate: new Date('02/27/2017'),
                        priority: 'High',
                        approved: false,
                        duration: 11,
                        subtasks: [
                            {
                                taskID: 31,
                                taskName: 'Development Task 1',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/19/2017'),
                                duration: 3,
                                progress: '50',
                                priority: 'Low',
                                approved: true
                            },
                            {
                                taskID: 32,
                                taskName: 'Development Task 2',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/19/2017'),
                                duration: 3,
                                progress: '50',
                                priority: 'Normal',
                                approved: false
                            },
                            {
                                taskID: 33,
                                taskName: 'Testing',
                                startDate: new Date('02/20/2017'),
                                endDate: new Date('02/21/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Critical',
                                approved: true
                            },
                            {
                                taskID: 34,
                                taskName: 'Bug fix',
                                startDate: new Date('02/24/2017'),
                                endDate: new Date('02/25/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'High',
                                approved: false
                            },
                            {
                                taskID: 35,
                                taskName: 'Customer review meeting',
                                startDate: new Date('02/26/2017'),
                                endDate: new Date('02/27/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Normal',
                                approved: true
                            },
                            {
                                taskID: 36,
                                taskName: 'Phase 3 complete',
                                startDate: new Date('02/27/2017'),
                                endDate: new Date('02/27/2017'),
                                duration: 0,
                                priority: 'Critical',
                                approved: false
                            },
                        ]
                    }]
                }
            ]
        },
        {
            taskID: 1,
            taskName: 'Planning',
            startDate: new Date('02/03/2017'),
            endDate: new Date('02/07/2017'),
            progress: 100,
            duration: 123232.243,
            priority: 'Normal',
            approved: false,
            isInExpandState: true,
            subtasks: [
                {
                    taskID: 2,
                    taskName: 'Plan timeline',
                    startDate: new Date('02/03/2017'),
                    endDate: new Date('02/07/2017'),
                    duration: 5324234.212,
                    progress: 100,
                    priority: 'Normal',
                    approved: false
                },
                {
                    taskID: 3,
                    taskName: 'Plan budget',
                    startDate: new Date('02/03/2017'),
                    endDate: new Date('02/07/2017'),
                    duration: 5234234.129,
                    progress: 100,
                    approved: true
                },
                {
                    taskID: 4,
                    taskName: 'Allocate resources',
                    startDate: new Date('02/03/2017'),
                    endDate: new Date('02/07/2017'),
                    duration: 2124215,
                    progress: 100,
                    priority: 'Critical',
                    approved: false
                },
                {
                    taskID: 5,
                    taskName: 'Planning complete',
                    startDate: new Date('02/07/2017'),
                    endDate: new Date('02/07/2017'),
                    duration: 0,
                    progress: 0,
                    priority: 'Low',
                    approved: true
                }
            ]
        },
        {
            taskID: 6,
            taskName: 'Design',
            startDate: new Date('02/10/2017'),
            endDate: new Date('02/14/2017'),
            duration: 3,
            progress: 86,
            priority: 'High',
            isInExpandState: false,
            approved: false,
            subtasks: [
                {
                    taskID: 7,
                    taskName: 'Software Specification',
                    startDate: new Date('02/10/2017'),
                    endDate: new Date('02/12/2017'),
                    duration: 3,
                    progress: 60,
                    priority: 'Normal',
                    approved: false
                },
                {
                    taskID: 8,
                    taskName: 'Develop prototype',
                    startDate: new Date('02/10/2017'),
                    endDate: new Date('02/12/2017'),
                    duration: 3,
                    progress: 100,
                    priority: 'Critical',
                    approved: false
                },
                {
                    taskID: 9,
                    taskName: 'Get approval from customer',
                    startDate: new Date('02/13/2017'),
                    endDate: new Date('02/14/2017'),
                    duration: 2,
                    progress: 100,
                    approved: true
                },
                {
                    taskID: 10,
                    taskName: 'Design Documentation',
                    startDate: new Date('02/13/2017'),
                    endDate: new Date('02/14/2017'),
                    duration: 2,
                    progress: 100,
                    approved: true
                },
                {
                    taskID: 11,
                    taskName: 'Design complete',
                    startDate: new Date('02/14/2017'),
                    endDate: new Date('02/14/2017'),
                    duration: 0,
                    progress: 0,
                    priority: 'Normal',
                    approved: true
                }
            ]
        },
        {
            taskID: 12,
            taskName: 'Implementation Phase',
            startDate: new Date('02/17/2017'),
            endDate: new Date('02/27/2017'),
            priority: 'Normal',
            approved: false,
            duration: 11,
            subtasks: [
                {
                    taskID: 13,
                    taskName: 'Phase 1',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/27/2017'),
                    priority: 'High',
                    approved: false,
                    duration: 11,
                    subtasks: [{
                        taskID: 14,
                        taskName: 'Implementation Module 1',
                        startDate: new Date('02/17/2017'),
                        endDate: new Date('02/27/2017'),
                        priority: 'Normal',
                        duration: 11,
                        approved: false,
                        subtasks: [
                            {
                                taskID: 15,
                                taskName: 'Development Task 1',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/19/2017'),
                                duration: 3,
                                progress: '50',
                                priority: 'High',
                                approved: false
                            },
                            {
                                taskID: 16,
                                taskName: 'Development Task 2',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/19/2017'),
                                duration: 3,
                                progress: '50',
                                priority: 'Low',
                                approved: true
                            },
                            {
                                taskID: 17,
                                taskName: 'Testing',
                                startDate: new Date('02/20/2017'),
                                endDate: new Date('02/21/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Normal',
                                approved: true
                            },
                            {
                                taskID: 18,
                                taskName: 'Bug fix',
                                startDate: new Date('02/24/2017'),
                                endDate: new Date('02/25/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Critical',
                                approved: false
                            },
                            {
                                taskID: 19,
                                taskName: 'Customer review meeting',
                                startDate: new Date('02/26/2017'),
                                endDate: new Date('02/27/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'High',
                                approved: false
                            },
                            {
                                taskID: 20,
                                taskName: 'Phase 1 complete',
                                startDate: new Date('02/27/2017'),
                                endDate: new Date('02/27/2017'),
                                duration: 0,
                                priority: 'Low',
                                approved: true
                            }

                        ]
                    }]
                },
                {
                    taskID: 21,
                    taskName: 'Phase 2',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/28/2017'),
                    priority: 'High',
                    approved: false,
                    duration: 12,
                    subtasks: [{
                        taskID: 22,
                        taskName: 'Implementation Module 2',
                        startDate: new Date('02/17/2017'),
                        endDate: new Date('02/28/2017'),
                        priority: 'Critical',
                        approved: false,
                        duration: 12,
                        subtasks: [
                            {
                                taskID: 23,
                                taskName: 'Development Task 1',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/20/2017'),
                                duration: 4,
                                progress: '50',
                                priority: 'Normal',
                                approved: true
                            },
                            {
                                taskID: 24,
                                taskName: 'Development Task 2',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/20/2017'),
                                duration: 4,
                                progress: '50',
                                priority: 'Critical',
                                approved: true
                            },
                            {
                                taskID: 25,
                                taskName: 'Testing',
                                startDate: new Date('02/21/2017'),
                                endDate: new Date('02/24/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'High',
                                approved: false
                            },
                            {
                                taskID: 26,
                                taskName: 'Bug fix',
                                startDate: new Date('02/25/2017'),
                                endDate: new Date('02/26/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Low',
                                approved: false
                            },
                            {
                                taskID: 27,
                                taskName: 'Customer review meeting',
                                startDate: new Date('02/27/2017'),
                                endDate: new Date('02/28/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Critical',
                                approved: true
                            },
                            {
                                taskID: 28,
                                taskName: 'Phase 2 complete',
                                startDate: new Date('02/28/2017'),
                                endDate: new Date('02/28/2017'),
                                duration: 0,
                                priority: 'Normal',
                                approved: false
                            }

                        ]
                    }]
                },

                {
                    taskID: 29,
                    taskName: 'Phase 3',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/27/2017'),
                    priority: 'Normal',
                    approved: false,
                    duration: 11,
                    subtasks: [{
                        taskID: 30,
                        taskName: 'Implementation Module 3',
                        startDate: new Date('02/17/2017'),
                        endDate: new Date('02/27/2017'),
                        priority: 'High',
                        approved: false,
                        duration: 11,
                        subtasks: [
                            {
                                taskID: 31,
                                taskName: 'Development Task 1',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/19/2017'),
                                duration: 3,
                                progress: '50',
                                priority: 'Low',
                                approved: true
                            },
                            {
                                taskID: 32,
                                taskName: 'Development Task 2',
                                startDate: new Date('02/17/2017'),
                                endDate: new Date('02/19/2017'),
                                duration: 3,
                                progress: '50',
                                priority: 'Normal',
                                approved: false
                            },
                            {
                                taskID: 33,
                                taskName: 'Testing',
                                startDate: new Date('02/20/2017'),
                                endDate: new Date('02/21/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Critical',
                                approved: true
                            },
                            {
                                taskID: 34,
                                taskName: 'Bug fix',
                                startDate: new Date('02/24/2017'),
                                endDate: new Date('02/25/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'High',
                                approved: false
                            },
                            {
                                taskID: 35,
                                taskName: 'Customer review meeting',
                                startDate: new Date('02/26/2017'),
                                endDate: new Date('02/27/2017'),
                                duration: 2,
                                progress: '0',
                                priority: 'Normal',
                                approved: true
                            },
                            {
                                taskID: 36,
                                taskName: 'Phase 3 complete',
                                startDate: new Date('02/27/2017'),
                                endDate: new Date('02/27/2017'),
                                duration: 0,
                                priority: 'Critical',
                                approved: false
                            },
                        ]
                    }]
                }
            ]
        }
    ];

    virtualData: any[] = [];

    dataSource() {
        let parent: number = -1;
        let crew: string = 'Crew';
        let parentId: number;
        let names: string[] = ['VINET', 'TOMSP', 'HANAR', 'VICTE', 'SUPRD', 'HANAR', 'CHOPS', 'RICSU', 'WELLI', 'HILAA', 'ERNSH', 'CENTC',
            'OTTIK', 'QUEDE', 'RATTC', 'ERNSH', 'FOLKO', 'BLONP', 'WARTH', 'FRANK', 'GROSR', 'WHITC', 'WARTH', 'SPLIR', 'RATTC', 'QUICK', 'VINET',
            'MAGAA', 'TORTU', 'MORGK', 'BERGS', 'LEHMS', 'BERGS', 'ROMEY', 'ROMEY', 'LILAS', 'LEHMS', 'QUICK', 'QUICK', 'RICAR', 'REGGC', 'BSBEV',
            'COMMI', 'QUEDE', 'TRADH', 'TORTU', 'RATTC', 'VINET', 'LILAS', 'BLONP', 'HUNGO', 'RICAR', 'MAGAA', 'WANDK', 'SUPRD', 'GODOS', 'TORTU',
            'OLDWO', 'ROMEY', 'LONEP', 'ANATR', 'HUNGO', 'THEBI', 'DUMON', 'WANDK', 'QUICK', 'RATTC', 'ISLAT', 'RATTC', 'LONEP', 'ISLAT', 'TORTU',
            'WARTH', 'ISLAT', 'PERIC', 'KOENE', 'SAVEA', 'KOENE', 'BOLID', 'FOLKO', 'FURIB', 'SPLIR', 'LILAS', 'BONAP', 'MEREP', 'WARTH', 'VICTE',
            'HUNGO', 'PRINI', 'FRANK', 'OLDWO', 'MEREP', 'BONAP', 'SIMOB', 'FRANK', 'LEHMS', 'WHITC', 'QUICK', 'RATTC', 'FAMIA'];
        for (let i: number = 0; i < 50000; i++) {
            if (i % 5 === 0) {
                parent = i;
            }
            if (i % 5 !== 0) {
                let num: number = isNaN((this.virtualData.length % parent) - 1) ? 0 : (this.virtualData.length % parent) - 1;
                this.virtualData[num][crew].push({
                    'TaskID': i + 1,
                    'FIELD1': names[Math.floor(Math.random() * names.length)],
                    'FIELD2': 1967 + (i % 10),
                    'FIELD3': Math.floor(Math.random() * 200),
                    'FIELD4': Math.floor(Math.random() * 100),
                    'FIELD5': Math.floor(Math.random() * 2000),
                    'FIELD6': Math.floor(Math.random() * 1000),
                    'FIELD7': Math.floor(Math.random() * 100),
                    'FIELD8': Math.floor(Math.random() * 10),
                    'FIELD9': Math.floor(Math.random() * 10),
                    'FIELD10': Math.floor(Math.random() * 100),
                    'FIELD11': Math.floor(Math.random() * 100),
                    'FIELD12': Math.floor(Math.random() * 1000),
                    'FIELD13': Math.floor(Math.random() * 10),
                    'FIELD14': Math.floor(Math.random() * 10),
                    'FIELD15': Math.floor(Math.random() * 1000),
                    'FIELD16': Math.floor(Math.random() * 200),
                    'FIELD17': Math.floor(Math.random() * 300),
                    'FIELD18': Math.floor(Math.random() * 400),
                    'FIELD19': Math.floor(Math.random() * 500),
                    'FIELD20': Math.floor(Math.random() * 700),
                    'FIELD21': Math.floor(Math.random() * 800),
                    'FIELD22': Math.floor(Math.random() * 1000),
                    'FIELD23': Math.floor(Math.random() * 2000),
                    'FIELD24': Math.floor(Math.random() * 150),
                    'FIELD25': Math.floor(Math.random() * 1000),
                    'FIELD26': Math.floor(Math.random() * 100),
                    'FIELD27': Math.floor(Math.random() * 400),
                    'FIELD28': Math.floor(Math.random() * 600),
                    'FIELD29': Math.floor(Math.random() * 500),
                    'FIELD30': Math.floor(Math.random() * 300),
                });
            } else {
                this.virtualData.push({
                    'TaskID': i + 1,
                    'Crew': [],
                    'FIELD1': names[Math.floor(Math.random() * names.length)],
                    'FIELD2': 1967 + (i % 10),
                    'FIELD3': Math.floor(Math.random() * 200),
                    'FIELD4': Math.floor(Math.random() * 100),
                    'FIELD5': Math.floor(Math.random() * 2000),
                    'FIELD6': Math.floor(Math.random() * 1000),
                    'FIELD7': Math.floor(Math.random() * 100),
                    'FIELD8': Math.floor(Math.random() * 10),
                    'FIELD9': Math.floor(Math.random() * 10),
                    'FIELD10': Math.floor(Math.random() * 100),
                    'FIELD11': Math.floor(Math.random() * 100),
                    'FIELD12': Math.floor(Math.random() * 1000),
                    'FIELD13': Math.floor(Math.random() * 10),
                    'FIELD14': Math.floor(Math.random() * 10),
                    'FIELD15': Math.floor(Math.random() * 1000),
                    'FIELD16': Math.floor(Math.random() * 200),
                    'FIELD17': Math.floor(Math.random() * 300),
                    'FIELD18': Math.floor(Math.random() * 400),
                    'FIELD19': Math.floor(Math.random() * 500),
                    'FIELD20': Math.floor(Math.random() * 700),
                    'FIELD21': Math.floor(Math.random() * 800),
                    'FIELD22': Math.floor(Math.random() * 1000),
                    'FIELD23': Math.floor(Math.random() * 2000),
                    'FIELD24': Math.floor(Math.random() * 150),
                    'FIELD25': Math.floor(Math.random() * 1000),
                    'FIELD26': Math.floor(Math.random() * 100),
                    'FIELD27': Math.floor(Math.random() * 400),
                    'FIELD28': Math.floor(Math.random() * 600),
                    'FIELD29': Math.floor(Math.random() * 500),
                    'FIELD30': Math.floor(Math.random() * 300),
                });
            }
        }
    }
}
