using System;
namespace api.DTOs
{
	public class GoogleSignInDTO
	{
        public string Username { get; set; } = string.Empty;
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}

