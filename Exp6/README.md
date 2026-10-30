# Experiment 6: CampusConnect Registration Revenue Processor

## 1. Overview
The **CampusConnect Registration Revenue Processor** is a standalone Kotlin console application designed to process campus-event registration fee entries safely using Kotlin exception handling mechanisms and functional collection transformations.

---

## 2. Concept Explanations

### A. Difference Between `try`, `catch`, and `finally`
- **`try`**: Encapsulates code blocks that may potentially throw an exception (e.g., converting an invalid String to a numeric Double or validating custom constraints).
- **`catch`**: Handles specific exception types (e.g., `NumberFormatException`, `IllegalArgumentException`) thrown within the `try` block. It prevents unexpected application crashes and enables fallback logic or error logging.
- **`finally`**: A block that **always** executes, regardless of whether an exception occurred or was handled. It is commonly used for resource cleanup (closing streams, releasing database locks) or executing mandatory audit trails.

### B. Why Input Validation is Important
- **Data Integrity & Consistency**: Prevents invalid, corrupted, or unexpected values (such as non-numeric strings, negative registration fees, or empty strings) from propagating into the financial aggregation logic.
- **Crash Prevention**: Prevents uncaught runtime exceptions like `NumberFormatException`, ensuring high application resilience and uptime.
- **Audit & Transparency**: Enables reporting rejected entries alongside explicit reasons for organizers and participants.

### C. Difference Between `map`, `filter`, `reduce`, and `fold`
| Operation | Purpose | Input / Output Structure | Initial Value Required? |
|---|---|---|---|
| **`map`** | Transforms every element in the collection into a new element according to a transformation lambda. | Transforms `List<T>` to `List<R>` of identical length. | No |
| **`filter`** | Evaluates a predicate condition for every element and keeps only those matching the condition (`true`). | Returns a subset `List<T>`. | No |
| **`reduce`** | Accumulates collection elements into a single aggregate value from left to right, using the **first element** as the initial accumulator. | Returns a single aggregate value of type `T`. Fails with `UnsupportedOperationException` if empty. | No |
| **`fold`** | Accumulates collection elements into a single aggregate value starting with an **explicit initial value**. | Returns a single accumulated value of type `R`. Safe to run on empty collections. | **Yes** |

---

## 3. How to Run

### Option 1: Direct Execution using Kotlin Script / Compiler
```bash
kotlinc RegistrationRevenueProcessor.kt -include-runtime -d RegistrationRevenueProcessor.jar
java -jar RegistrationRevenueProcessor.jar
```

### Option 2: Run directly with Kotlin CLI runner (if configured)
```bash
kotlin RegistrationRevenueProcessor.kt
```

---

## 4. Expected Console Output

```text
================================================================================
          CAMPUSCONNECT: REGISTRATION REVENUE PROCESSOR (EXPERIMENT 6)          
================================================================================

1. RAW INPUTS RECEIVED:
   [500, 750, invalid, , -200, 1000, N/A, 350]

2. PROCESSING & VALIDATING RAW INPUTS:
   Validation completed.

================================================================================
                             STRUCTURED AUDIT REPORT                            
================================================================================

[A] ACCEPTED EVENT REGISTRATION FEES (4 valid entries):
    1. INR 500.00
    2. INR 750.00
    3. INR 1000.00
    4. INR 350.00

[B] REJECTED ENTRIES WITH REASONS (4 invalid entries):
    1. Input: 'invalid'        -> Reason: Not a valid numeric amount ('invalid')
    2. Input: <EMPTY STRING>   -> Reason: Empty or whitespace entry
    3. Input: '-200'           -> Reason: Negative fee amount (-200.0) is not allowed
    4. Input: 'N/A'            -> Reason: Not a valid numeric amount ('N/A')

[C] CHARGED FEES AFTER 10% SERVICE CHARGE (via map & forEach):
    1. Original: INR 500.00   + 10% Charge -> INR 550.00
    2. Original: INR 750.00   + 10% Charge -> INR 825.00
    3. Original: INR 1000.00  + 10% Charge -> INR 1100.00
    4. Original: INR 350.00   + 10% Charge -> INR 385.00

[D] HIGH-VALUE PAYMENTS (>= INR 500) (via filter):
    1. INR 500.00
    2. INR 750.00
    3. INR 1000.00

[E] REVENUE SUMMARY & TREASURY ACCUMULATION:
    - Total Valid Registration Revenue (via reduce) : INR 2600.00
    - Initial Campus Fund Balance                   : INR 2500.00
    - Final Campus Fund Balance (via fold)           : INR 5100.00

================================================================================
                      PROCESSING COMPLETED SUCCESSFULLY                         
================================================================================
```
