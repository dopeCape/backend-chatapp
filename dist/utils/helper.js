"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_move = void 0;
function array_move(arr, old_index, new_index) {
    //just a function that moves a item in a arra to given index
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}
exports.array_move = array_move;
