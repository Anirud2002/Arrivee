using System;
using System.Security.Claims;

namespace api.Extensions
{
	public static class ClaimsPrincipalExtenstion
	{
		public static bool Exists(this ClaimsPrincipal user, string userName)
		{
			return user.FindFirst(ClaimTypes.NameIdentifier)?.Value == userName;
		}
	}
}

