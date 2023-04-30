using System;
using System.Security.Claims;

namespace api.Extensions
{
	public static class ClaimsPrincipalExtenstion
	{
		// more secure way
		public static bool Exists(this ClaimsPrincipal user, string username)
		{
			return user.FindFirst(ClaimTypes.NameIdentifier)?.Value == username;
		}

		public static string GetUsername(this ClaimsPrincipal user)
		{
			return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		}
	}
}

