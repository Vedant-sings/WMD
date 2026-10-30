package campusconnect.events

/**
 * Base class representing a general campus member.
 * Demonstrates open class for inheritance, primary constructor, properties with val/var,
 * nullable types with safe call handling, and base implementations for polymorphism.
 */
open class CampusMember(
    val id: String,
    var name: String,
    var email: String?,
    val registeredEvents: List<String>,
    val interests: Set<String>,
    val baseRegistrationFee: Double = 500.0
) {
    /**
     * Calculates the registration fee for the member.
     * Can be overridden by subclasses to demonstrate polymorphism.
     */
    open fun calculateRegistrationFee(): Double {
        // Base calculation: flat fee per event based on baseRegistrationFee
        return registeredEvents.size * baseRegistrationFee
    }

    /**
     * Formats and returns member details.
     * Can be overridden by subclasses to add specialized attributes.
     */
    open fun getDetails(): String {
        val safeEmail = email?.lowercase() ?: "No email provided"
        return "[$id] $name | Email: $safeEmail | Events Registered: ${registeredEvents.size} | Base Fee: Rs. %.2f".format(baseRegistrationFee)
    }

    /**
     * Checks if this member is registered for a given event name.
     */
    fun isRegisteredFor(eventName: String): Boolean {
        return registeredEvents.any { it.equals(eventName, ignoreCase = true) }
    }
}

/**
 * Subclass representing a student member in CampusConnect.
 * Applies studentDiscount and tracks collegeName.
 */
class StudentMember(
    id: String,
    name: String,
    email: String?,
    registeredEvents: List<String>,
    interests: Set<String>,
    val collegeName: String,
    val studentDiscount: Double = 0.25, // 25% discount
    baseRegistrationFee: Double = 400.0
) : CampusMember(id, name, email, registeredEvents, interests, baseRegistrationFee) {

    override fun calculateRegistrationFee(): Double {
        val grossFee = registeredEvents.size * baseRegistrationFee
        val discountAmount = grossFee * studentDiscount
        return grossFee - discountAmount
    }

    override fun getDetails(): String {
        val safeEmail = email ?: "N/A"
        val discountPercent = (studentDiscount * 100).toInt()
        return "[Student - $id] $name | College: $collegeName | Email: $safeEmail | Events: ${registeredEvents.size} | Discount: $discountPercent%% | Net Fee: Rs. %.2f".format(calculateRegistrationFee())
    }
}

/**
 * Subclass representing a faculty member in CampusConnect.
 * Faculty members receive subsidized/department-sponsored fee rates.
 */
class FacultyMember(
    id: String,
    name: String,
    email: String?,
    registeredEvents: List<String>,
    interests: Set<String>,
    val department: String,
    val facultyAllowance: Double = 100.0, // Subsidized flat discount per event
    baseRegistrationFee: Double = 350.0
) : CampusMember(id, name, email, registeredEvents, interests, baseRegistrationFee) {

    override fun calculateRegistrationFee(): Double {
        val feePerEvent = (baseRegistrationFee - facultyAllowance).coerceAtLeast(0.0)
        return registeredEvents.size * feePerEvent
    }

    override fun getDetails(): String {
        val safeEmail = email ?: "N/A"
        return "[Faculty - $id] $name | Dept: $department | Email: $safeEmail | Events: ${registeredEvents.size} | Net Fee: Rs. %.2f".format(calculateRegistrationFee())
    }
}

/**
 * Subclass representing an external guest member in CampusConnect.
 * Includes external organizational affiliation and standard guest registration surcharge.
 */
class GuestMember(
    id: String,
    name: String,
    email: String?,
    registeredEvents: List<String>,
    interests: Set<String>,
    val organization: String,
    val guestSurcharge: Double = 150.0,
    baseRegistrationFee: Double = 600.0
) : CampusMember(id, name, email, registeredEvents, interests, baseRegistrationFee) {

    override fun calculateRegistrationFee(): Double {
        return registeredEvents.size * (baseRegistrationFee + guestSurcharge)
    }

    override fun getDetails(): String {
        val safeEmail = email ?: "N/A"
        return "[Guest - $id] $name | Org: $organization | Email: $safeEmail | Events: ${registeredEvents.size} | Net Fee: Rs. %.2f".format(calculateRegistrationFee())
    }
}
