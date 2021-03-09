"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
const rest_1 = require("@octokit/rest");
const match_all_1 = __importDefault(require("match-all"));
function main() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = github.context.payload;
            const owner = (_a = payload.repository) === null || _a === void 0 ? void 0 : _a.owner.login;
            const repo = (_b = payload.repository) === null || _b === void 0 ? void 0 : _b.name;
            const token = process.env['GITHUB_TOKEN'];
            const octokit = new rest_1.Octokit({
                auth: token,
            });
            if (owner && repo) {
                const { data } = yield octokit.pulls.list({
                    owner,
                    repo,
                    state: 'closed',
                });
                const resultArr = [];
                if (data.length > 0) {
                    const result = data.find(pr => pr.merge_commit_sha === github.context.sha);
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
                const jiraKeys = resultArr.join(',').toUpperCase();
                core.info(`JiraKeys: ${jiraKeys}`);
                core.setOutput('jiraKeys', jiraKeys);
            }
            else {
                core.error('🚧️ Cannot find owner or repo.');
            }
        }
        catch (e) {
            core.setFailed(e.message);
        }
    });
}
main();
