using System;
namespace api.DTOs
{
	public class NotificationDTO
	{
		public string Username { get; set; } = string.Empty;
		public string LocationID { get; set; } = string.Empty;
		public long CreatedOn { get; set; }
		public string Title { get; set; } = string.Empty;
		public string Body { get; set; } = string.Empty;
	}
}

