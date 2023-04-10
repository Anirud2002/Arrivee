using System;
namespace api.DTOs
{
	public class FeedbackDTO
	{
		public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
		public string Feedback { get; set; } = string.Empty;
    }
}

