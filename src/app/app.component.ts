import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<canvas #chessCanvas class='chess-diag'
     [attr.width]='WIDTH'
     [attr.height]='HEIGHT'
     (mousedown)="mouseDownCanvas($event)"
     (mousemove)="myMove($event)"
     (mouseup)="myUp($event)"></canvas>`,
})

export class AppComponent {

  @ViewChild("chessCanvas") chessCanvas: ElementRef;
  context: CanvasRenderingContext2D
  rectangleHeight = 100;
  rectangleWeight = 150;
  WIDTH = 600;
  HEIGHT = 800;
  dragok = false;
  mousePosition: any = 100;
  objectArray: RectangleCanvas[] = [];
  numberMoved: number = 0;
  resultText: string = "";


  ngAfterViewInit() {
    this.context = this.chessCanvas.nativeElement.getContext("2d");
    this.initObjects();
    setInterval(() => { this.draw(); }, 10);
  }

  initObjects() {
    this.objectArray.push(new RectangleCanvas(100, 100, this.rectangleWeight, this.rectangleHeight, "AA"));
    this.objectArray.push(new RectangleCanvas(300, 100, this.rectangleWeight, this.rectangleHeight, "BB"));
    this.objectArray.push(new RectangleCanvas(500, 100, this.rectangleWeight, this.rectangleHeight, "CC"));
  }

  draw() {
    this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    this.rect(0, 0, this.WIDTH, this.HEIGHT);
    this.objectArray.forEach(element => {
      this.rectText(element.x - (element.width / 2), element.y - (element.heigh / 2), element.width, element.heigh, element.text);
    });
  }

  rect(x: any, y: any, w: any, h: any) {
    this.context.fillStyle = "#FAF7F8";
    this.context.beginPath();
    this.context.rect(x, y, w, h);
    this.context.closePath();
    this.context.fill();
    this.context.fillStyle = "#aa80ff";
    this.context.beginPath();
    this.context.rect(x, y + 9 * h / 10, w, h / 10);
    this.context.closePath();
    this.context.fill();
    this.context.font = "20px Arial";
    this.context.fillStyle = "#444444";
    this.context.fillText(this.resultText, x + w / 2, y + 9.5 * h / 10);
  }

  rectText(x: any, y: any, w: any, h: any, text: string) {
    this.context.fillStyle = "#444444";
    this.context.beginPath();
    this.context.rect(x, y, w, h);
    this.context.closePath();
    this.context.stroke();
    this.context.font = "20px Arial";
    this.context.fillText(text, x + w / 4, y + h / 2);
  }

  mouseDownCanvas(event: MouseEvent) {
    this.numberMoved = 0;
    for (let element of this.objectArray) {
      if (event.pageX < element.x + (element.width / 2) + this.chessCanvas.nativeElement.offsetLeft && event.pageX > element.x - (element.width / 2) +
        this.chessCanvas.nativeElement.offsetLeft && event.pageY < element.y + (element.heigh / 2) + this.chessCanvas.nativeElement.offsetTop &&
        event.pageY > element.y - (element.heigh / 2) + this.chessCanvas.nativeElement.offsetTop) {
        this.dragok = true;
        break;
      }
      this.numberMoved = this.numberMoved + 1;
    }
  }


  myMove(event: MouseEvent) {
    if (this.dragok) {
      for (let element of this.objectArray) {
        if (!(element === this.objectArray[this.numberMoved])) {
          if (Math.abs(element.x - (event.pageX - this.chessCanvas.nativeElement.offsetLeft)) < 10) {
            if (Math.abs(Math.abs(element.y - (event.pageY - this.chessCanvas.nativeElement.offsetTop)) - this.rectangleHeight) < 10) {
              if ((element.y - (event.pageY - this.chessCanvas.nativeElement.offsetTop)) > 0) {
                this.objectArray[this.numberMoved].x = element.x;
                this.objectArray[this.numberMoved].y = element.y - this.rectangleHeight;
              }
              else {
                this.objectArray[this.numberMoved].x = element.x;
                this.objectArray[this.numberMoved].y = element.y + this.rectangleHeight;
              }
              return;
            }
          }
        }
      }
      this.objectArray[this.numberMoved].x = event.pageX - this.chessCanvas.nativeElement.offsetLeft;
      this.objectArray[this.numberMoved].y = event.pageY - this.chessCanvas.nativeElement.offsetTop;
    }
  }

  myUp(event: MouseEvent) {
    this.dragok = false;
    var sortedArray = this.objectArray.sort((n1, n2) => n1.y - n2.y)
    var beforeElement = null;
    var startText = false;
    for (let element of this.objectArray) {
      if (beforeElement !== null) {
        if (beforeElement.x == element.x) {
          if (element.y - beforeElement.y == this.rectangleHeight) {
            if (startText) {
              this.resultText =  this.resultText + element.text;
            }
            else {
              this.resultText = beforeElement.text + element.text;
              startText = true;
            }
          }
        }
      }
      beforeElement = element;
    }

  }
}

class RectangleCanvas {
  x: number;
  y: number;
  width: number;
  heigh: number;
  text: string;

  constructor(x: number, y: number, width: number, heigh: number, text: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.heigh = heigh;
    this.text = text;
  }
}