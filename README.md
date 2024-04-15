# Blockchain API

This repository contains a simple blockchain API designed to integrate with an EOS blockchain application. The API facilitates interaction with the blockchain, allowing users to perform various actions such as querying data, submitting transactions, and managing accounts.

The application is typically deployed using GitLab CI/CD pipelines, leveraging AWS services for additional persistent storage. Specifically, DynamoDB is utilized to store data securely and efficiently.

## Prerequisites
Before using the API, ensure you have the following prerequisites installed and configured:

Environment Variables: Set relevant environment variables required for the application to function correctly. These variables might include sensitive information such as API keys, endpoint URLs, and credentials.

AWS Credentials: Set up AWS credentials on your local machine. This includes configuring AWS CLI or SDK with access keys and secret access keys to authenticate requests made to AWS services.

## Usage
To use the blockchain API, follow these steps:

Set Environment Variables: Make sure all required environment variables are properly configured. These variables define settings and parameters necessary for the API to operate correctly in your environment.

Configure AWS Credentials: Ensure your local machine is properly configured with AWS credentials. This involves setting up AWS CLI with access keys and secret access keys, or configuring AWS SDKs in your preferred programming language.

Run Locally: To run the API locally for development or testing purposes, execute the following command:

bash `serverless offline --stage dev --aws-profile {your-profile}`

Replace {your-profile} with the AWS profile configured on your local machine. This command starts a local server emulating the AWS Lambda environment, allowing you to test the API endpoints without deploying to AWS.

## Deploy to AWS

When ready to deploy the API to AWS for production use, you can utilize GitLab CI/CD pipelines or deploy manually using the Serverless Framework. Ensure all necessary permissions and configurations are in place for smooth deployment and operation.
Contributing
Contributions to this project are welcome! If you encounter any issues, have suggestions for improvements, or would like to add new features, feel free to submit a pull request or open an issue on the repository.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.







