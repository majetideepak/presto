/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { clsx } from 'clsx';

import {getHumanReadableState, getProgressBarPercentage, getProgressBarTitle, getQueryStateColor, isQueryEnded} from "../utils";

export class QueryHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    renderProgressBar() {
        const query = this.props.query;
        const queryStateColor = getQueryStateColor(
            query.state,
            query.queryStats && query.queryStats.fullyBlocked,
            query.errorType,
            query.errorCode ? query.errorCode.name : null
        );
        const humanReadableState = getHumanReadableState(
            query.state,
            query.state === "RUNNING" && query.scheduled && query.queryStats.totalDrivers > 0 && query.queryStats.runningDrivers >= 0,
            query.queryStats.fullyBlocked,
            query.queryStats.blockedReasons,
            query.memoryPool,
            query.errorType,
            query.errorCode ? query.errorCode.name : null
        );
        const progressPercentage = getProgressBarPercentage(query.queryStats.progressPercentage, query.state);
        const progressBarStyle = {width: progressPercentage + "%", backgroundColor: queryStateColor};
        const progressBarTitle = getProgressBarTitle(query.queryStats.progressPercentage, query.state, humanReadableState);

        if (isQueryEnded(query.state)) {
            return (
                <div className="progress-large">
                    <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin="0" aria-valuemax="100"
                         style={progressBarStyle}>
                        {progressBarTitle}
                    </div>
                </div>
            );
        }

        return (
            <table>
                <tbody>
                <tr>
                    <td width="100%">
                        <div className="progress-large">
                            <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin="0" aria-valuemax="100"
                                 style={progressBarStyle}>
                                {progressBarTitle}
                            </div>
                        </div>
                    </td>
                    <td>
                        <a onClick={() => $.ajax({url: '/v1/query/' + query.queryId + '/preempted', type: 'PUT', data: "Preempted via web UI"})} className="btn btn-warning"
                           target="_blank">
                            Preempt
                        </a>
                    </td>
                    <td>
                        <a onClick={() => $.ajax({url: '/v1/query/' + query.queryId + '/killed', type: 'PUT', data: "Killed via web UI"})} className="btn btn-warning"
                           target="_blank">
                            Kill
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }

    isActive(path) {
        if (window.location.pathname.includes(path)) {
            return  true;
        }

        return false;
    }

    render() {
        const query = this.props.query;
        const queryId = this.props.query.queryId;
        const tabs = [
            {path: 'query.html', label: 'Overview'},
            {path: 'plan.html', label: 'Live Plan'},
            {path: 'stage.html', label: 'Stage Performance'},
            {path: 'timeline.html', label: 'Splits'},
        ];
        return (
            <div>
                <div className="row mt-4">
                    <div className="col-6">
                        <h3 className="query-id">
                            <span id="query-id">{query.queryId}</span>
                            <a className="btn copy-button" data-clipboard-target="#query-id" data-bs-toggle="tooltip" data-bs-placement="right" title="Copy to clipboard">
                                <span className="bi bi-copy" aria-hidden="true" alt="Copy to clipboard"/>
                            </a>
                        </h3>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <nav className="nav nav-tabs">
                            {tabs.map((page, _) => (
                                <>
                                    <a className={clsx('nav-link', 'navbar-btn', this.isActive(page.path) && 'active')} href={page.path + '?' + queryId} >{page.label}</a>
                                    &nbsp;
                                </>
                            ))}
                            <a className="nav-link navbar-btn" href={"/v1/query/" + query.queryId + "?pretty"} target="_blank">JSON</a>
                        </nav>
                    </div>
                </div>
                <hr className="h2-hr"/>
                <div className="row">
                    <div className="col-12">
                        {this.renderProgressBar()}
                    </div>
                </div>
            </div>
        );
    }
}
