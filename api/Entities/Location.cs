using System;
using Amazon.DynamoDBv2.DataModel;
using api.DTOs;

namespace api.Entities
{
    [DynamoDBTable("LocationsTable")]
    public class Location
    {
        [DynamoDBHashKey]
        public string LocationID { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public int Radius { get; set; }
        public string RadiusUnit { get; set; } = string.Empty;
        public List<Reminder> Reminders { get; set; } = new List<Reminder>();

        public class Reminder
        {
            public string Title { get; set; } = string.Empty;
        }

        public LocationResponseDTO toViewModel()
        {
            return new LocationResponseDTO()
            {
                LocationID = LocationID,
                UserName = UserName,
                Title = Title,
                StreetAddress = StreetAddress,
                Radius = Radius,
                RadiusUnit = RadiusUnit,
                Reminders = Reminders
            };
        }
    }
}

