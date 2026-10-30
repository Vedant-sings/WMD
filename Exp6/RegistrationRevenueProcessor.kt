/**
 * ============================================================================
 * Project: CampusConnect
 * Module: CampusConnect Registration Revenue Processor (Experiment 6)
 * Description: Process campus-event registration fee entries safely using Kotlin
 *              exception handling and collection operations.
 * ============================================================================
 */

package campusconnect.processor

/**
 * Custom data structure to record rejected fee entries along with rejection reason.
 */
data class RejectedEntry(
    val rawInput: String,
    val reason: String
)

/**
 * Reusable function to parse and validate an event registration fee string.
 *
 * Demonstrates:
 * - try-catch-finally block
 * - NumberFormatException handling for unparseable strings
 * - IllegalArgumentException handling for negative fees
 * - Nullable return type (Double?) for safe error propagation
 * - Meaningful custom error messages
 *
 * @param input Raw string representing registration fee
 * @return Parsed Double value if valid, or null if invalid
 */
fun parseRegistrationFee(input: String): Double? {
    var parsedValue: Double? = null

    try {
        val trimmed = input.trim()
        if (trimmed.isEmpty()) {
            throw IllegalArgumentException("Fee entry cannot be empty or whitespace.")
        }

        // Attempt numerical conversion
        val value = trimmed.toDouble()

        // Business rule validation: registration fee cannot be negative
        if (value < 0.0) {
            throw IllegalArgumentException("Fee cannot be negative (found: $value).")
        }

        parsedValue = value
    } catch (e: NumberFormatException) {
        // Catches non-numeric entries like "invalid", "N/A"
        println("[Validation Warning] Number format error for '$input': Not a valid decimal number.")
        parsedValue = null
    } catch (e: IllegalArgumentException) {
        // Catches empty strings and negative fees
        println("[Validation Warning] Validation error for '$input': ${e.message}")
        parsedValue = null
    } finally {
        // Finally block executes always, regardless of success or exception
        // Ideal for auditing, cleanup, or logging verification
        // (Kept concise for clean execution tracking)
    }

    return parsedValue
}

/**
 * Extended parser function that returns both the value (if valid) and the specific reason (if invalid).
 */
fun parseRegistrationFeeWithReason(input: String): Pair<Double?, String?> {
    var parsedValue: Double? = null
    var rejectionReason: String? = null

    try {
        val trimmed = input.trim()
        if (trimmed.isEmpty()) {
            throw IllegalArgumentException("Empty or whitespace entry")
        }

        val value = trimmed.toDouble()

        if (value < 0.0) {
            throw IllegalArgumentException("Negative fee amount ($value) is not allowed")
        }

        parsedValue = value
    } catch (e: NumberFormatException) {
        rejectionReason = "Not a valid numeric amount ('$input')"
    } catch (e: IllegalArgumentException) {
        rejectionReason = e.message ?: "Invalid fee argument"
    } finally {
        // Executes after every parse attempt
    }

    return Pair(parsedValue, rejectionReason)
}

fun main() {
    println("================================================================================")
    println("          CAMPUSCONNECT: REGISTRATION REVENUE PROCESSOR (EXPERIMENT 6)          ")
    println("================================================================================\n")

    // 1. Raw List<String> of registration fee inputs (including valid and invalid entries)
    val rawFees: List<String> = listOf("500", "750", "invalid", "", "-200", "1000", "N/A", "350")

    println("1. RAW INPUTS RECEIVED:")
    println("   " + rawFees.joinToString(separator = ", ", prefix = "[", postfix = "]"))
    println()

    // 2. Safe Parsing and Validation using try-catch-finally and reusable function
    println("2. PROCESSING & VALIDATING RAW INPUTS:")
    val acceptedFees = mutableListOf<Double>()
    val rejectedEntries = mutableListOf<RejectedEntry>()

    for (raw in rawFees) {
        val (fee, reason) = parseRegistrationFeeWithReason(raw)
        if (fee != null) {
            acceptedFees.add(fee)
        } else {
            rejectedEntries.add(RejectedEntry(raw, reason ?: "Unknown error"))
        }
    }
    println("   Validation completed.\n")

    // 3. Collection Operations Demonstrations:
    // a. map: Apply 10% CampusConnect service charge (fee * 1.10)
    val feesWithServiceCharge: List<Double> = acceptedFees.map { fee ->
        fee * 1.10
    }

    // b. filter: Filter high-value payments of 500 or more
    val highValuePayments: List<Double> = acceptedFees.filter { fee ->
        fee >= 500.0
    }

    // c. reduce: Calculate total valid registration revenue
    // reduce accumulates starting from the first element
    val totalRevenue: Double = if (acceptedFees.isNotEmpty()) {
        acceptedFees.reduce { accumulator, fee -> accumulator + fee }
    } else {
        0.0
    }

    // d. fold: Calculate total campus fund starting with an initial balance
    val initialCampusFund = 2500.0 // Starting campus treasury balance
    val finalCampusFund: Double = acceptedFees.fold(initialCampusFund) { runningTotal, fee ->
        runningTotal + fee
    }

    // 4. Structured Console Report
    println("================================================================================")
    println("                             STRUCTURED AUDIT REPORT                            ")
    println("================================================================================")

    // Accepted Fees
    println("\n[A] ACCEPTED EVENT REGISTRATION FEES (${acceptedFees.size} valid entries):")
    acceptedFees.forEachIndexed { index, fee ->
        println("    ${index + 1}. INR ${"%.2f".format(fee)}")
    }

    // Rejected Entries with Reasons
    println("\n[B] REJECTED ENTRIES WITH REASONS (${rejectedEntries.size} invalid entries):")
    rejectedEntries.forEachIndexed { index, rejected ->
        val displayVal = if (rejected.rawInput.isEmpty()) "<EMPTY STRING>" else "'${rejected.rawInput}'"
        println("    ${index + 1}. Input: ${displayVal.padEnd(16)} -> Reason: ${rejected.reason}")
    }

    // Charged Fees after Service Charge (Demonstrating map & forEach)
    println("\n[C] CHARGED FEES AFTER 10% SERVICE CHARGE (via map & forEach):")
    feesWithServiceCharge.forEachIndexed { index, chargedFee ->
        val originalFee = acceptedFees[index]
        println("    ${index + 1}. Original: INR ${"%.2f".format(originalFee).padEnd(8)} + 10% Charge -> INR ${"%.2f".format(chargedFee)}")
    }

    // High-Value Payments (Demonstrating filter)
    println("\n[D] HIGH-VALUE PAYMENTS (>= INR 500) (via filter):")
    highValuePayments.forEachIndexed { index, fee ->
        println("    ${index + 1}. INR ${"%.2f".format(fee)}")
    }

    // Financial Totals (Demonstrating reduce and fold)
    println("\n[E] REVENUE SUMMARY & TREASURY ACCUMULATION:")
    println("    - Total Valid Registration Revenue (via reduce) : INR ${"%.2f".format(totalRevenue)}")
    println("    - Initial Campus Fund Balance                   : INR ${"%.2f".format(initialCampusFund)}")
    println("    - Final Campus Fund Balance (via fold)           : INR ${"%.2f".format(finalCampusFund)}")

    println("\n================================================================================")
    println("                      PROCESSING COMPLETED SUCCESSFULLY                         ")
    println("================================================================================")
}
