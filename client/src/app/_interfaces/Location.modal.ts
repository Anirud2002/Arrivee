import { Reminder } from "./Reminder.modal";

export interface Location{
    locationID: string,
    title: string,
    streetAddress: string,
    radius: number,
    coords: Coords,
    radiusUnit: string,
    reminders?: Reminder[]
}

export interface NewLocation{
    title: string,
    streetAddress: string,
    radius: number,
    coords: Coords,
    radiusUnit: string,
    reminders?: Reminder[]
}

export interface Coords{
    latitude: number,
    longitude: number,
}
