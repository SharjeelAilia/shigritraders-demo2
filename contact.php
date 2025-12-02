<?php
// contact.php - Handle form submissions for Shigri Traders

// Configuration
$recipient_email = "info@shigritraders.com";
$subject_prefix = "New Website Inquiry: ";

// Function to sanitize input
function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Get and sanitize inputs
    $name = clean_input($_POST["name"]);
    $email = clean_input($_POST["email"]);
    $message = clean_input($_POST["message"]);

    // 2. Validation
    $errors = [];
    if (empty($name)) { $errors[] = "Name is required"; }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors[] = "Valid email is required"; }
    if (empty($message)) { $errors[] = "Message is required"; }

    // 3. Send Email if no errors
    if (empty($errors)) {
        $subject = $subject_prefix . $name;
        
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Message:\n$message\n";

        $headers = "From: $name <$email>\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Attempt to send email
        if (mail($recipient_email, $subject, $email_content, $headers)) {
            // Success: Redirect back with success query param
            header("Location: index.html?status=success#contact");
            exit;
        } else {
            // Server Error
            header("Location: index.html?status=error#contact");
            exit;
        }
    } else {
        // Validation Error
        header("Location: index.html?status=validation_error#contact");
        exit;
    }
} else {
    // Not a POST request
    header("Location: index.html");
    exit;
}
?>
