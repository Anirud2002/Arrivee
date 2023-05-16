using System;
using Amazon.DynamoDBv2.DataModel;
using api.DTOs;

namespace api.Entities
{
    [DynamoDBTable("LocationReminderNotifications-Table")]
    public class Notification
    {
        [DynamoDBHashKey]
        public string Username { get; set; } = string.Empty;
        [DynamoDBRangeKey]
        public long CreatedOn { get; set; }
        public string NotificationID { get; set; } = string.Empty;
        public string LocationID { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public bool IsInteracted { get; set; } = false;

        public NotificationViewModel toViewModel()
        {
            return new NotificationViewModel()
            {
                NotificationID = NotificationID,
                CreatedOn = CreatedOn,
                LocationID = LocationID,
                Title = Title,
                Body = Body,
                IsInteracted = IsInteracted
            };
        }

        public class NotificationViewModel
        {
            public string NotificationID { get; set; } = string.Empty;
            public long CreatedOn { get; set; }
            public string LocationID { get; set; } = string.Empty;
            public string Title { get; set; } = string.Empty;
            public string Body { get; set; } = string.Empty;
            public bool IsInteracted { get; set; } = false;
        }
    }
}