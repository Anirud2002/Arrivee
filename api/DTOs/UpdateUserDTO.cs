using System;
namespace api.DTOs
{
	public class UpdateUserDTO
	{
		public string Firstname { get; set; } = string.Empty;
		public string Lastname { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}

