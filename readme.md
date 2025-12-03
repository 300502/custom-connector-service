# Custom Connector SDK

## Overview
The **Custom Connector SDK** is designed for users who want to integrate a  custom connectors beyond the pre-built connectors in Search Assist. This SDK is built using **Node.js** and provides flexibility for extending the default functionalities of Search Assist.
## Project Structure

- customConnectorService
    - .env
    - config/
        - config.json
    
    - routes/
        - content.route.js
    - controllers/
        - content.controller.js
    - server.js
    - package.json

## Getting Started

### Clone the Repository
To get started with the CustomConnector SDK, clone the repository:

```
git clone git@bitbucket.org:koreteam1/searchassist-common.git
```
```
cd customConnectorService
```

### Install Dependencies
Once in the project directory, install the necessary dependencies:

```bash
npm install
```

### Packages Used
The SDK leverages the following Node.js packages:

- **dotenv**: For environment variable management.
- **axios**: For making HTTP requests.
- **express**: For setting up the server and API routes.

### Run the Server
To start the service, run the following command:

```bash
node server.js
```

## Code Changes to Use Custom Connector SDK
To integrate your custom connector, make the following code changes:

1. **config/config.json**: Contains configuration details such as API URL, authentication details, and lookup fields.Add your connector’s configuration here.
2. **.env**: Update authorization key which is used to authorize the incoming request.
3. **content.controller.js**: Acts as the controller for returning content from the connector,customize how data from your connector is handled and returned, ensuring the `isContentAvailable` key is part of the response.



### Steps to Add a Custom Connector
1. **Prepare config.json**: Create a config file containing the authentication details, API URL, lookup fields, and other necessary settings for your custom connector. Place this file in `config/config.json`.

   **Sample config.json:**
   ```json
   {
     "name": "customConnector",
     "type": "customConnector",
     "authDetails": {
       "username": "YOUR_USERNAME",
       "password": "YOUR_PASWORD",
       "authorizationType": "BasicAuth"
     },
     "configuration": {
       "api": {
         "contentUrl": "CONTENT_URL",
         "method": "GET"
       },
       "pagination": {
         "limit": "sysparm_limit",
         "offset": "sysparm_offset"
       },
       "lookupFields": {
         "rootField": "result",
         "id": "sys_id",
         "title": "short_description",
         "content": "text",
         "url": "",
         "createdOn": "sys_created_on",
         "updatedOn": "sys_updated_on",
         "type": "sys_class_name",
         "sys_racl": "permissions"
       },
       "hasMore": "rel=\"next\""
     }
   }
   ```

2. **Update .env**: Add or update the Authorization value in the `.env`. This value will be used when calling the custom connector’s API from Search Assist.

3. **Update content.controller.js**: Modify the `get_content_controller` function to return content from your custom connector. Ensure that the response includes the `isContentAvailable` key to indicate whether more content is available for pagination.

   Note: The `isContentAvailable` key is mandatory to signal if further API calls are needed to retrieve additional content.

## API Endpoints
The SDK provides two primary API endpoints:

### Get Config
This endpoint returns the connector configuration.


### Get Content
This endpoint retrieves content based on the limit and offset parameters.

#### Sample CURL Request:
```bash
curl --location '{{protocol}}://{{hostname}}/getContent?limit=1&offset=0' \
--header 'Authorization: ENTER YOUR AUTH KEY'
```
#### Sample Response:
```json
{
    "result": [
        {
            "id": "06eafa3bc3ab3510d1b77aef050131d3",
            "title": "Two-Factor Authentication for SAP Concur",
            "content": "<p><strong><span style=\"font-size: 12pt;\">Two-Factor Authentication for SAP Concur</span></strong></p>\r\n<p> </p>\r\n<p><span style=\"font-size: 8pt;\">This is information from the SAP Concur FAQ</span></p>\r\n<p>As of October 18, 2023, all users who employ basic authentication (entering an SAP Concur username and password) when signing in at <a href=\"http://www.concursolutions.com/\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">www.concursolutions.com</a> on web or on the mobile app will be required to set up two-factor authentication (2FA) at the time of their next sign in.</p>\r\n<p>The links below are resources to help you get 2FA set up and signed in.</p>\r\n<p> </p>\r\n<p><a href=\"https://dam.sap.com/mac/app/p/pdf/asset/preview/FrhUmfQ?ltr&#61;a&amp;rc&#61;10\" target=\"_self\" rel=\"noopener noreferrer nofollow\">Two-Factor Setup Guide for End Users</a></p>\r\n<p> </p>\r\n<p><a href=\"https://dam.sap.com/mac/u/a/kA9GcJq.htm?rc&#61;10\" target=\"_self\" rel=\"noopener noreferrer nofollow\">2FA FAQs</a></p>\r\n<p> </p>\r\n<p><a href=\"https://microlearning.opensap.com/media/Signing&#43;in&#43;to&#43;SAP&#43;Concur/1_1qvk1e82\" target=\"_self\" rel=\"noopener noreferrer nofollow\">Signing In to SAP Concur Desktop With 2FA Demo Video</a> </p>\r\n<p> </p>\r\n<p><a href=\"https://microlearning.opensap.com/media/1_8rh6s6kl\" target=\"_self\" rel=\"noopener noreferrer nofollow\">Signing In to SAP Concur Mobile (iPhone Demo Video)</a></p>\r\n<p> </p>\r\n<p><a href=\"https://microlearning.opensap.com/media/1_07tka82t\" target=\"_self\" rel=\"noopener noreferrer nofollow\">Signing In to SAP Concur Mobile (Android Demo Video)</a></p>\r\n<p> </p>\r\n<div id=\"anchor1\"></div>\r\n<p><span style=\"box-sizing: border-box; text-decoration: underline;\"><strong>Why 2FA?</strong></span></p>\r\n<p>In today&#39;s digital landscape, security is of utmost concern, and we are committed to safeguarding your sensitive information and personal data. Two-Factor Authentication is a robust and proven method that significantly enhances the security of your accounts. Reputations are valuable assets, and if a security incident happens, it can tarnish an image in the eyes of customers, partners, and the general public. We know that your confidence in our ability to safeguard your data is crucial. We want to reassure you that we are investing in stronger security measures and continuously monitoring and improving our systems by bring 2FA to your accounts. There are more than <a target=\"_self\">24 billion usernames and passwords</a> on the dark web as of June 2022. Hackers are getting smarter every day and username/passwords are vulnerable to risk of unauthorized access, brute force attacks, various cyber threats, such as phishing, credential stuffing, password breaches and can be stolen by third parties. Enforcing the use of a 2FA significantly reduces the risk of unauthorized access and increases confidence that your accounts will stay safe from cyber criminals.</p>\r\n<p> </p>",
            "url": "",
            "type": "kb_knowledge",
            "createdOn": "2024-01-12 13:11:58",
            "updatedOn": "2024-01-12 13:14:30",
            "permissions": ["xxxx"],
            "rawData": {
                "short_description": "Two-Factor Authentication for SAP Concur",
                "roles": "",
                "wiki": null,
                "direct": "false",
                "rating": "",
                "description": "",
                "generated_with_now_assist": "false",
                "source": "",
                "sys_updated_on": "2024-01-12 13:14:30",
                "disable_suggesting": "false",
                "sys_class_name": "kb_knowledge",
                "number": "KB0010007",
                "sys_id": "06eafa3bc3ab3510d1b77aef050131d3",
                "use_count": "0",
                "sys_updated_by": "cswartz",
                "flagged": "false",
                "disable_commenting": "false",
                "sys_created_on": "2024-01-12 13:11:58",
                "sys_domain": {
                    "link": "https://ven06090.service-now.com/api/now/table/sys_user_group/global",
                    "value": "global"
                },
                "valid_to": "2100-01-01",
                "retired": "",
                "workflow_state": "published",
                "text": "<p><strong><span style=\"font-size: 12pt;\">Two-Factor Authentication for SAP Concur</span></strong></p>\r\n<p> </p>\r\n<p><span style=\"font-size: 8pt;\">This is information from the SAP Concur FAQ</span></p>\r\n<p>As of October 18, 2023, all users who employ basic authentication (entering an SAP Concur username and password) when signing in at <a href=\"http://www.concursolutions.com/\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">www.concursolutions.com</a> on web or on the mobile app will be required to set up two-factor authentication (2FA) at the time of their next sign in.</p>\r\n<p>The links below are resources to help you get 2FA set up and signed in.</p>\r\n<p> </p>\r\n<p><a href=\"https://dam.sap.com/mac/app/p/pdf/asset/preview/FrhUmfQ?ltr&#61;a&amp;rc&#61;10\" target=\"_self\" rel=\"noopener noreferrer nofollow\">Two-Factor Setup Guide for End Users</a></p>\r\n<p> </p>\r\n<p><a href=\"https://dam.sap.com/mac/u/a/kA9GcJq.htm?rc&#61;10\" target=\"_self\" rel=\"noopener noreferrer nofollow\">2FA FAQs</a></p>\r\n<p> </p>\r\n<p><a href=\"https://microlearning.opensap.com/media/Signing&#43;in&#43;to&#43;SAP&#43;Concur/1_1qvk1e82\" target=\"_self\" rel=\"noopener noreferrer nofollow\">Signing In to SAP Concur Desktop With 2FA Demo Video</a> </p>\r\n<p> </p>\r\n<p><a href=\"https://microlearning.opensap.com/media/1_8rh6s6kl\" target=\"_self\" rel=\"noopener noreferrer nofollow\">Signing In to SAP Concur Mobile (iPhone Demo Video)</a></p>\r\n<p> </p>\r\n<p><a href=\"https://microlearning.opensap.com/media/1_07tka82t\" target=\"_self\" rel=\"noopener noreferrer nofollow\">Signing In to SAP Concur Mobile (Android Demo Video)</a></p>\r\n<p> </p>\r\n<div id=\"anchor1\"></div>\r\n<p><span style=\"box-sizing: border-box; text-decoration: underline;\"><strong>Why 2FA?</strong></span></p>\r\n<p>In today&#39;s digital landscape, security is of utmost concern, and we are committed to safeguarding your sensitive information and personal data. Two-Factor Authentication is a robust and proven method that significantly enhances the security of your accounts. Reputations are valuable assets, and if a security incident happens, it can tarnish an image in the eyes of customers, partners, and the general public. We know that your confidence in our ability to safeguard your data is crucial. We want to reassure you that we are investing in stronger security measures and continuously monitoring and improving our systems by bring 2FA to your accounts. There are more than <a target=\"_self\">24 billion usernames and passwords</a> on the dark web as of June 2022. Hackers are getting smarter every day and username/passwords are vulnerable to risk of unauthorized access, brute force attacks, various cyber threats, such as phishing, credential stuffing, password breaches and can be stolen by third parties. Enforcing the use of a 2FA significantly reduces the risk of unauthorized access and increases confidence that your accounts will stay safe from cyber criminals.</p>\r\n<p> </p>",
                "sys_created_by": "cswartz",
                "display_attachments": "false",
                "image": "",
                "sys_view_count": "5",
                "article_type": "text",
                "cmdb_ci": "",
                "author": {
                    "link": "https://ven06090.service-now.com/api/now/table/sys_user/940d860b47932510b00ec43d026d4336",
                    "value": "940d860b47932510b00ec43d026d4336"
                },
                "can_read_user_criteria": "",
                "sys_mod_count": "2",
                "active": "true",
                "cannot_read_user_criteria": "",
                "published": "2024-01-12",
                "helpful_count": "0",
                "sys_domain_path": "/",
                "sys_tags": "",
                "instrumentation_metadata": "",
                "replacement_article": "",
                "meta_description": "Two-Factor Authentication for SAP Concur   This is information from the SAP Concur FAQ As of October",
                "taxonomy_topic": "",
                "kb_knowledge_base": {
                    "link": "https://ven06090.service-now.com/api/now/table/kb_knowledge_base/a7e8a78bff0221009b20ffffffffff17",
                    "value": "a7e8a78bff0221009b20ffffffffff17"
                },
                "meta": "",
                "view_as_allowed": "true",
                "topic": "General",
                "category": "",
                "kb_category": {
                    "link": "https://ven06090.service-now.com/api/now/table/kb_category/845732b7c3ab3510d1b77aef05013150",
                    "value": "845732b7c3ab3510d1b77aef05013150"
                }
            }
        }
    ],
    "isContentAvailable": false
}
```

### Parameters:
- **limit**: The number of records to retrieve.
- **offset**: The starting point for the records.

Note: For both endpoints, the Authorization header is mandatory. It should contain the Base64-encoded value of the authorization key set in the `.env` file.

## Testing the SDK

1. **Install Dependencies**: Make sure all required dependencies are installed.
   ```bash
   npm install
   ```

2. **Run the Server**: Start your server to test the new LLM integration.
   ```bash
   node server.js
   ```

3. **Send a Test Request**: Use an API client (like Postman) to send a request to your endpoint and verify that the integration with Claude is working as expected.
## Conclusion
The CustomConnector SDK provides a flexible way to integrate custom connectors into the Search Assist platform.This README provides a structured approach to integrating a custom connector, ensuring that all necessary changes are clearly outlined and explained. For further documentation or issues, feel free to consult the repository.

