using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Entities;
using api.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
	public class TokenService : ITokenService
	{
		private readonly SymmetricSecurityKey _key;
		private readonly IConfiguration _config;


		public TokenService(IConfiguration config)
		{
			_config = config;
			_key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:TokenKey"]));
		}

		public string CreateToken(string userName)
		{
			var claims = new List<Claim>()
			{
				new Claim(JwtRegisteredClaimNames.NameId, userName)
			};

			var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512);
			var tokenDescriptor = new SecurityTokenDescriptor()
			{
				Subject = new ClaimsIdentity(claims),
				SigningCredentials = creds,
				Expires = DateTime.Now.AddDays(60)
			};

			var tokenHandler = new JwtSecurityTokenHandler();
			var token = tokenHandler.CreateToken(tokenDescriptor);

			return tokenHandler.WriteToken(token);
		}

	}
}

