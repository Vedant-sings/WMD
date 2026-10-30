package campusconnect.events

/**
 * CampusConnect Event Registration Manager
 * Demonstrates:
 * - Basic data types (String, Int, Double, Boolean)
 * - val and var
 * - Nullable types and safe calls (?. and ?:)
 * - Collections: List, Set, Map
 * - Collection operations: filter, map, forEach, count, sumOf, groupBy
 * - Polymorphism via overridden methods
 */
fun main() {
    println("=".repeat(80))
    println("          CAMPUSCONNECT - EVENT REGISTRATION MANAGER (EXP 5)")
    println("=".repeat(80))

    // 1. Basic Data Types & Variables (val and var)
    val academicTerm: String = "Fall 2026"
    val isRegistrationActive: Boolean = true
    var totalOperationsLogged: Int = 0
    val systemVersion: Double = 5.0

    println("\n[System Info] Term: $academicTerm | Status Active: $isRegistrationActive | Version: $systemVersion")

    // 2. List<CampusMember> containing at least five mixed members
    // Also showcases nullable email with safe-call / elvis handling
    val members: List<CampusMember> = listOf(
        StudentMember(
            id = "STU-101",
            name = "Aarav Sharma",
            email = "aarav.sharma@campus.edu",
            registeredEvents = listOf("AI Innovation Summit", "Hackathon", "Sports Meet"),
            interests = setOf("Artificial Intelligence", "Coding", "Athletics"),
            collegeName = "School of Computing",
            studentDiscount = 0.25,
            baseRegistrationFee = 400.0
        ),
        StudentMember(
            id = "STU-102",
            name = "Ananya Iyer",
            email = null, // Demonstrates nullable type handling
            registeredEvents = listOf("AI Innovation Summit", "Hackathon"),
            interests = setOf("Machine Learning", "Cloud Computing"),
            collegeName = "School of Computing",
            studentDiscount = 0.30,
            baseRegistrationFee = 400.0
        ),
        FacultyMember(
            id = "FAC-201",
            name = "Dr. Rajesh Kulkarni",
            email = "rajesh.k@campus.edu",
            registeredEvents = listOf("AI Innovation Summit", "Cultural Fest"),
            interests = setOf("Artificial Intelligence", "Classical Arts", "Robotics"),
            department = "Computer Science & Engineering",
            facultyAllowance = 150.0,
            baseRegistrationFee = 350.0
        ),
        GuestMember(
            id = "GST-301",
            name = "Vikram Malhotra",
            email = "vikram@techcorp.io",
            registeredEvents = listOf("AI Innovation Summit", "Hackathon", "Cultural Fest"),
            interests = setOf("Industry Mentorship", "Venture Capital", "Robotics"),
            organization = "TechCorp Solutions",
            guestSurcharge = 150.0,
            baseRegistrationFee = 600.0
        ),
        StudentMember(
            id = "STU-103",
            name = "Rohan Verma",
            email = "rohan.v@campus.edu",
            registeredEvents = listOf("Sports Meet"),
            interests = setOf("Football", "Athletics"),
            collegeName = "School of Management",
            studentDiscount = 0.20,
            baseRegistrationFee = 400.0
        ),
        FacultyMember(
            id = "FAC-202",
            name = "Prof. Sneha Deshmukh",
            email = null, // Another nullable demonstration
            registeredEvents = listOf("Cultural Fest", "Sports Meet", "AI Innovation Summit"),
            interests = setOf("Music", "Drama", "Artificial Intelligence"),
            department = "Humanities & Sciences",
            facultyAllowance = 100.0,
            baseRegistrationFee = 350.0
        )
    )

    // 3. Map<String, CampusMember> indexed by member ID
    val memberMap: Map<String, CampusMember> = members.associateBy { it.id }

    // 4. Set<String> to store unique event interests across all members
    val allUniqueInterests: Set<String> = members.flatMap { it.interests }.toSet()

    // -------------------------------------------------------------------------
    // Output 1: Every member's details through POLYMORPHISM
    // -------------------------------------------------------------------------
    println("\n" + "-".repeat(80))
    println("1. ALL REGISTERED CAMPUS MEMBERS (POLYMORPHISM DEMONSTRATION)")
    println("-".repeat(80))
    members.forEach { member: CampusMember ->
        // Invokes overridden getDetails() and calculateRegistrationFee() polymorphically at runtime
        println(" * ${member.getDetails()}")
        totalOperationsLogged++
    }

    // -------------------------------------------------------------------------
    // Output 2: Students registered for technical events (filter, map)
    // -------------------------------------------------------------------------
    println("\n" + "-".repeat(80))
    println("2. STUDENTS REGISTERED FOR TECHNICAL EVENTS ('AI Innovation Summit' or 'Hackathon')")
    println("-".repeat(80))
    val technicalEvents = setOf("AI Innovation Summit", "Hackathon")
    val techStudents = members
        .filterIsInstance<StudentMember>()
        .filter { student -> student.registeredEvents.any { it in technicalEvents } }

    techStudents.forEach { student ->
        val matchingEvents = student.registeredEvents.filter { it in technicalEvents }
        println(" * Student: ${student.name} (${student.id}) | College: ${student.collegeName} | Tech Events: $matchingEvents")
        totalOperationsLogged++
    }

    // -------------------------------------------------------------------------
    // Output 3: Members with more than two registrations (filter, count)
    // -------------------------------------------------------------------------
    println("\n" + "-".repeat(80))
    println("3. MEMBERS WITH MORE THAN 2 EVENT REGISTRATIONS (HIGH ENGAGEMENT)")
    println("-".repeat(80))
    val multiEventMembers = members.filter { it.registeredEvents.size > 2 }
    val multiEventCount = members.count { it.registeredEvents.size > 2 }

    println("Total members with > 2 events: $multiEventCount")
    multiEventMembers.forEach { member ->
        println(" * [${member.id}] ${member.name} (${member::class.simpleName}) -> ${member.registeredEvents.size} events: ${member.registeredEvents}")
        totalOperationsLogged++
    }

    // -------------------------------------------------------------------------
    // Output 4 & 5: Total registration revenue & Average registration fee (sumOf)
    // -------------------------------------------------------------------------
    println("\n" + "-".repeat(80))
    println("4. FINANCIAL ANALYTICS (REVENUE & AVERAGE FEES)")
    println("-".repeat(80))
    val totalRevenue: Double = members.sumOf { it.calculateRegistrationFee() }
    val averageFee: Double = if (members.isNotEmpty()) totalRevenue / members.size else 0.0

    println(" * Total Registered Members  : ${members.size}")
    println(" * Total Registration Revenue: Rs. %.2f".format(totalRevenue))
    println(" * Average Fee Per Member    : Rs. %.2f".format(averageFee))
    totalOperationsLogged += 2

    // -------------------------------------------------------------------------
    // Output 6: Grouped members by type (groupBy, map)
    // -------------------------------------------------------------------------
    println("\n" + "-".repeat(80))
    println("5. MEMBERS GROUPED BY MEMBERSHIP TYPE (groupBy)")
    println("-".repeat(80))
    val groupedByType: Map<String, List<CampusMember>> = members.groupBy { member ->
        when (member) {
            is StudentMember -> "Student Members"
            is FacultyMember -> "Faculty Members"
            is GuestMember -> "External Guest Members"
            else -> "General Members"
        }
    }

    groupedByType.forEach { (typeGroup, memberList) ->
        val names = memberList.map { it.name }.joinToString(", ")
        val subtotalRevenue = memberList.sumOf { it.calculateRegistrationFee() }
        println(" * $typeGroup (${memberList.size}):")
        println("     Members : $names")
        println("     Subtotal: Rs. %.2f".format(subtotalRevenue))
        totalOperationsLogged++
    }

    // -------------------------------------------------------------------------
    // Output 7: Unique interests across all members (Set collection)
    // -------------------------------------------------------------------------
    println("\n" + "-".repeat(80))
    println("6. UNIQUE CAMPUS INTERESTS ACROSS ALL MEMBERS (Set<String>)")
    println("-".repeat(80))
    println("Total Distinct Interests: ${allUniqueInterests.size}")
    allUniqueInterests.sorted().forEachIndexed { index, interest ->
        val interestedCount = members.count { member -> member.interests.contains(interest) }
        println("   ${index + 1}. $interest ($interestedCount interested)")
        totalOperationsLogged++
    }

    // -------------------------------------------------------------------------
    // Output 8: Direct Lookup using Map<String, CampusMember>
    // -------------------------------------------------------------------------
    println("\n" + "-".repeat(80))
    println("7. FAST LOOKUP USING Map<String, CampusMember>")
    println("-".repeat(80))
    val queryIds = listOf("STU-101", "GST-301", "FAC-999")
    queryIds.forEach { qId ->
        val foundMember = memberMap[qId]
        if (foundMember != null) {
            println(" * Lookup [$qId] FOUND: ${foundMember.getDetails()}")
        } else {
            println(" * Lookup [$qId] NOT FOUND: Member does not exist in registry.")
        }
        totalOperationsLogged++
    }

    println("\n" + "=".repeat(80))
    println("Execution completed successfully! Total operations logged: $totalOperationsLogged")
    println("=".repeat(80))
}
