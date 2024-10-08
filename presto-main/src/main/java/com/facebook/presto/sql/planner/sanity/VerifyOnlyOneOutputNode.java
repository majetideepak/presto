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
package com.facebook.presto.sql.planner.sanity;

import com.facebook.presto.Session;
import com.facebook.presto.metadata.Metadata;
import com.facebook.presto.spi.WarningCollector;
import com.facebook.presto.spi.plan.OutputNode;
import com.facebook.presto.spi.plan.PlanNode;

import static com.facebook.presto.sql.planner.optimizations.PlanNodeSearcher.searchFrom;
import static com.google.common.base.Preconditions.checkState;

public final class VerifyOnlyOneOutputNode
        implements PlanChecker.Checker
{
    @Override
    public void validate(PlanNode plan, Session session, Metadata metadata, WarningCollector warningCollector)
    {
        int outputPlanNodesCount = searchFrom(plan)
                .where(OutputNode.class::isInstance)
                .findAll()
                .size();
        checkState(outputPlanNodesCount == 1, "Expected plan to have single instance of OutputNode");
    }
}
