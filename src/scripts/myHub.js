import * as signalR from "@microsoft/signalr";

const hubConnection = (roomId) => new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_API_END_POINT}/game/${roomId}`, {
        headers: {
            "X-API-Key": process.env.REACT_APP_API_KEY
        }
    })
    .withAutomaticReconnect()
    .build();

export default hubConnection;