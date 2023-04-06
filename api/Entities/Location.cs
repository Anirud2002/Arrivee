using System;
namespace api.Entities
{
	public class Location
	{
		public string LocationID { get; set; } = string.Empty;
		public string AppUserID { get; set; } = string.Empty;
		public string Title { get; set; } = string.Empty;
		public string StreetAddress { get; set; } = string.Empty;
		public string Radius { get; set; } = string.Empty;
		public string RadiusUnit { get; set; } = string.Empty;
		public List<Reminder> Reminders { get; set; } = new List<Reminder>();

		public class Reminder
		{
			public string Title { get; set; } = string.Empty;
		}	
	}
}

