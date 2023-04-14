import {EventEmitter} from 'events';

export default class Sizes extends EventEmitter{
    constructor() {
        super();
        this.theme = "light";

        this.toggleButton = document.querySelector(".toggle-button");
        this.toggleCircle = document.querySelector(".toggle-circle");

        this.setEventListen();
    }

    setEventListen(){
        this.toggleButton.addEventListener("click",()=>{
            this.toggleCircle.classList.toggle("slide");
            this.theme = this.theme === "light" ? "dark": "light";
            document.body.classList.toggle("dark-theme");
            document.body.classList.toggle("light-theme");

            this.emit("switch",this.theme);
        })
    }
}