using System;
namespace api.Entities
{
	public class AppUser
	{
		public string AppUserID { get; set; } = string.Empty;
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string PasswordHash { get; set; } = string.Empty;
		public string PasswordSalt { get; set; } = string.Empty;
		public List<string> LocationReminderIDs { get; set; } = new List<string>();
	}
}

