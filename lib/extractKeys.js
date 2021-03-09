"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const match_all_1 = __importDefault(require("match-all"));
const getJiraKeys = (data, sha) => {
    const resultArr = [];
    if (data.length > 0) {
        const result = data.find(pr => pr.merge_commit_sha === sha);
        if (result) {
            const regex = /((([a-zA-Z]+)|([0-9]+))+-\d+)/g;
            const matches = match_all_1.default(result.head.ref, regex).toArray();
            matches.forEach((match) => {
                if (resultArr.find((element) => element === match)) {
                }
                else {
                    resultArr.push(match);
                }
            });
        }
    }
    return resultArr.join(',').toUpperCase();
};
exports.default = getJiraKeys;
