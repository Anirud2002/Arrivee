using System;
using Amazon.DynamoDBv2.DataModel;

namespace api.Entities
{
    [DynamoDBTable("LocationReminderGoogleUser-Table")]
    public class GoogleUser
	{
		[DynamoDBHashKey]
		public string Email { get; set; } = string.Empty;
		public string Username { get; set; } = string.Empty;
	}
}

