/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
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

#include <gtest/gtest.h>

#include "presto_cpp/main/functions/DynamicLibraryLoader.h"
#include "velox/functions/FunctionRegistry.h"
#include "velox/functions/prestosql/tests/utils/FunctionBaseTest.h"

namespace facebook::presto::functions::test {

class DynamicLinkTest : public velox::functions::test::FunctionBaseTest {};

TEST_F(DynamicLinkTest, dynamicLoad) {
  const auto dynamicFunction = [&](std::optional<int64_t> a) {
    return evaluateOnce<int64_t>("dynamic_123()", a);
  };

  auto signaturesBefore = velox::getFunctionSignatures().size();

  // Function does not exist yet.
  EXPECT_THROW(dynamicFunction(0), std::invalid_argument);

  // Dynamically load the library.
  std::string libraryPath = MY_DYNAMIC_FUNCTION_LIBRARY_PATH;
  libraryPath += "/libvelox_function_my_dynamic.so";

  loadDynamicLibraryFunctions(libraryPath.data());

  auto signaturesAfter = velox::getFunctionSignatures().size();
  EXPECT_EQ(signaturesAfter, signaturesBefore + 1);

  // Make sure the function exists now.
  EXPECT_EQ(123, dynamicFunction(0));
}

} // namespace facebook::velox::functions::test
