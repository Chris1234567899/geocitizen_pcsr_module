import { Component, EventEmitter, Input, Output } from '@angular/core';



@Component({
    selector: "post-label",
    template: `
    
    

    <div class="label" [ngStyle]="{'color': color}" (click)="click()">
        <span class="filler" [ngStyle]="{'background': color}"></span>
        <span class="content">
            <ng-content></ng-content>
        </span>
    </div>
    
    ` ,
    styles: [
        `
      

          .label {
            margin: 2px 2px;
            font-size: 0.9em;
            padding: 0px 6px;
            border-radius: 20px;
            border: 1px solid;
            position: relative;
            cursor: pointer;

            display: flex;
            align-items: center;
          }

          .content{
            display: flex;
            align-items: center;
          }
          
          .filler {
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            opacity: 0.25;
            background: inherit;
            z-index: 0;
            border-radius: 20px;
          }

        

       
        `
    ]


})
export class PostLabelComponent {

    @Input() color: string;
    @Input() round: boolean = true;

    @Output() onClick = new EventEmitter();



    click() {
        this.onClick.emit();
    }

}