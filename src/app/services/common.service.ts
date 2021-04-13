import { Injectable } from '@angular/core';

declare var $: any;
@Injectable({
    providedIn: 'root'
})

export class CommonService {
    asyncLoop(iterations: number, func: Function, callback?: Function) {
        var index = 0;
        var done = false;
        var loop = {
            next: function () {
                if (done) {
                    return;
                }
                if (index < iterations) {
                    index++;
                    func(loop);
                } else {
                    done = true;
                    if (callback) { callback("finish"); }
                }
            },
            iteration: function () {
                return index - 1;
            },
            break: function () {
                done = true;
                if (callback) { callback("break"); }
            }
        };
        loop.next();
        return loop;
    }

    ValidateEmail(email: string) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    getTimeStamp() {
        let date = new Date();
        return (date.getTime());
    }

    showMessage(message: IToastMessage) {
        $.notify({ message: message.message }, { type: message.type || 'danger' });
    }

    showErrorMessage(message: string) {
        $.notify({ message: message }, { type: "danger" });
    }

    showSuccessMessage(message: string) {
        $.notify({ message: message }, { type: "success" });
    }

    APIErrorMessage() {
        this.showMessage({ message: "Error, Please try again later" });
    }

    getBase64(file: any) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resolve(reader.result)
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
                reject();
            };
        });
    }
}