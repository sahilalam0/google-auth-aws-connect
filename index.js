import { ConnectClient,GetFederationTokenCommand } from "@aws-sdk/client-connect";
import { fromWebToken } from "@aws-sdk/credential-providers";
import http from 'http';
import url from 'url';
import opn from 'open';
import destroyer from 'server-destroy';
import { google } from 'googleapis';
import 'dotenv/config';
// fullcreative workspace
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth2callback' // NOTE: Redirect URL should be added in the google project config as well
);
/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({auth: oauth2Client});

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 */
async function authenticate() {
    const scopes = [
        'https://www.googleapis.com/auth/contacts.readonly',
        'https://www.googleapis.com/auth/user.emails.read',
        'profile',
    ];
    return new Promise((resolve, reject) => {
        // grab the url that will be used for authorization
        const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
        });
        const server = http
        .createServer(async (req, res) => {
            try {
            if (req.url.indexOf('/oauth2callback') > -1) {
                const qs = new url.URL(req.url, 'http://localhost:3000')
                .searchParams;
                res.end('Authentication successful! Please return to the console.');
                server.destroy();
                const {tokens} = await oauth2Client.getToken(qs.get('code'));
                oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
                resolve(oauth2Client);
            }
            } catch (e) {
            reject(e);
            }
        })
        .listen(3000, () => {
            // open the browser to the authorize url to start the workflow
            opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
        });
        destroyer(server);
    });
}

const generateAWSCreds = async (webIdentityToken) => {
    const credentials = fromWebToken({
        roleArn: process.env.ROLE_ARN,
        webIdentityToken,
        clientConfig: { region: process.env.AWS_REGION },
        roleSessionName: process.env.ROLE_SESSION_NAME,
        durationSeconds: 3600,
    });
    const client = new ConnectClient({
        region : process.env.AWS_REGION,
        credentials
    });
    const command = new GetFederationTokenCommand({
        InstanceId: process.env.INSTANCE_ID,
    });
    const response = await client.send(command);
    const c = {
        ...response.Credentials,
        AccessTokenExpiration:response.Credentials.AccessTokenExpiration.getTime(),
        RefreshTokenExpiration:response.Credentials.RefreshTokenExpiration.getTime(),
    };
    console.log(JSON.stringify(c)); 
};

authenticate().then((client)=>generateAWSCreds(client.credentials.id_token));
