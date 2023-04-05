import { Reminder } from "./Reminder.modal";

export interface Location{
    title: string,
    streetAddress: string,
    radius: number,
    radiusUnit: string,
    reminders?: Reminder[]
}
