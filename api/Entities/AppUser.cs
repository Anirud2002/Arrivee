using System;
using Amazon.DynamoDBv2.DataModel;

namespace api.Entities
{
    [DynamoDBTable("LocationReminderUser-Table")]
    public class AppUser
    {
        [DynamoDBHashKey]
        public string Username { get; set; } = string.Empty;
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
        public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();
        public List<string> LocationReminderIDs { get; set; } = new List<string>();
        public List<string> NotificationIDs { get; set; } = new List<string>();
        public bool IsGoogleUser { get; set; } = false;
    }
}

