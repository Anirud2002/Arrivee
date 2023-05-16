export interface NotificationDTO {
    username: string,
    createdOn: number, // utc time in miliseconds
    locationID: string,
    title: string,
    body: string   
}

export interface NotificationResponseDTO {
    notificationID: string,
    createdOn: number, // utc time in miliseconds
    locationID: string,
    title: string,
    body: string,
    isInteracted: boolean
}