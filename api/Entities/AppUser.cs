using System;
using Amazon.DynamoDBv2.DataModel;

namespace api.Entities
{
	[DynamoDBTable("LocationReminderUser")]
	public class AppUser
	{
		[DynamoDBHashKey]
		public string AppUserID { get; set; } = string.Empty;
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
		public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();
		public List<string> LocationReminderIDs { get; set; } = new List<string>();
	}
}

