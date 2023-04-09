using System;
using static api.Entities.Location;

namespace api.DTOs
{
	public class UpdateLocationRequestDTO
	{
        public string LocationID { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public int Radius { get; set; }
        public string RadiusUnit { get; set; } = string.Empty;
        public List<Reminder> Reminders { get; set; } = new List<Reminder>();
    }
}