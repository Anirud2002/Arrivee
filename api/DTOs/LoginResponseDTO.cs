using System;
namespace api.DTOs
{
    public class LoginResponseDTO
    {
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsGoogleUser { get; set; } = false;
        public string Token { get; set; } = string.Empty;
    }
}

