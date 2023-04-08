using System;
using api.Entities;

namespace api.Interfaces
{
	public interface ITokenService
	{
		public string CreateToken(string userName);
	}
}

