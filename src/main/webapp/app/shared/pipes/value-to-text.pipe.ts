import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'valueToText',
})
export class ValueToTextPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): unknown {
        const dataList: any[] = args[0] as any[];
        const nameField: string = args[1] as string;
        const valueField: string = args[2] as string;
        const obj = dataList.filter(e => e[valueField] === value)[0];
        // return obj?.[nameField] ?? '';
        if (obj[nameField]){
            return obj[nameField];
        }else {
            return '';
        }
    }

}
