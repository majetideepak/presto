# To test functions being added by dynamically linked libraries, we compile
# `MyDynamicTestFunction.cpp` as a small .so library, and use the
# MY_DYNAMIC_FUNCTION_LIBRARY_PATH macro to locate the .so binary.

add_compile_definitions(
  MY_DYNAMIC_FUNCTION_LIBRARY_PATH="${CMAKE_CURRENT_BINARY_DIR}")
add_library(presto_function_my_dynamic SHARED MyDynamicTestFunction.cpp)

# target_link_libraries(presto_function_my_dynamic)
target_link_libraries(presto_function_my_dynamic PRIVATE xsimd fmt)
                     # looks like these are unnecessary for compiling velox_vector velox_core velox_exec)#velox_expression)

# Here's the actual test which will dynamically load the library defined above.
add_executable(presto_function_dynamic_link_test DynamicLinkTest.cpp)

add_test(NAME presto_function_dynamic_link_test
         COMMAND presto_function_dynamic_link_test)

target_link_libraries(
  presto_function_dynamic_link_test
#  velox_functions_test_lib
  presto_dynamic_function_loader
  velox_function_registry
  xsimd
  gmock
  ${GTEST_BOTH_LIBRARIES})
