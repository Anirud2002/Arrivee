using System;
using api.Entities;
using static api.Entities.Location;

namespace api.DTOs
{
	public class LocationRequestDTO
	{
		public string Title { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public double Radius { get; set; }
        public string RadiusUnit { get; set; } = string.Empty;
        public List<Reminder> Reminders { get; set; } = new List<Reminder>();
    }
}

