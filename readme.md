## Google Auth for AWS Connect Softphone

This project implements a way to authenticate to a Google Project and generate temporary AWS Connect credentials for use with a softphone instance.

### Prerequisites

* Node.js and npm installed (https://nodejs.org/en/download)

### Installation

1. Clone this repository.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the required dependencies.

### Configuration

1. Create a file named `.env` in the project root directory.
2. Add the following environment variables to the `.env` file, replacing the placeholders with your actual values:

- INSTANCE_ID=your_amazon_connect_instance_id
- AWS_REGION=your_aws_region,
- ROLE_ARN=your_iam_role_arn
- CLIENT_ID=your_google_oauth_client_id
- CLIENT_SECRET=your_google_oauth_client_secret
- ROLE_SESSION_NAME=desired_role_session_name

**Note:** Replace the placeholders with your actual values.

### Running the Project

1. Run `npm run start` in your terminal.
2. The application will open a browser window and prompt you to log in with your Google account. **Make sure the account has access to the required Google Project and is also a user in your Amazon Connect instance.**
3. Upon successful authentication, the temporary AWS Connect credentials will be printed to the terminal.

### Using the Credentials

Use the generated credentials (Access Key ID and Secret Access Key) to authenticate your softphone application to your Amazon Connect instance. You can also refer to this example : https://github.com/jagadeeshaby/login-flows/blob/main/public/auth-signin-iframed.html

### Important Notes

* The generated credentials are temporary and will expire after a specific duration. You may need to re-run the application to obtain new credentials periodically.
* Keep your `.env` file secure as it contains sensitive information. Consider using environment variable management tools for production environments.

This project provides a basic example of Google authentication for generating AWS Connect credentials. You may need to modify it based on your specific requirements and security best practices.