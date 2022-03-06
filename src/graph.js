import { graphConfig } from "./authConfig";

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */
export async function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getInbox(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphMeInbox, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function updateReadStatus(accessToken, mailID) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json")

    const options = {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({isRead: true})
    };

    return fetch(`${graphConfig.graphUpdateMsg}/${mailID}`, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}



